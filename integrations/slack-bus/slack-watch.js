#!/usr/bin/env node
'use strict';
// slack-watch.js — 상시 감시자: 새 Liam 메시지가 나타나는 즉시 JSON을 출력하고 종료한다.
// 브리지(코디네이터)가 run_in_background로 띄워 두면, 종료(=메시지 발견) 시점에
// 작업 완료 통지가 브리지를 즉시 깨운다 → 폴링 지연이 감시 주기(~20초)로 줄어든다.
// 안전장치: 최대 수명(기본 50분) 도달 시 빈 배열로 종료(브리지가 재기동).
const { execFileSync } = require('child_process');
const path = require('path');

const POLL_SCRIPT = path.join(__dirname, 'slack-bridge-poll.js');
const INTERVAL_MS = 30 * 1000; // 채널 14개 × 30초 ≈ 28회/분 — rate limit 안전권 (감시자는 반드시 1개만)
const MAX_LIFE_MS = 50 * 60 * 1000;

// --daemon: 세션과 분리(nohup)되어 상시 실행. 발견한 메시지를 <busRoot>/inbox/<ms>.json 에 쌓고
// 계속 돈다 — 세션 인터럽트에도 죽지 않는다. 브리지는 가벼운 waiter로 inbox를 지켜보다 깨어난다.
const fs = require('fs');
const DAEMON = process.argv.includes('--daemon');
const ROOT = process.env.MAI_BUS_ROOT || '/Users/lsc/mai-family/.bus';
const INBOX = path.join(ROOT, 'inbox');
const DAEMON_LIFE_MS = 12 * 60 * 60 * 1000; // 12시간 후 자멸(하트비트가 재기동)

async function main() {
  const started = Date.now();
  if (DAEMON) fs.mkdirSync(INBOX, { recursive: true });
  for (;;) {
    let out = '[]';
    try {
      out = execFileSync('node', [POLL_SCRIPT], { encoding: 'utf8', timeout: 30000 });
    } catch (err) {
      process.stderr.write('[MaiBus] watch poll error: ' + err.message + '\n');
    }
    let msgs = [];
    try { msgs = JSON.parse(out); } catch { /* 무시 */ }
    if (Array.isArray(msgs) && msgs.length > 0) {
      if (DAEMON) {
        const f = path.join(INBOX, Date.now() + '.json');
        fs.writeFileSync(f, JSON.stringify(msgs, null, 1));
      } else {
        process.stdout.write(JSON.stringify(msgs, null, 1) + '\n');
        return;
      }
    }
    if (Date.now() - started > (DAEMON ? DAEMON_LIFE_MS : MAX_LIFE_MS)) {
      if (!DAEMON) process.stdout.write('[]\n');
      return;
    }
    await new Promise((r) => setTimeout(r, INTERVAL_MS));
  }
}

main();
