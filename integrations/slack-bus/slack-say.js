#!/usr/bin/env node
'use strict';
// slack-say.js [--as "표시명"] [--emoji ":mag:"] <REPO|_council|_qa|C채널ID|D…> <text…>
// 브리지 회신용 동기 전송 (결과 확인형). 미러(postSlackText)와 달리 실패를 exit code로 알린다.
// v3: --as/--emoji = 역할 명의 표시(chat.postMessage username/icon_emoji).
//     봇에 chat:write.customize 스코프가 없으면 Slack이 무시 — 조건 없이 전달한다.
//     플래그는 target 앞뒤 어디에 와도 파싱된다. 기존 위치 인자 사용법은 불변.
const fs = require('fs');
const path = require('path');

const ROOT = process.env.MAI_BUS_ROOT || '/Users/lsc/mai-family/.bus';

// Node 16(글로벌 fetch 부재) 호환: https 기반 최소 폴리필(JSON POST 용도만).
if (typeof fetch === 'undefined') {
  const https = require('https');
  global.fetch = (url, opts = {}) => new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: opts.method || 'GET',
      headers: opts.headers || {},
    }, (res) => {
      let buf = '';
      res.on('data', (c) => { buf += c; });
      res.on('end', () => resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300,
        status: res.statusCode,
        json: () => Promise.resolve(JSON.parse(buf)),
        text: () => Promise.resolve(buf),
      }));
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// argv → { target, text, as, emoji }. --as/--emoji 토큰(+값)만 걷어내고
// 남은 위치 인자의 첫 항목이 target, 나머지가 text (기존 규약 그대로).
function parseSayArgs(argv) {
  const out = { target: null, text: '', as: null, emoji: null, file: null, raw: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--as') { out.as = argv[i + 1] !== undefined ? argv[i + 1] : null; i += 1; }
    else if (a === '--emoji') { out.emoji = argv[i + 1] !== undefined ? argv[i + 1] : null; i += 1; }
    else if (a === '--file') { out.file = argv[i + 1] !== undefined ? argv[i + 1] : null; i += 1; }
    else if (a === '--raw') { out.raw = true; }
    else positional.push(a);
  }
  out.target = positional.length ? positional[0] : null;
  out.text = positional.slice(1).join(' ');
  return out;
}

// 산출물 파일 업로드 (files:write 스코프 필요) — 3단계 외부 업로드 프로토콜:
// getUploadURLExternal(URL 발급) → 그 URL에 바이트 POST → completeUploadExternal(채널 공유).
// 주의: 파일 업로드는 username/icon_emoji 커스터마이즈를 지원하지 않는다 — 봇 명의로 올라간다.
async function uploadFile(token, channel, filePath, comment) {
  const data = fs.readFileSync(filePath);
  const name = path.basename(filePath);
  const q = 'filename=' + encodeURIComponent(name) + '&length=' + data.length;
  const r1 = await (await fetch('https://slack.com/api/files.getUploadURLExternal?' + q,
    { headers: { authorization: 'Bearer ' + token } })).json();
  if (!r1.ok) throw new Error('getUploadURLExternal: ' + r1.error + (r1.error === 'missing_scope' ? ' (봇에 files:write 스코프 추가 필요)' : ''));
  const up = await fetch(r1.upload_url, {
    method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: data,
  });
  if (!up.ok) throw new Error('업로드 HTTP ' + up.status);
  const r2 = await (await fetch('https://slack.com/api/files.completeUploadExternal', {
    method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ files: [{ id: r1.file_id, title: name }], channel_id: channel,
      ...(comment ? { initial_comment: comment } : {}) }),
  })).json();
  if (!r2.ok) throw new Error('completeUploadExternal: ' + r2.error);
  return r2.files && r2.files[0] && r2.files[0].id;
}

async function main() {
  const { target, text, as, emoji, file, raw } = parseSayArgs(process.argv.slice(2));
  if (!target || (!text && !file)) {
    process.stderr.write('usage: slack-say [--as "표시명"] [--emoji ":mag:"] [--file <경로>] <REPO|_council|_qa|C…|D…> <text>\n');
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(map._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  const channel = /^[CD]/.test(target) ? target : map[target];
  if (!channel) { process.stderr.write('unknown target ' + target + '\n'); process.exit(1); }
  if (file) {
    if (!fs.existsSync(file)) { process.stderr.write('file not found: ' + file + '\n'); process.exit(1); }
    const fid = await uploadFile(token, channel, file, text || null);
    process.stdout.write('uploaded ' + fid + '\n');
    return;
  }
  // §2.10 기계 강제: 채널 발송 텍스트를 문장 단위 개행으로 정규화 (--raw로 우회 가능)
  let outText = text;
  if (!raw) {
    try { outText = require('./mai-bus.js').formatReadable(text); } catch { /* 코어 부재 시 원문 */ }
  }
  const body = { channel, text: outText, unfurl_links: false };
  if (as) body.username = as;
  if (emoji) body.icon_emoji = emoji;
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) { process.stderr.write('slack error: ' + data.error + '\n'); process.exit(1); }
  process.stdout.write('sent ' + data.ts + '\n');
}

module.exports = { parseSayArgs, uploadFile };

if (require.main === module) {
  main().catch((err) => { process.stderr.write(err.message + '\n'); process.exit(1); });
}
