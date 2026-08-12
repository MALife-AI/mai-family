#!/bin/bash
# bridge-runner.sh — launchd가 inbox 변화 시 실행. 헤드리스 코디네이터 워커를 깨워
# BRIDGE-LOOP 절차로 inbox를 처리시킨다. 터미널 세션이 없어도 브리지가 동작한다.
# 중복 실행 방지 잠금 + 워커 세션 ID 재사용(기억 유지).
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
BUS=/Users/lsc/mai-family/.bus
LOCK="$BUS/runner.lock"
REG="$BUS/headless-sessions.json"
LOG="$BUS/runner.log"

# 인박스 비었으면 종료
ls "$BUS"/inbox/*.json >/dev/null 2>&1 || exit 0

# 잠금 (10분 이상 된 stale 잠금은 제거)
if [ -d "$LOCK" ]; then
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +10 2>/dev/null)" ]; then rmdir "$LOCK" 2>/dev/null; fi
fi
mkdir "$LOCK" 2>/dev/null || exit 0
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

SID=$(python3 -c "import json;print(json.load(open('$REG')).get('_coordinator',''))" 2>/dev/null)
PROMPT="너는 MAI-BUS 코디네이터 워커다(터미널 세션 부재 시 브리지 대행). /Users/lsc/mai-family/.bus/BRIDGE-LOOP.md 를 읽고 그 절차대로 inbox(/Users/lsc/mai-family/.bus/inbox/)의 메시지를 전부 처리하라: 접수 회신(slack-say) → 배정(팀원 헤드리스 resume, headless-sessions.json 참조) → 결과 게시(mai-bus comment). 인박스 파일은 절대 rm 하지 말 것 — 처리 완료 건만 mv로 /Users/lsc/mai-family/.bus/inbox-done/ 에 보관, 실패 건은 inbox-failed/ 로 이동(§2.7 무손실 규약). _action(버튼)은 §2.8, 승인요청은 slack-ask. 처리 후 종료하라."

cd /Users/lsc/mai-family || exit 1
if [ -n "$SID" ]; then
  OUT=$(claude -p --resume "$SID" --permission-mode acceptEdits --output-format json "$PROMPT" 2>>"$LOG")
else
  OUT=$(claude -p --permission-mode acceptEdits --output-format json "$PROMPT" 2>>"$LOG")
  NEWSID=$(printf '%s' "$OUT" | python3 -c "import json,sys;print(json.load(sys.stdin).get('session_id',''))" 2>/dev/null)
  if [ -n "$NEWSID" ]; then
    python3 -c "import json;p='$REG';d=json.load(open(p));d['_coordinator']='$NEWSID';json.dump(d,open(p,'w'),indent=1,ensure_ascii=False)"
  fi
fi
echo "$(date -u +%FT%TZ) run done" >> "$LOG"
