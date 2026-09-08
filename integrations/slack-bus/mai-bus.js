#!/usr/bin/env node
'use strict';
// mai-bus.js — mai-family multi-agent event bus (CLI + require-able library)
// Bus root: MAI_BUS_ROOT env override, default /Users/lsc/mai-family/.bus
const fs = require('fs');
const path = require('path');
// v2 회의록(스레드) 레이어 — threads 모듈은 이 파일을 "호출 시점에" lazy require하므로 순환 안전.
const threads = require('./mai-bus-threads.js');

const DEFAULT_ROOT = '/Users/lsc/mai-family/.bus';
const REPOS = ['MAGE', 'MAGIC', 'MAGMA', 'MAGNET', 'mai-family', 'mai-suite', 'MANA', 'MARK', 'MERLIN', 'MESH', 'MOJO', 'MYSTIC'];
// v3 §11: 실물 .git 레포는 아니지만 발행 명의로 쓰는 가상 레포(QA 등). publish·feed --repo가
// 받아주며, pending 판정(event.repo ≠ 나)은 그대로라 affects에 든 실물 레포가 정상 수신한다.
// status 집계·notify-hook 레포 판정은 실물 REPOS만 대상 — 기존 REPOS export 표면은 불변(추가만).
const VIRTUAL_REPOS = ['QA'];
const ALL_REPOS = REPOS.concat(VIRTUAL_REPOS);
const KINDS = ['feature', 'contract-change', 'breaking', 'release', 'info'];
const LEASE_TTL_MS = 4 * 60 * 60 * 1000; // 4h

function busRoot() { return process.env.MAI_BUS_ROOT || DEFAULT_ROOT; }
function busDir(name) { const d = path.join(busRoot(), name); fs.mkdirSync(d, { recursive: true }); return d; }
function warn(msg) { process.stderr.write('[MaiBus] ' + msg + '\n'); }

// '2026-08-10T00:11:22.333Z' -> '20260810T001122333-<REPO>'
function tsToId(ts, repo) { return ts.replace(/[-:]/g, '').replace('.', '').replace('Z', '') + '-' + repo; }

// Slack 미러 공통부: fire-and-forget, 2초 타임아웃, 실패해도 호출자는 성공.
// publish(notifySlack)와 comment(스레드 미러)가 같은 패턴을 공유한다.
// target이 http URL이면 Incoming Webhook, 채널 ID(C…)면 봇 토큰으로 chat.postMessage.
function slackToken() {
  try {
    const map = readSlackMap();
    const p = map._token_file || path.join(busRoot(), 'slack.token');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : null;
  } catch (err) {
    return null;
  }
}

// payload의 username/icon_emoji(역할 명의 표시)는 두 경로 모두 조건 없이 그대로 전달된다:
// 웹훅은 payload 원본을 body로, chat.postMessage는 ...payload 스프레드로.
// (봇에 chat:write.customize 스코프가 없으면 Slack이 무시 — 코드에서 거르지 않는다.)
// Node 16(글로벌 fetch 부재) 호환 폴리필 — 팀원 세션 셸 PATH의 node가 v16이라
// fetch 부재 시 미러가 조용히 생략되는 사고가 있었다 (2026-08-12 안건 미표시 사고).
if (typeof fetch === 'undefined') {
  const https = require('https');
  global.fetch = (url, opts = {}) => new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search,
      method: opts.method || 'GET', headers: opts.headers || {},
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode,
        json: () => Promise.resolve(JSON.parse(buf)), text: () => Promise.resolve(buf),
      }));
    });
    if (opts.signal) opts.signal.addEventListener('abort', () => req.destroy(new Error('aborted')));
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

function postSlackPayload(payload, url, tokenOverride) {
  const target = url || process.env.SLACK_WEBHOOK_URL;
  if (!target || typeof fetch !== 'function') return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  let endpoint = target;
  const headers = { 'content-type': 'application/json' };
  let body = payload;
  if (!/^https?:/.test(target)) {
    const token = tokenOverride || slackToken();
    if (!token) { clearTimeout(timer); return; }
    endpoint = 'https://slack.com/api/chat.postMessage';
    headers.authorization = 'Bearer ' + token;
    body = { channel: target, unfurl_links: false, ...payload };
  }
  fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body), signal: ctrl.signal })
    .then((res) => res.json().catch(() => null))
    .then((data) => { if (data && data.ok === false) warn('slack notify failed: ' + data.error); })
    .catch((err) => warn('slack notify failed: ' + err.message))
    .finally(() => clearTimeout(timer));
}

function postSlackText(text, url) { postSlackPayload({ text }, url); }

// 프로젝트별 시각 구분 (council 채널에서 한눈에 구분되도록 이모지+컬러바)
const REPO_STYLE = {
  MAGE: { e: '🧙', c: '#7C5CFF' }, MAGIC: { e: '🎩', c: '#2E86DE' }, MAGMA: { e: '🌋', c: '#E74C3C' },
  MAGNET: { e: '🧲', c: '#E67E22' }, 'mai-suite': { e: '📦', c: '#8E7A5B' }, MANA: { e: '💧', c: '#00B8D9' },
  MARK: { e: '📊', c: '#27AE60' }, MERLIN: { e: '🪄', c: '#9B59B6' }, MESH: { e: '🕸️', c: '#607D8B' },
  MOJO: { e: '⚙️', c: '#F39C12' }, MYSTIC: { e: '🔮', c: '#C0399F' },
  QA: { e: '🔍', c: '#16A085' }, // 가상 레포(§11) — 미지의 접두는 아래 폴백 📌
};
function repoStyle(repo) { return REPO_STYLE[repo] || { e: '📌', c: '#95A5A6' }; }

function mirrorPayload(event, payload, opts) {
  for (const url of slackTargets(event, opts)) postSlackPayload(payload, url, opts && opts.token);
}

// v4: 역할별 실제 봇 계정 — from("REPO/역할")의 역할 파트로 봇 토큰 파일을 찾는다.
// 없으면 null → 호출부가 메인 봇 + username 명의 표시로 폴백.
const ROLE_BOT_FILE = {
  backend: 'backend', 'backend-eng': 'backend', frontend: 'frontend', 'frontend-eng': 'frontend',
  client: 'client', mobile: 'client', 'mobile-eng': 'client', qa: 'qa', tester: 'qa', 'qa-tester': 'qa',
  designer: 'design', design: 'design', 'ui-designer': 'design',
};
function roleBotToken(from) {
  try {
    const role = String(from).split('/')[1];
    const file = ROLE_BOT_FILE[(role || '').toLowerCase()];
    if (!file) return null;
    const p = path.join(busRoot(), 'bots', file + '.token');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : null;
  } catch (err) {
    return null;
  }
}

// 채널 라우팅: <busRoot>/slack.json = { "<REPO>": url, "_council": url, "_default": url }
// 없거나 손상이면 빈 맵 → SLACK_WEBHOOK_URL 단일 채널로 폴백.
function readSlackMap() {
  const p = path.join(busRoot(), 'slack.json');
  try {
    if (!fs.existsSync(p)) return {};
    const m = JSON.parse(fs.readFileSync(p, 'utf8'));
    return m && typeof m === 'object' && !Array.isArray(m) ? m : {};
  } catch (err) {
    warn('slack.json unreadable: ' + err.message);
    return {};
  }
}

// 프로젝트 이슈 → 자기 프로젝트 채널. 타 프로젝트 영향(affects 있음) → 회의실 채널에도.
// v3: opts.roleSpeech(역할 팀원 발언 = from에 '/' 포함)면 _council 타깃을 제외한다 —
// council엔 안건과 PM 발언만 미러 (사장 요구: 회의실 소음 방지). opts 생략 시 동작 불변.
// 가상 레포의 "자기 채널" 키 (slack.json): QA 안건은 _qa 채널이 자기 프로젝트 채널이다 (§11).
const VIRTUAL_CHANNEL = { QA: '_qa' };

function slackTargets(event, opts) {
  const map = readSlackMap();
  const fallback = map._default || process.env.SLACK_WEBHOOK_URL;
  const urls = [];
  const own = map[event.repo] || map[VIRTUAL_CHANNEL[event.repo]] || fallback;
  if (own) urls.push(own);
  if (!(opts && opts.roleSpeech) && Array.isArray(event.affects) && event.affects.length) {
    const council = map._council || fallback;
    if (council && !urls.includes(council)) urls.push(council);
  }
  // 전 팀 공지: kind=info + affects=[](브로드캐스트, 전원 pending)만 _notice에 미러 —
  // 네이밍 컨벤션·리팩토링 지침 등 전원 준수 사항이 한 채널에 모인다 (Liam 지시 2026-08-12).
  // kind 제한이 없으면 affects 미선언 일반 안건까지 공지 채널을 오염시킨다.
  if (!(opts && opts.roleSpeech) && event.kind === 'info' &&
      Array.isArray(event.affects) && event.affects.length === 0 && map._notice &&
      !urls.includes(map._notice)) {
    urls.push(map._notice);
  }
  return urls;
}

function mirrorEvent(event, text) {
  for (const url of slackTargets(event)) postSlackText(text, url);
}

// §2.10 기계 강제 (Liam 지시 2026-08-12 — 규약만으론 벽글이 계속 나옴):
// 채널로 나가는 텍스트를 발송 지점에서 문장 단위 개행으로 정규화한다.
// 코드블록(```) 내부는 보존. 버스 원문(threads/*.jsonl)은 불변 — Slack 표시만 바꾼다.
function formatReadable(text) {
  if (typeof text !== 'string' || !text) return text;
  return text.split('```').map((seg, i) => {
    if (i % 2 === 1) return seg; // 코드블록 내부 보존
    let t = seg;
    // ①②③ 인라인 나열 → 항목마다 줄바꿈
    t = t.replace(/[ \t]+([①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮])[ \t]*/g, '\n$1 ');
    // 한국어 종결어미 + '. ' → 문장마다 줄바꿈 (버전 번호·URL의 '.'은 종결어미가 아니라 안전)
    t = t.replace(/((?:니다|습니다|다|요|음|임|함|됨|줌|옴|시오|세요|이다))\.[ \t]+(?=\S)/g, '$1.\n');
    return t.replace(/\n{3,}/g, '\n\n');
  }).join('```');
}

const KIND_LABEL = {
  'contract-change': '📜 계약 변경', breaking: '💥 하위호환 파괴', feature: '✨ 기능',
  release: '🚀 릴리스', info: 'ℹ️ 공지',
};

function notifySlack(event) {
  const s = repoStyle(event.repo);
  const affects = event.affects && event.affects.length ? event.affects.join(', ') : '자체';
  const fallback = '[' + event.repo + '] ' + event.kind + ': ' + event.title;
  const detail = event.detail ? '\n' + String(event.detail).slice(0, 1500) : '';
  mirrorPayload(event, {
    text: fallback,
    attachments: [{
      color: s.c,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: s.e + ' ' + event.repo + ' — 안건 상정', emoji: true } },
        { type: 'section', text: { type: 'mrkdwn', text: '*' + event.title + '*' + detail } },
        { type: 'context', elements: [{ type: 'mrkdwn', text: (KIND_LABEL[event.kind] || event.kind) + ' · 영향: ' + affects + ' · `' + event.id + '`' }] },
      ],
    }],
  });
}

function publish(opts) {
  const { repo, kind, title } = opts || {};
  if (!ALL_REPOS.includes(repo)) throw new Error('invalid --repo "' + repo + '" (valid: ' + ALL_REPOS.join(', ') + ')');
  if (!KINDS.includes(kind)) throw new Error('invalid --kind "' + kind + '" (valid: ' + KINDS.join(', ') + ')');
  if (!title || typeof title !== 'string') throw new Error('--title is required');
  const eventsDir = busDir('events');
  const ts = new Date().toISOString();
  const base = tsToId(ts, repo);
  let id = base;
  let n = 1;
  while (fs.existsSync(path.join(eventsDir, id + '.json'))) { n += 1; id = base + '-' + n; }
  const event = { id, ts, repo, kind, title };
  if (opts.detail) event.detail = opts.detail;
  event.affects = Array.isArray(opts.affects) ? opts.affects : [];
  if (Array.isArray(opts.refs) && opts.refs.length) event.refs = opts.refs;
  if (opts.actor) event.actor = opts.actor;
  fs.writeFileSync(path.join(eventsDir, id + '.json'), JSON.stringify(event, null, 2) + '\n');
  notifySlack(event); // fire-and-forget; failure never fails the publish
  return event;
}

function listEvents() {
  const eventsDir = busDir('events');
  const events = [];
  for (const f of fs.readdirSync(eventsDir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const e = JSON.parse(fs.readFileSync(path.join(eventsDir, f), 'utf8'));
      if (!e || typeof e !== 'object' || !e.id || !e.repo) throw new Error('missing id/repo');
      events.push(e);
    } catch (err) {
      warn('skipping corrupt event file ' + f + ': ' + err.message);
    }
  }
  return events.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function readCursor(repo) {
  try { return fs.readFileSync(path.join(busDir('cursors'), repo), 'utf8').trim(); }
  catch { return ''; }
}

// pending(repo) -> event[]; pure over bus state, reused by notify-hook.js
function pending(repo) {
  if (!repo) throw new Error('--repo is required');
  const cursor = readCursor(repo);
  return listEvents().filter((e) =>
    (!cursor || e.id > cursor) &&
    e.repo !== repo &&
    (!Array.isArray(e.affects) || e.affects.length === 0 || e.affects.includes(repo)));
}

function ack(repo, id) {
  if (!repo) throw new Error('--repo is required');
  let target = id;
  if (!target) {
    // --id 생략 = 그 시점 pending 전부 일괄 ack. 전역 최신 id가 아니라 마지막 pending id까지만
    // 전진해, pending 표시 이후 발행된(아직 못 본) 이벤트를 모르고 건너뛰지 않는다.
    const list = pending(repo);
    if (!list.length) throw new Error('no pending events to ack for ' + repo);
    target = list[list.length - 1].id;
  }
  fs.writeFileSync(path.join(busDir('cursors'), repo), target + '\n');
  return target;
}

function readLease(repo) {
  try { return JSON.parse(fs.readFileSync(path.join(busDir('leases'), repo + '.json'), 'utf8')); }
  catch { return null; }
}

function isStaleLease(l) {
  const t = Date.parse(l && l.since);
  return !Number.isFinite(t) || (Date.now() - t) > LEASE_TTL_MS;
}

function lease(repo, owner, task) {
  if (!repo || !owner) throw new Error('lease requires --repo and --owner');
  const cur = readLease(repo);
  if (cur && cur.owner !== owner) {
    if (!isStaleLease(cur)) {
      warn('lease on ' + repo + ' held by ' + cur.owner + ' since ' + cur.since + ' (task: ' + (cur.task || '-') + ')');
      return null;
    }
    warn('overriding stale lease on ' + repo + ' (owner ' + cur.owner + ', since ' + cur.since + ')');
  }
  const next = { repo, owner, task: task || '', since: new Date().toISOString() };
  fs.writeFileSync(path.join(busDir('leases'), repo + '.json'), JSON.stringify(next, null, 2) + '\n');
  return next;
}

function release(repo, owner) {
  if (!repo || !owner) throw new Error('release requires --repo and --owner');
  const cur = readLease(repo);
  if (!cur) { warn('no lease on ' + repo + ' (nothing to release)'); return true; }
  if (cur.owner !== owner) { warn('lease on ' + repo + ' owned by ' + cur.owner + ', not ' + owner); return false; }
  fs.unlinkSync(path.join(busDir('leases'), repo + '.json'));
  return true;
}

function status() {
  const events = listEvents();
  const pendingByRepo = {};
  for (const r of REPOS) pendingByRepo[r] = pending(r).length;
  const leases = [];
  for (const f of fs.readdirSync(busDir('leases'))) {
    if (!f.endsWith('.json')) continue;
    const l = readLease(f.slice(0, -5));
    if (l) leases.push(Object.assign({}, l, { stale: isStaleLease(l) }));
  }
  return { totalEvents: events.length, pendingByRepo, leases };
}

// ---------------- CLI ----------------
const USAGE = 'Usage: mai-bus.js <command>\n' +
  '  publish --repo <R> --kind <K> --title "..." [--detail "..."] [--affects A,B] [--refs x,y] [--actor <name>]\n' +
  '  pending --repo <R> [--json]\n' +
  '  ack     --repo <R> [--id <eventId>]\n' +
  '  lease   --repo <R> --owner <O> [--task "..."]\n' +
  '  release --repo <R> --owner <O>\n' +
  '  status\n' +
  '  comment --id <eventId> --from <owner> --type <verdict|comment|question|approval|result> --text "..." [--refs a,b]\n' +
  '  thread  --id <eventId>\n' +
  '  feed    [--limit N] [--repo <R>]\n' +
  '  report  --id <eventId> [--out <file.md>]\n';

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) { args[a.slice(2)] = true; }
      else { args[a.slice(2)] = next; i += 1; }
    } else { args._.push(a); }
  }
  return args;
}

function splitList(v) { return typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : []; }

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const a = parseArgs(rest);
  try {
    if (cmd === 'publish') {
      const ev = publish({ repo: a.repo, kind: a.kind, title: a.title, detail: a.detail,
        affects: splitList(a.affects), refs: splitList(a.refs), actor: a.actor });
      process.stdout.write(ev.id + '\n');
    } else if (cmd === 'pending') {
      const list = pending(a.repo);
      if (a.json) { process.stdout.write(JSON.stringify(list, null, 2) + '\n'); }
      else if (!list.length) { process.stdout.write('no pending events for ' + a.repo + '\n'); }
      else { for (const e of list) process.stdout.write(e.id + '  [' + e.kind + '] ' + e.repo + ': ' + e.title + '\n'); }
    } else if (cmd === 'ack') {
      process.stdout.write('cursor(' + a.repo + ') -> ' + ack(a.repo, a.id) + '\n');
    } else if (cmd === 'lease') {
      const l = lease(a.repo, a.owner, a.task);
      if (!l) process.exit(1);
      process.stdout.write('leased ' + l.repo + ' to ' + l.owner + '\n');
    } else if (cmd === 'release') {
      if (!release(a.repo, a.owner)) process.exit(1);
      process.stdout.write('released ' + a.repo + '\n');
    } else if (cmd === 'status') {
      const s = status();
      process.stdout.write('events: ' + s.totalEvents + '\n');
      for (const [r, n] of Object.entries(s.pendingByRepo)) if (n) process.stdout.write('  pending ' + r + ': ' + n + '\n');
      for (const l of s.leases) process.stdout.write('  lease ' + l.repo + ': ' + l.owner + ' since ' + l.since + (l.stale ? ' (stale)' : '') + '\n');
    } else if (cmd === 'comment') {
      const entry = threads.comment({ id: a.id, from: a.from, type: a.type, text: a.text, refs: splitList(a.refs) });
      process.stdout.write('commented on ' + a.id + ': [' + entry.type + '] ' + entry.from + ' @ ' + entry.ts + '\n');
    } else if (cmd === 'thread') {
      process.stdout.write(threads.formatThread(a.id));
    } else if (cmd === 'feed') {
      process.stdout.write(threads.formatFeed({ limit: a.limit, repo: a.repo }));
    } else if (cmd === 'report') {
      const md = threads.buildReport(a.id);
      if (a.out !== undefined) {
        if (typeof a.out !== 'string') throw new Error('--out requires a file path');
        const outPath = path.resolve(a.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, md);
        process.stdout.write('report written to ' + outPath + '\n');
      } else {
        process.stdout.write(md);
      }
    } else if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
      process.stdout.write(USAGE);
    } else {
      process.stderr.write(USAGE);
      process.exit(1);
    }
  } catch (err) {
    warn(err.message);
    process.exit(1);
  }
}

module.exports = { formatReadable, publish, pending, ack, lease, release, status, listEvents, readCursor, readLease,
  isStaleLease, notifySlack, postSlackText, postSlackPayload, readSlackMap, slackTargets,
  mirrorEvent, mirrorPayload, repoStyle, roleBotToken,
  busRoot, parseArgs, splitList, REPOS, VIRTUAL_REPOS, ALL_REPOS, KINDS, LEASE_TTL_MS, DEFAULT_ROOT,
  // v2 회의록(스레드) 레이어 — mai-bus-threads.js 재-export (CLI 진입은 이 파일 하나 유지)
  ENTRY_TYPES: threads.ENTRY_TYPES, getEvent: threads.getEvent, threadEntries: threads.threadEntries,
  appendEntry: threads.appendEntry, comment: threads.comment, recentThreadActivity: threads.recentThreadActivity,
  formatThread: threads.formatThread, formatFeed: threads.formatFeed, buildReport: threads.buildReport };

if (require.main === module) main();
