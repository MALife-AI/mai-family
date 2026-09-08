# MAI-BUS Slack 연동 코드 (사본)

미래에셋 AI 패밀리 세션 버스(MAI-BUS)의 Slack 연동 계층입니다.
운영 원본은 로컬 `~/mai-family/.bus/`(레포 [mai-bus](https://github.com/MALife-AI/mai-bus))이며,
이 디렉터리는 패밀리 아키텍처 맵 차원의 **참조 사본**입니다. 2026-08-12 기준.

## 구성

| 파일 | 역할 |
| --- | --- |
| `mai-bus.js` | 버스 코어 — 안건 publish/pending/ack, Slack 채널 라우팅(`slackTargets`), 미러, §2.10 강제 포매터(`formatReadable`) |
| `mai-bus-threads.js` | 회의록(스레드) 레이어 — 안건별 발언 기록 + 역할 명의 Slack 미러 |
| `slack-socket-daemon.js` | Socket Mode 실시간 수신 데몬 — 메시지·버튼·첨부파일 수신, 인박스 적재, 1·2호기 failover |
| `slack-say.js` | 채널 발신 CLI — 역할 명의(`--as`/`--emoji`), 파일 업로드(`--file`), 포매터 우회(`--raw`) |
| `slack-ask.js` | 허용/거부 버튼 질문 게시 |
| `slack-watch.js` / `slack-bridge-poll.js` | 수신 폴링(소켓 데몬 폴백) |
| `slack-update.js` | 기존 메시지 갱신(chat.update) |
| `bridge-runner.sh` | 인박스 감시 → 헤드리스 코디네이터 워커 기동 |
| `heartbeat.sh` | 10분 틱 — 증적 sync, 생존 신호, 적체 복구 사다리(재기동→잠금 해제→에스컬레이션) |
| `slack.json.example` | 레포→채널 라우팅 맵 예시 (실값·토큰은 커밋 금지) |

## 라우팅 규칙 요약

- 프로젝트 안건 → 자기 채널. `affects` 선언 크로스 안건 → `#10-council`에도 미러.
- `--kind info --affects ""`(브로드캐스트 공지) → `#00-notice`에도 미러.
- 역할 팀원 발언(`REPO/역할`)은 프로젝트 채널만 (council 소음 방지).
- 모든 발신 텍스트는 `formatReadable`로 문장 단위 개행 강제 (코드블록 보존).

## 비밀

`slack.token`(봇)·`slack-app.token`(Socket Mode)·`bots/*.token`은 어떤 레포에도 커밋하지 않습니다.
