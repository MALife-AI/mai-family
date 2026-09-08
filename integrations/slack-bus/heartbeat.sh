#!/bin/bash
# heartbeat.sh — 10분마다: 증적 변경 커밋 + 심장박동 갱신 → mai-bus 레포 push.
# heartbeat.txt = "<UTC시각>\nprimary" — 2호기 워치독은 발신자(primary/secondary)와
# 시각 문자열로 생존을 판정한다(커밋 시각이 아니라 내용 기준 — 자기 커밋 오판 방지).
# 복귀 시 이력 분기를 pull --rebase로 흡수한다(heartbeat.txt 충돌은 로컬 우선).
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/lsc/mai-family/.bus || exit 0

# 스테일 인박스 감시 (MAGNET 승인 유실 재발 방지): 10분 이상 방치된 인박스 파일이 있으면
# ① #mai-status에 적체 경보 ② 브리지 재기동(runner는 잠금이 있어 중복 실행 안전).
# 스테일 인박스 복구 사다리 (Liam 지시 2026-08-12 — 안내가 아니라 실제 조치·재시도):
#  1차(10분+): 브리지 재기동(재시도 1). 2차(다음 틱에도 잔존): runner.lock 강제 해제 후 재기동(재시도 2)
#  — 스테일 잠금이 대표 원인. 3차(그래도 잔존): 실패 확정 — 원본 채널 스레드에 에스컬레이션.
#  시도 횟수는 stale-retry.txt(파일명 횟수)로 추적, 처리 완료된 파일 항목은 자동 정리.
STALE_FILES=$(find inbox -name '*.json' -mmin +10 2>/dev/null)
if [ -n "$STALE_FILES" ]; then
  ACTION=$(echo "$STALE_FILES" | python3 -c "
import sys, json, os, time, urllib.request
root = '/Users/lsc/mai-family/.bus'
token = open(os.path.join(root, 'slack.token')).read().strip()
state_p = os.path.join(root, 'stale-retry.txt')
state = {}
if os.path.exists(state_p):
    for ln in open(state_p).read().splitlines():
        parts = ln.split()
        if len(parts) == 2: state[parts[0]] = int(parts[1])

def post(ch, ts, text):
    body = {'channel': ch, 'text': text}
    if ts: body['thread_ts'] = ts
    req = urllib.request.Request('https://slack.com/api/chat.postMessage',
        data=json.dumps(body).encode(),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json; charset=utf-8'})
    urllib.request.urlopen(req, timeout=5)

unlock = False
summary = []
current = set()
for p in sys.stdin.read().split():
    base = os.path.basename(p); current.add(base)
    n = state.get(base, 0) + 1
    state[base] = n
    try:
        age = int((time.time() - os.path.getmtime(p)) / 60)
        msgs = json.load(open(p))
    except Exception:
        continue
    for m in msgs:
        ch, ts, repo = m.get('channel'), m.get('ts'), m.get('repo', '?')
        has_ch = ch and str(ch).startswith(('C', 'D'))
        if n == 2:
            unlock = True
            if has_ch: post(ch, ts, f'🔁 이 요청이 {age}분째 미처리라 잠금을 해제하고 재시도합니다 (2차).')
        elif n >= 3 and n == 3:  # 3차 도달 시 1회만 에스컬레이션
            if has_ch: post(ch, ts, f'❌ 이 요청은 자동 재시도 2회에도 처리되지 않았습니다 ({age}분 경과). 수동 확인이 필요합니다 — 메시지를 다시 보내거나 Liam에게 알려주세요.')
            summary.append(f'{repo} {age}분 (3차 실패)')
# 인박스에서 사라진(=처리된) 파일 항목 정리
state = {k: v for k, v in state.items() if k in current}
open(state_p, 'w').write('\n'.join(f'{k} {v}' for k, v in state.items()))
print(('UNLOCK' if unlock else '') + ('|' + '; '.join(summary) if summary else ''))" 2>/dev/null)
  case "$ACTION" in UNLOCK*) rmdir runner.lock 2>/dev/null || rm -rf runner.lock 2>/dev/null || true;; esac
  ESC=${ACTION#*|}; [ "$ESC" != "$ACTION" ] && [ -n "$ESC" ] && \
    node bin/slack-say.js _status "❌ 인박스 적체 에스컬레이션 — ${ESC}. 수동 개입 필요." 2>/dev/null || true
  STALE=$(echo "$STALE_FILES" | wc -l | tr -d ' ')
  node bin/slack-say.js _status "⚠️ 인박스 적체 ${STALE}건 — 브리지 재기동(재시도)." 2>/dev/null || true
  /Users/lsc/mai-family/.bus/bin/bridge-runner.sh >/dev/null 2>&1 &
fi
# 실패 보관함 회수: inbox-failed/ 파일을 inbox/로 되돌려 재시도시킨다.
if ls inbox-failed/*.json >/dev/null 2>&1; then
  mv inbox-failed/*.json inbox/ 2>/dev/null || true
fi

# 스테일 작업 원장 자동 종결 (Liam 지시 2026-08-12 — #mai-status 경과시간 오해 방지):
# tasks/*.json 중 status=running 이고 updated 가 24h 이상 지난 것은 팀원이 --done 을
# 안 부르고 세션이 끝난 것으로 보고 자동 종결한다(원장 status→stale-closed, 상태줄은 건드리지 않음).
if ls tasks/*.json >/dev/null 2>&1; then
  python3 -c "
import json, glob, os, time
now = time.time()
for p in glob.glob('tasks/*.json'):
    try:
        r = json.load(open(p))
    except Exception:
        continue
    if r.get('status') != 'running':
        continue
    try:
        upd = time.mktime(time.strptime(r.get('updated','')[:19], '%Y-%m-%dT%H:%M:%S'))
    except Exception:
        continue
    if now - upd > 86400:
        r['status'] = 'stale-closed'
        r['stage'] = '자동 종결(24h+ 미갱신, 하트비트) — 종전: ' + str(r.get('stage',''))
        json.dump(r, open(p,'w'), ensure_ascii=False, indent=1)
" 2>/dev/null || true
fi

# 데일리 크로스 스윕 트리거 (BRIDGE-LOOP §2.11): 매일 18시(KST) 이후 첫 틱에 1회,
# 워커에게 _sweep 안건을 투입해 affects 누락 크로스 영향을 선제 점검시킨다.
KDATE=$(TZ=Asia/Seoul date +%F); KHOUR=$(TZ=Asia/Seoul date +%H)
if [ "$KHOUR" -ge 18 ] && [ ! -f "sweeps/$KDATE.done" ]; then
  mkdir -p sweeps inbox
  printf '[{"repo":"_sweep","channel":"","ts":"","text":"데일리 크로스 스윕 %s (BRIDGE-LOOP 2.11절 절차대로)"}]\n' "$KDATE" > "inbox/$(date +%s)000-sweep.json"
  touch "sweeps/$KDATE.done"
fi
git pull -q --rebase -X theirs origin main 2>/dev/null || { git rebase --abort 2>/dev/null; git pull -q origin main 2>/dev/null; }
# 양보 모드에서는 heartbeat.txt에 손대지 않는다 — 그 파일은 2호기가 인계 마커(secondary 등)를
# 쓰는 채널이며, 맥이 덮어쓰면 맥 데드맨·2호기 판정이 서로 흔들린다. 평시에만 primary를 쓴다.
if [ ! -f primary-override.txt ]; then
  { date -u +%FT%TZ; echo primary; } > heartbeat.txt
fi
git add -A
git -c user.name="mai-coordinator" -c user.email="mai-bus@malife.local" \
  commit -q -m "chore: sync + heartbeat primary" 2>/dev/null || exit 0
git push -q origin main 2>/dev/null || true
