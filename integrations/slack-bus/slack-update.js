#!/usr/bin/env node
'use strict';
// slack-update.js <채널ID|REPO|_status…> <메시지ts> <새 텍스트…>
// 기존 메시지를 갱신한다 — 접수 메시지를 "진행 상태줄"로 쓰기 위한 도구.
// 팀원이 작업 단계마다 호출: 📥 접수 → ⏳ 단계별 진행 → ✅ 완료
const fs = require('fs');
const path = require('path');

const ROOT = process.env.MAI_BUS_ROOT || '/Users/lsc/mai-family/.bus';

async function main() {
  const [target, ts, ...rest] = process.argv.slice(2);
  const text = rest.join(' ');
  if (!target || !ts || !text) {
    process.stderr.write('usage: slack-update <채널|REPO> <ts> <새 텍스트>\n');
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(map._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  const channel = /^[CD]/.test(target) ? target : map[target];
  if (!channel) { process.stderr.write('unknown target ' + target + '\n'); process.exit(1); }
  const res = await fetch('https://slack.com/api/chat.update', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ channel, ts, text }),
  });
  const d = await res.json();
  if (!d.ok) { process.stderr.write('slack error: ' + d.error + '\n'); process.exit(1); }
  process.stdout.write('updated\n');
}

main().catch((err) => { process.stderr.write(err.message + '\n'); process.exit(1); });
