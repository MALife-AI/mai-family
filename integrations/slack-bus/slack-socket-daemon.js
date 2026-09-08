#!/usr/bin/env node
'use strict';
// slack-socket-daemon.js — Slack Socket Mode 실시간 수신 데몬 (푸시, 폴링 아님).
// apps.connections.open(xapp 토큰) → WebSocket → message 이벤트를 즉시 <busRoot>/inbox/에 기록.
// Liam(U09EV0A952M)의 메시지만 기록한다. nohup 분리 실행 전제. Node 22 네이티브 WebSocket 사용.
const fs = require('fs');
const path = require('path');

const ROOT = process.env.MAI_BUS_ROOT || '/Users/lsc/mai-family/.bus';
const HUMAN = 'U09EV0A952M';
const INBOX = path.join(ROOT, 'inbox');
// 역할: 'primary'(맥, 기본) | 'secondary'(2호기 — 워치독이 MAI_ROLE로 지정).
// secondary는 항상 수신하고, 1호기 생존 신호(hb 메시지)는 절대 쓰지 않는다(단일 작성자 원칙).
const ROLE = process.env.MAI_ROLE || 'primary';

// PID 파일 — 워치독이 권한 경계(관리자 세션 등) 때문에 CommandLine 조회로 데몬을 못 볼 때의
// 보조 탐지 수단 (2026-08-11 유령 데몬 사건: 수동 실행 데몬이 8시간 미탐지).
try { fs.writeFileSync(path.join(ROOT, 'daemon.pid'), String(process.pid)); } catch {}
process.on('exit', () => {
  try {
    if (fs.readFileSync(path.join(ROOT, 'daemon.pid'), 'utf8').trim() === String(process.pid)) {
      fs.unlinkSync(path.join(ROOT, 'daemon.pid'));
    }
  } catch {}
});

function log(msg) { process.stderr.write('[MaiSocket] ' + new Date().toISOString() + ' ' + msg + '\n'); }

function channelMap() {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
    const rev = {};
    for (const [k, v] of Object.entries(m)) if (typeof v === 'string' && /^[CD]/.test(v)) rev[v] = k;
    return rev;
  } catch { return {}; }
}

// 열려 있는 소켓 추적 — 양보 전환 시 전부 즉시 끊는다.
// (Socket Mode 연결은 기계 단위로 한쪽만: 맥·2호기가 동시에 열면 이벤트가 무작위 분배된다.
//  같은 기계 안의 다중 연결은 안전 — 같은 inbox로 모인다.)
const activeSockets = new Set();

async function connectOnce(tag) {
  const xapp = fs.readFileSync(path.join(ROOT, 'slack-app.token'), 'utf8').trim();
  const res = await fetch('https://slack.com/api/apps.connections.open', {
    method: 'POST', headers: { authorization: 'Bearer ' + xapp },
  });
  const d = await res.json();
  if (!d.ok) throw new Error('connections.open: ' + d.error);
  const ws = new WebSocket(d.url);
  activeSockets.add(ws);
  // 좀비 방지: 10분마다 강제 재수립 (다른 쪽 루프가 5분 시차로 살아 있어 공백 없음)
  const lifetime = setTimeout(() => { try { ws.close(); } catch {} }, 10 * 60 * 1000);
  return new Promise((resolve) => {
    ws.onopen = () => log('[' + (tag || '-') + '] 연결됨');
    ws.onmessage = (ev) => {
      let env;
      try { env = JSON.parse(ev.data); } catch { return; }
      if (env.envelope_id) ws.send(JSON.stringify({ envelope_id: env.envelope_id })); // 즉시 ack
      if (env.type === 'disconnect') { log('서버 재연결 요청'); ws.close(); return; }
      // 버튼 클릭(허용/거부) — Liam 클릭만 인정, inbox에 _action 항목으로 기록
      if (env.type === 'interactive' && env.payload && env.payload.type === 'block_actions') {
        const p = env.payload;
        if (!p.user || p.user.id !== HUMAN || !p.actions || !p.actions.length) return;
        const a = p.actions[0];
        fs.mkdirSync(INBOX, { recursive: true });
        fs.writeFileSync(path.join(INBOX, Date.now() + '-action.json'),
          JSON.stringify([{ repo: '_action', channel: p.channel && p.channel.id, ts: p.message && p.message.ts,
            text: a.action_id + ':' + (a.value || '') }], null, 1));
        log('버튼: ' + a.action_id + ' ' + (a.value || ''));
        // 즉시 피드백 (Liam 지시 2026-08-11): 클릭 즉시 버튼 제거 + 선택 결과 표시.
        // 워커 처리를 기다리지 않는다 — 워커는 나중에 "진행 중/완료"로 다시 갱신한다.
        (async () => {
          try {
            const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
            const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
            const verdict = a.action_id.startsWith('approve') ? '✅ 허용 접수됨 — 처리 시작' : '❌ 거부 접수됨';
            await fetch('https://slack.com/api/chat.update', {
              method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
              body: JSON.stringify({ channel: p.channel.id, ts: p.message.ts,
                text: ((p.message && p.message.text) || '질문') + '\n' + verdict, blocks: [] }),
            });
          } catch (err) { log('버튼 피드백 실패: ' + err.message); }
        })();
        return;
      }
      const e = env.payload && env.payload.event;
      if (!e || e.type !== 'message' || (e.subtype && e.subtype !== 'file_share') || e.bot_id || e.user !== HUMAN) return;
      const rev = channelMap();
      const repo = rev[e.channel];
      if (!repo) return; // 우리 채널이 아니면 무시
      // _status 전용 커맨드는 데몬이 결정적으로 즉시 처리 — LLM 해석 없이 (BRIDGE-LOOP §c-4/§c-5)
      if (repo === '_status' && handleStatusCommand((e.text || '').trim(), e.channel)) return;
      fs.mkdirSync(INBOX, { recursive: true });
      const entry = { repo, channel: e.channel, ts: e.ts, text: e.text || '' };
      const finish = (localPaths, failed) => {
        if (localPaths && localPaths.length) entry.files = localPaths;
        if (failed) entry.text += ' [첨부 ' + failed + '건 다운로드 실패 — 데몬 로그 확인]';
        fs.writeFileSync(path.join(INBOX, Date.now() + '.json'), JSON.stringify([entry], null, 1));
        log('메시지 기록: ' + repo + (entry.files ? ' (첨부 ' + entry.files.length + ')' : ''));
        // 2호기는 접수를 즉시 회신 — 워커(claude) 부재 시에도 "받았음"이 보이게.
        // 기록된 메시지는 git으로 맥에 동기화되므로 맥 복귀(또는 워커 가용) 시 순차 처리된다.
        if (ROLE === 'secondary') {
          postStatus(e.channel, '📥 접수(2호기) — 기록 완료. 처리는 워커 가용 시 또는 맥 복귀 후 순차 진행됩니다.').catch(() => {});
        }
      };
      if (e.files && e.files.length) {
        downloadFiles(e.files).then((r) => finish(r.paths, r.failed)).catch((err) => { log('첨부 처리 실패: ' + err.message); finish([], e.files.length); });
      } else finish();
    };
    ws.onclose = () => { log('[' + (tag || '-') + '] 연결 종료'); clearTimeout(lifetime); activeSockets.delete(ws); resolve(); };
    ws.onerror = (err) => { log('[' + (tag || '-') + '] 오류: ' + (err.message || 'ws error')); };
  });
}

// 첨부파일 수신 — url_private_download를 봇 토큰으로 내려받아 files/in/에 저장.
// files:read 스코프가 없으면 Slack이 로그인 HTML을 200으로 돌려준다 — 검출해 실패 처리.
// 실패해도 메시지 자체는 인박스에 적재된다(무손실 — 텍스트에 실패 표시).
async function downloadFiles(files) {
  const out = { paths: [], failed: 0 };
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  const dir = path.join(ROOT, 'files', 'in');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) {
    try {
      const url = f.url_private_download || f.url_private;
      if (!url) throw new Error('다운로드 URL 없음');
      const res = await fetch(url, { headers: { authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      const head = buf.slice(0, 200).toString('utf8').toLowerCase();
      if (head.includes('<!doctype html') && !/html/.test(f.mimetype || '')) {
        throw new Error('files:read 스코프 없음(로그인 페이지 응답)');
      }
      const safe = String(f.name || f.id || 'file').replace(/[^\w.\-가-힣]/g, '_').slice(-80);
      const p = path.join(dir, Date.now() + '-' + safe);
      fs.writeFileSync(p, buf);
      out.paths.push(p);
      log('첨부 저장: ' + p + ' (' + buf.length + 'B)');
    } catch (err) { out.failed++; log('첨부 다운로드 실패: ' + (f.name || f.id) + ' — ' + err.message); }
  }
  return out;
}

async function postStatus(channel, text) {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ channel, text }),
  });
}

// 전환 즉시 반영: hb 1분 틱을 기다리지 않고 심장박동 메시지를 곧바로 갱신한다(최대 60초 단축).
async function updateHbNow(mode) {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  if (!m._status || !m._status_hb_ts) return;
  const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  await fetch('https://slack.com/api/chat.update', {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ channel: m._status, ts: m._status_hb_ts,
      text: '🫀 ' + mode + ' ' + new Date().toISOString() }),
  });
}

// _status 전용 커맨드("전환"·"현황")를 데몬이 코드로 즉시 처리한다 — 워커(LLM) 해석 배제.
// 2026-08-10 "전환" 오해석 사고 후속: 채널 고정 + 키워드 고정 + 결정적 실행 3중 고정.
// 처리했으면 true를 돌려 inbox 기록을 생략시킨다.
function handleStatusCommand(text, channel) {
  const OVR = path.join(ROOT, 'primary-override.txt');
  if (ROLE === 'secondary') {
    // 2호기 주도 중의 "전환" = 맥 복귀 요청 — heartbeat.txt에 마커를 push하면 맥이 2분 내 회수한다.
    // 단, 맥의 🫀 신호가 이미 primary로 신선하면(이미 복귀된 상태) 요청 없이 사실만 알린다.
    if (text === '전환' || text === '전환 맥') {
      (async () => {
        try {
          const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
          const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
          const res = await fetch('https://slack.com/api/conversations.history?channel=' + m._status +
            '&latest=' + m._status_hb_ts + '&limit=1&inclusive=true',
            { headers: { authorization: 'Bearer ' + token } });
          const d = await res.json();
          const mt = /primary (\S+)/.exec(d.messages && d.messages[0] && d.messages[0].text || '');
          if (mt && Date.now() - Date.parse(mt[1]) < 3 * 60 * 1000) {
            await postStatus(channel, 'ℹ️ 이미 맥(1호기)이 주도권을 갖고 있습니다 — 전환 불필요. 2호기 데몬은 곧 자가 종료됩니다.');
            log('전환: 무시 (맥 primary 신선)');
            return;
          }
        } catch {}
        const { execFile } = require('child_process');
        fs.writeFileSync(path.join(ROOT, 'heartbeat.txt'), new Date().toISOString() + '\nprimary-requested\n');
        execFile('git', ['-C', ROOT, 'add', 'heartbeat.txt'], { timeout: 15000 }, () => {
          execFile('git', ['-C', ROOT, '-c', 'user.name=mai-secondary', '-c', 'user.email=mai-bus@malife.local',
            'commit', '-q', '-m', 'chore: failback request'], { timeout: 15000 }, () => {
            execFile('git', ['-C', ROOT, 'push', '-q', 'origin', 'main'], { timeout: 30000 }, () => {});
          });
        });
        postStatus(channel, '⏬ 전환 접수 — 맥(1호기) 복귀 요청 발신. 맥이 2분 내 주도권을 회수하고 완료 공지를 올립니다.').catch(() => {});
        log('전환: 맥 복귀 요청 push');
      })();
      return true;
    }
    if (text === '현황') {
      runStatusReport(channel);
      return true;
    }
    return false;
  }
  if (text === '전환' || text === '전환 2호기' || text === '전환 맥') {
    const has = fs.existsSync(OVR);
    const toSecondary = text === '전환 2호기' || (text === '전환' && !has);
    if (toSecondary) {
      fs.writeFileSync(OVR, 'secondary\n');
      updateHbNow('yielding').catch(() => {});
      postStatus(channel, '⏫ 전환 접수 — 집(2호기)으로 주도권 이양. yielding 즉시 발신 완료, 2호기 다음 확인 틱(최대 5분)에 인계 공지가 올라옵니다.').catch(() => {});
      log('전환: → 2호기 (override 기록, hb 즉시 발신)');
      // 소켓 전부 즉시 종료 — 다음 재연결까지 기다리면 그동안 이벤트를 계속 가로챈다
      for (const s of activeSockets) { try { s.close(); } catch {} }
    } else if (!has) {
      postStatus(channel, 'ℹ️ 이미 맥(1호기)이 주도권을 갖고 있습니다 — 전환 불필요.').catch(() => {});
      log('전환: 무시 (이미 primary)');
    } else {
      try { fs.unlinkSync(OVR); } catch {}
      updateHbNow('primary').catch(() => {});
      postStatus(channel, '⏬ 전환 접수 — 맥(1호기)으로 복귀. primary 즉시 발신 완료, 2호기는 다음 확인 틱에 자동 대기 전환됩니다.').catch(() => {});
      log('전환: → 맥 (override 삭제, hb 즉시 발신)');
    }
    return true;
  }
  if (text === '현황') {
    runStatusReport(channel);
    return true;
  }
  return false;
}

// "현황" 리포트 — 플랫폼 무관 Node 생성기(status-report.js)를 현재 node 바이너리로 실행.
// 맥·2호기 모두 동일한 상세 현황(작업 원장·명부)을 제공한다.
function runStatusReport(channel) {
  const { execFile } = require('child_process');
  execFile(process.execPath, [path.join(ROOT, 'bin', 'status-report.js')],
    { timeout: 30000, env: process.env }, (err, stdout) => {
      postStatus(channel, err ? '⚠️ 현황 생성 실패: ' + err.message : stdout.trim()).catch(() => {});
    });
}

// 수동 전환: <busRoot>/primary-override.txt 에 "secondary"가 있으면 1호기는 양보 모드 —
// 소켓 연결을 끊고 hb를 "yielding"으로 발신한다. 파일 삭제(또는 "primary")면 정상 복귀.
function overrideMode() {
  try { return fs.readFileSync(path.join(ROOT, 'primary-override.txt'), 'utf8').trim(); }
  catch { return ''; }
}

// 1분 심장박동: 상태 채널의 고정 메시지를 chat.update — 2호기 워치독의 주 생존 신호(5분 임계).
// 양보 모드에서는 "yielding"을 발신해 2호기가 즉시 인계하게 한다.
let lastMode = null;
async function heartbeatLoop() {
  if (ROLE === 'secondary') return; // hb 메시지는 1호기 전용 신호 — 2호기는 쓰지 않는다
  for (;;) {
    try {
      const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
      if (m._status && m._status_hb_ts) {
        const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
        const mode = overrideMode() === 'secondary' ? 'yielding' : 'primary';
        const hdrs = { authorization: 'Bearer ' + token, 'content-type': 'application/json' };
        await fetch('https://slack.com/api/chat.update', {
          method: 'POST', headers: hdrs,
          body: JSON.stringify({ channel: m._status, ts: m._status_hb_ts,
            text: '🫀 ' + mode + ' ' + new Date().toISOString() }),
        });
        // 전환 완료 공지: yielding→primary 복귀 시(맥이 주도권을 실제로 되찾은 순간)
        if (lastMode === 'yielding' && mode === 'primary') {
          await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST', headers: hdrs,
            body: JSON.stringify({ channel: m._status,
              text: '✅ 전환 완료 — 현재 주도권: 맥(1호기). 수신·처리 재개.' }),
          });
        }
        lastMode = mode;
      }
    } catch (err) { log('hb 실패: ' + err.message); }
    await new Promise((r) => setTimeout(r, 60 * 1000));
  }
}

// 원격 heartbeat.txt 확인 — 2호기가 인계하면 "secondary"로 바꿔 push한다.
function gitRemoteHb() {
  const { execFile } = require('child_process');
  return new Promise((resolve) => {
    execFile('/usr/bin/git', ['-C', ROOT, 'fetch', '-q', 'origin', 'main'], { timeout: 20000 }, () => {
      execFile('/usr/bin/git', ['-C', ROOT, 'show', 'origin/main:heartbeat.txt'], { timeout: 10000 },
        (err, out) => resolve(err ? '' : String(out)));
    });
  });
}

// 2호기 자가 종료: 맥의 🫀 신호가 'primary'로 3분 내 신선하면 스스로 물러난다.
// 워치독의 kill이 실패해도 이중 수신이 이 루프 주기(2분) 안에 해소된다.
async function secondarySelfStop() {
  if (ROLE !== 'secondary') return;
  for (;;) {
    await new Promise((r) => setTimeout(r, 2 * 60 * 1000));
    try {
      const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
      if (!m._status || !m._status_hb_ts) continue;
      const token = fs.readFileSync(m._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
      const res = await fetch('https://slack.com/api/conversations.history?channel=' + m._status +
        '&latest=' + m._status_hb_ts + '&limit=1&inclusive=true',
        { headers: { authorization: 'Bearer ' + token } });
      const d = await res.json();
      const txt = d.messages && d.messages[0] && d.messages[0].text || '';
      const mt = /primary (\S+)/.exec(txt);
      if (mt && Date.now() - Date.parse(mt[1]) < 3 * 60 * 1000) {
        log('맥 primary 신호 신선 — 2호기 데몬 자가 종료');
        process.exit(0);
      }
    } catch {}
  }
}

async function main() {
  heartbeatLoop(); // 병행
  secondarySelfStop(); // 병행 (secondary 전용)
  // 데드맨 스위치: 양보 모드 진입 후 10분 내 2호기 인계 증거(git heartbeat "secondary")가
  // 없으면 자동 복귀한다 — 2호기 부재 시 "아무도 수신 안 하는 공백" 방지.
  let yieldStart = 0, takenOver = false, lastCheck = 0;
  for (;;) {
    if (ROLE !== 'secondary' && overrideMode() === 'secondary') {
      if (!yieldStart) { yieldStart = Date.now(); takenOver = false; lastCheck = 0; }
      if (Date.now() - lastCheck > 2 * 60 * 1000) {
        lastCheck = Date.now();
        // 마커는 2번째 줄 정확 일치로 판정 — 'secondary-down'(데몬 기동 실패)을 인계 증거로 오인하지 않기 위함
        const hbLines = (await gitRemoteHb()).split('\n').map((s) => s.trim());
        const hb = hbLines[1] || '';
        if (hb === 'primary-requested') {
          // 2호기(또는 Liam의 "전환")가 맥 복귀를 요청 — 즉시 회수.
          // 완료 공지는 이 순간(상태 확정 시점)에 직접 게시한다 — hb 전이 감지에 맡기면
          // 재시작·네트워크 순단 시 조용히 증발한다 (2026-08-10 완료 공지 누락 사고).
          try { fs.unlinkSync(path.join(ROOT, 'primary-override.txt')); } catch {}
          updateHbNow('primary').catch(() => {});
          lastMode = 'primary'; // hb 루프의 중복 완료 공지 억제
          try {
            const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
            await postStatus(m._status, '✅ 전환 완료 — 현재 주도권: 맥(1호기). 수신·처리 재개.');
          } catch {}
          log('복귀 요청 감지 — primary 회수·완료 공지');
        } else if (hb === 'secondary') {
          if (!takenOver) { takenOver = true; log('2호기 인계 확인(git heartbeat)'); }
        } else if (!takenOver && Date.now() - yieldStart > 10 * 60 * 1000) {
          // 데드맨: 10분 내 인계 증거 없음 → 수신 공백 방지 자동 복귀
          try { fs.unlinkSync(path.join(ROOT, 'primary-override.txt')); } catch {}
          updateHbNow('primary').catch(() => {});
          try {
            const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
            await postStatus(m._status, '⚠️ 2호기(집 PC) 10분 무응답 — 인계 증거가 없어 주도권을 맥(1호기)으로 자동 복귀합니다. 집 PC 전원·워치독 상태를 확인해 주세요.');
          } catch {}
          log('2호기 무응답 — 자동 복귀');
        }
      }
      // 양보 모드 — 이벤트 수신 중단 (2호기가 유일한 수신자가 되도록)
      await new Promise((r) => setTimeout(r, 15 * 1000));
      continue;
    }
    yieldStart = 0;
    await new Promise((r) => setTimeout(r, 15 * 1000));
  }
}

// 수신 연결 루프 — 같은 기계에서 2개를 5분 시차로 돌린다(같은 앱의 다중 연결은 이벤트를
// 나눠 받을 뿐 중복되지 않으며, 둘 다 같은 inbox에 쓰므로 안전). 각 연결은 10분마다
// 강제 재수립: 좀비 소켓(연결 표시는 살아있는데 실제 수신 불능 — 2026-08-10 23:01 MAGIC
// 메시지 유실 사고)의 수명을 최대 10분으로 제한하고, 시차 덕에 항상 한쪽은 신선하다.
async function connLoop(tag, staggerMs) {
  await new Promise((r) => setTimeout(r, staggerMs));
  for (;;) {
    if (ROLE !== 'secondary' && overrideMode() === 'secondary') {
      await new Promise((r) => setTimeout(r, 15 * 1000));
      continue;
    }
    try { await connectOnce(tag); } catch (err) { log('[' + tag + '] 연결 실패: ' + err.message); }
    await new Promise((r) => setTimeout(r, 5000)); // 재연결 백오프
  }
}

main();
connLoop('A', 0);
connLoop('B', 5 * 60 * 1000);
