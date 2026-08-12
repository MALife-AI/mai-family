# 미래에셋 AI 패밀리 — 일자별 릴리즈 노트 (2026.06.24 – 08.12)

> 기능 개발 히스토리 피치덱(`decks/dev-history.html`)에서 분리해 보존하는 일자별 개발 내역이다.
> 전 12개 저장소(제품 10 + mai-suite·mai-family)의 git log·릴리스 태그·MAI-BUS 회의록에서 집계했다.
> 총계: **50일 · 커밋 406건 · 릴리스 태그 42회 · 개발일 26일**.

## 6월 말 — 7월 초 · 첫 마법 (41커밋)

| 날짜 | 내용 | 커밋 |
| --- | --- | --- |
| 06.24 | **첫 제품 MOJO 출범** — 사내 코딩 도우미로 리브랜딩, 미래에셋 CI(오렌지) 적용 | 5 |
| 06.25–26 | 시작 배너 다듬기 · goose 레시피 → 슬래시커맨드 변환기 · 불필요한 상속 워크플로 23개 제거 | 6 |
| 06.29 | **Windows 설치본(NSIS) 첫 완성** · MERLIN↔MOJO 브리지 · MAI suite 인스톨러 시동 · 패밀리 문서 정비 | 17 |
| 06.30–07.01 | 설치 결함 연속 수정 — 재설치 잠금·한글 깨짐(UTF-8 BOM)·경로 버그 해소 | 7 |
| 07.02 | **전 제품 공식 로고 일제 반영** — 패밀리 브랜드 확정 | 6 |
| 07.06 | MYSTIC 크롬 확장 기업 강제설치(무개입) 채널 · MERLIN·MARK·MANA 품질 부채 정리 | 7 |

## 7월 첫째—둘째 주 · 패밀리 확장 (177커밋)

| 날짜 | 내용 | 커밋 |
| --- | --- | --- |
| 07.07 | **MESH·MAGNET 탄생** — 사내 '노션'(BlockNote 기반)과 '슬랙'(Rocket.Chat 기반)이 하루에 출발 · MYSTIC 자기완결형 PoC 설치본 | 19 |
| 07.08 | **MAGMA 탄생** — 사내 Git 플랫폼(Forgejo 서버 + Tauri 클라이언트) · AI Copilot(코드완성·커밋메시지·MR 리뷰) · MAGNET 폐쇄망 단일 파일 번들 | 24 |
| 07.09 | mai-suite 통합 인스톨러 출발 · MESH RBAC(공개/부서/개인) + Confluence 실시간 동기화 · 전 제품 명세서 3종 작성 붐 · MAGMA 단위테스트 71개 | 49 |
| 07.10 | **최다 기록의 날** — 데스크톱 클라이언트 3종(MESH·MAGNET·MAGMA) 추가 · MESH 문서 포맷 확장 3단계(md·xlsx·pptx·pdf → 코드 셀 → 한글 HWP/HWPX 읽기+쓰기) · MOJO 한글 기본화 · CI 셀프호스트 러너 정비 | 54 |
| 07.11 | MAGE 기반시설 대공사 — 단일노드 compose 트랙, GPU/NPU(리벨리온 RBLN) 워커 번들, Harbor 레지스트리, 테넌트 격리(NetworkPolicy), DCGM 모니터링, 모델 허브 | 24 |
| 07.12–13 | 큐 기반 무중단 오토스케일(KEDA) · Kueue GPU 공정분배 · Serving Settings 구조화 폼 | 4 |
| 07.14 | **패밀리 대통합의 날** — 전 제품 X-MAI 헤더·MAGE 중앙 감사 emit 일제 배선(MOJO·MAGIC·MYSTIC·MERLIN·MESH·MAGMA) + AI 패밀리 통합 플랜 문서 | 22 |

## 7월 하순 — 8월 · 반입·보강·규약 (188커밋)

| 날짜 | 내용 | 커밋 |
| --- | --- | --- |
| 07.15 | 서버 풀번들 자립화 — 자립 이미지 팩 + 클린 재설치 · MAGE 프론트 포트 정리(8000) | 12 |
| 07.20–21 | 보안 백포트 4건 · 무중단 배포(롤아웃 API) · 반입용 2GB 분할 워크플로 · HF 모델 다운로드+1.9GB 분할 | 25 |
| 07.22 | 발표자료 전면 단장 — 미래에셋생명 BI 톤 리스킨·PDF 재생성 (mai-family) | 23 |
| 07.24 | 도커 이미지 pull→save→분할 자동화 · 러너 디스크 정리 워크플로 | 7 |
| 08.04 | **MAI 보강과제 일제 반영** — MAGE-1~6·MAGIC-1~3·MOJO-1~4·MYSTIC-1~3·MERLIN-1~3·MESH-1~3·MAGMA-1~6 (28건) · MAGIC Tauri 셸 실구현 | 24 |
| 08.06 | 반입 후에야 드러난 결함 일괄 수정 — airgap v0.2.3 전면 401 해소 · KPS webhook 비활성화 · CI 자동추가 워크플로 정비 | 16 |
| 08.08 | 패밀리 계약을 mai-suite로 이관 + 생성·검사 도구 — 계약을 기계가 검사하는 규칙으로 | 3 |
| 08.10 | **MAI-BUS 팀장 회의실 첫 가동** — 안건 11·발언 77·승인 9·결과 12 (첫날 회의록 기준) · 계약 A 인증 방언 단일화(MAGMA·MESH) · decision 어휘 분리(MAGE#58) · X-Mai-Tenant 핀 제한(MAGE#57) · 세션 로그인(서명 쿠키) · 감사 전문 마스킹 기록(계약 D) · MOJO 대규모 기능(플리커 프리 렌더러·루프 감지·압축 개선) | 46 |
| 08.12 | 온톨로지 v2 일원화(MAGE P1·P2) + 마이그레이션 · 공시실 약관 PDF 크롤러 골격 · MESH CI 타임아웃 대응 | 6 |

## 저장소별 커밋 분포

| 저장소 | 커밋 | 첫 커밋 | 주요 릴리스 태그 |
| --- | --- | --- | --- |
| MOJO | 70 | 06.24 | mojo-v0.1.0, mai-suite-v1.0.0/1.1.0 |
| MAGE | 52 | 06.29 | airgap-v0.2.1~4, baremetal-v0.1.x, ontology-v0.1.x, vllm-v0.22.1 |
| mai-family | 51 | 07.08 | (소개·발표자료) |
| mai-suite | 50 | 07.09 | mai-suite-v1.2.0/1.3.0, mai-family-servers-v1.0.0 |
| MYSTIC | 41 | 07.02 | mystic-v0.2.0, mystic-ext-v1.0.0 |
| MESH | 38 | 07.07 | airgap-v0.1.0, 서버·데스크톱 rolling |
| MAGMA | 33 | 07.08 | 서버·데스크톱 rolling |
| MAGNET | 24 | 07.07 | v0.1.0/0.1.1, desktop-v0.1.0 |
| MERLIN | 22 | 07.02 | merlin-dropins-v0.1.0/0.1.1 |
| MAGIC | 19 | 07.02 | magic-v2.0, tauri rolling |
| MANA | 4 | 07.02 | — |
| MARK | 2 | 07.02 | — |

---
_생성: 2026-08-12 · mai-family/sales · 근거: 각 레포 `git log --date=format:%Y-%m-%d` 및 `.bus/minutes/2026-08-10.md`_
