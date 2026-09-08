#!/usr/bin/env node
'use strict';
// slack-bridge-poll.js — Slack 채널의 새 "사람" 메시지 수집기 (브리지 루프용).
// 사장 계정 메시지만 인정하고 봇·타인 메시지는 버린다. stdout에 JSON 배열.
// 커서: <busRoot>/slack-cursors.json = { <channelId>: <마지막 처리 ts> }
// --init: 커서만 현재 시점으로 맞추고 메시지는 반환하지 않는다(과거분 스킵).
const fs = require('fs');
const path = require('path');

const ROOT = process.env.MAI_BUS_ROOT || '/Users/lsc/mai-family/.bus';
const HUMAN = 'U09EV0A952M'; // 워크스페이스의 사장 계정 — 이 ID 외에는 라우팅하지 않는다

async function main() {
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(map._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  const curPath = path.join(ROOT, 'slack-cursors.json');
  let cursors = {};
  try { cursors = JSON.parse(fs.readFileSync(curPath, 'utf8')); } catch (err) { /* 첫 실행 */ }

  const init = process.argv.includes('--init');
  const out = [];
  for (const [repo, cid] of Object.entries(map)) {
    if (typeof cid !== 'string' || !/^[CD]/.test(cid)) continue; // C=채널, D=봇 DM(_dm)
    const url = new URL('https://slack.com/api/conversations.history');
    url.searchParams.set('channel', cid);
    url.searchParams.set('limit', '20');
    if (cursors[cid]) url.searchParams.set('oldest', cursors[cid]); // exclusive
    const res = await fetch(url, { headers: { authorization: 'Bearer ' + token } });
    const data = await res.json();
    if (!data.ok) { process.stderr.write('[MaiBus] history ' + repo + ': ' + data.error + '\n'); continue; }
    let maxTs = cursors[cid] || '0';
    for (const m of data.messages || []) if (m.ts > maxTs) maxTs = m.ts;
    cursors[cid] = maxTs;
    if (init) continue;
    const human = (data.messages || [])
      .filter((m) => m.type === 'message' && !m.subtype && !m.bot_id && m.user === HUMAN)
      .reverse(); // 시간순
    for (const m of human) out.push({ repo, channel: cid, ts: m.ts, text: m.text });
  }
  fs.writeFileSync(curPath, JSON.stringify(cursors, null, 1));
  process.stdout.write(JSON.stringify(out, null, 1) + '\n');
}

main().catch((err) => { process.stderr.write('[MaiBus] bridge poll: ' + err.message + '\n'); process.exit(1); });
