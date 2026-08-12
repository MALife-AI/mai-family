#!/usr/bin/env node
'use strict';
// slack-ask.js <REPO|_council|_qa|C…> <질문 텍스트> [--context "<부가정보>"]
// 허용/거부 버튼이 달린 승인 질문을 채널에 게시한다. 클릭은 Socket Mode 데몬이
// inbox에 _action 항목으로 기록 → 브리지가 처리한다. 질문 원장은 <busRoot>/questions/<qid>.json.
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

async function main() {
  const argv = process.argv.slice(2);
  const ci = argv.indexOf('--context');
  const context = ci >= 0 ? argv.splice(ci, 2)[1] : '';
  const [target, ...rest] = argv;
  const question = rest.join(' ');
  if (!target || !question) {
    process.stderr.write('usage: slack-ask <REPO|_council|_qa|C…> <질문> [--context "..."]\n');
    process.exit(1);
  }
  const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'slack.json'), 'utf8'));
  const token = fs.readFileSync(map._token_file || path.join(ROOT, 'slack.token'), 'utf8').trim();
  const channel = /^[CD]/.test(target) ? target : map[target];
  if (!channel) { process.stderr.write('unknown target ' + target + '\n'); process.exit(1); }
  const qid = 'q' + Date.now();
  const body = {
    channel, unfurl_links: false,
    text: '❓ [승인요청] ' + question,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: '❓ *승인요청*\n' + question + (context ? '\n\n_' + context + '_' : '') } },
      { type: 'actions', block_id: qid, elements: [
        { type: 'button', style: 'primary', action_id: 'approve', value: qid, text: { type: 'plain_text', text: '✅ 허용' } },
        { type: 'button', style: 'danger', action_id: 'deny', value: qid, text: { type: 'plain_text', text: '❌ 거부' } },
      ] },
    ],
  };
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const d = await res.json();
  if (!d.ok) { process.stderr.write('slack error: ' + d.error + '\n'); process.exit(1); }
  const qdir = path.join(ROOT, 'questions');
  fs.mkdirSync(qdir, { recursive: true });
  fs.writeFileSync(path.join(qdir, qid + '.json'),
    JSON.stringify({ qid, question, context, channel, ts: d.ts, asked_at: new Date().toISOString() }, null, 1));
  process.stdout.write(qid + '\n');
}

main().catch((err) => { process.stderr.write(err.message + '\n'); process.exit(1); });
