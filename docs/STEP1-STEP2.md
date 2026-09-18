# mai-family 역할 간소화 — 1단계(기능 검증, 10 제품) → 2단계(역할별 3 제품)

작성 2026-09-18. 1단계에서 열 개로 쪼갠 것은 기능을 하나씩 바깥 제품에 대응시켜 검증하려는 실험이었다. 검증이 끝났으니 기능은 그대로 두고 역할(정의·개발·사용) 기준으로 셋으로 합친다. Step 2 의 근거 계획은 mai-suite/docs/SETS-PLAN.md(§1 세트, §7 MAI Support 통합), 정본 로스터는 mai-suite/sets.yaml.

## 1단계 — 기능 검증 (10 제품, 레포 = 제품)

| 제품 | 한 줄 | 외부 솔루션 대응 | 실제 기반 |
| --- | --- | --- | --- |
| **MAGE** | 지식 관문·허브. 문서 vault·색인·GraphRAG·지식그래프·IAM(22 권한)·모델 게이트웨이·에이전트 콘솔·스킬 검수 | **LLMOps 플랫폼** — LiteLLM/Portkey(게이트웨이) + Dify/LangSmith(에이전트·평가) + Glean(사내 지식검색) 을 한 몸에 | FastAPI + React, Chroma, NetworkX 그래프, litellm + vLLM |
| **MAGIC** | 데스크톱 AI 에이전트 콘솔 | **Claude Desktop** (v1 은 goose 계보) | Electron(v2)/Tauri(v1), MOJO 런타임 내장 |
| **MOJO** | 터미널 코딩 에이전트 CLI | **Claude Code CLI** | Node, NSIS 설치본, 호스트 번들용 standalone 런타임 |
| **MERLIN** | Eclipse/PRO-frame IDE 안의 AI 코딩 | **GitHub Copilot for Eclipse / Claude Code IDE 확장** (레거시 Java IDE 판) | Eclipse 3.7 PDE 플러그인, dropins jar |
| **MAGMA** | 사내 Git 플랫폼 + AI 게이트웨이·정책·MR 리뷰봇 | **GitHub / GitLab** (+ Copilot 코드리뷰) | Forgejo/Gitea 리브랜딩 + ai-gateway·policy 컨테이너, Tauri 데스크톱 |
| **MESH** | 지식·문서 협업(블록 에디터, 컨플루언스 변환, 개인 AI 연결) | **Notion** (+ Confluence 가져오기) | Next.js 15, BlockNote, Postgres |
| **MAGNET** | 대화·협업(채널·스레드·에이전트 스튜디오·MCP) | **Slack** (+ Slack AI) | Fastify + React SPA, Postgres |
| **MYSTIC** | Tableau 대시보드 인사이트 챗봇 + 브라우저 확장 | **Tableau Pulse / ThoughtSpot Spotter** | Node 서버(호스트 프로세스), Chrome 확장 |
| **MARK** | concept drift 감지·온라인 적응 학습 커널(라이브러리 + MCP) | **River(온라인 ML) / Evidently(드리프트 감지)** — LLM 파인튜닝 아님 | Python, numpy 만, MCP stdio |
| **MANA** | Claude Code 스킬·에이전트 팩(141 에이전트·18 스킬, 서명 레지스트리) | **Claude Code 플러그인 마켓플레이스 / awesome-claude-code** | 마크다운 팩 + install.sh, HMAC 서명 레지스트리 |
| (묶음) mai-suite | 통합 설치본·서버 반입본 빌더 | — | NSIS + compose + 반입 스크립트 |

Step 1 의 특징: 제품이 레포 단위로 열 개 나란히 있고, 배포는 통합본 하나(MAI-Suite-Setup.exe + 서버 완성본). 세트·에디션 개념 없음. MANA·MARK 는 산출물 없음.

## 2단계 — 역할별 3 제품, 트릴로지 (2026-09-18 Liam 지시)

I 운영 = MAGE(정한다) · II 개발 = MAGIC(만든다) · III 현업 = MAI Support(쓴다).

세트 이름 = 밖에 보이는 제품명. 레포는 구성요소. MYSTIC 은 별도 작업(세트 밖).

| 제품 | 구성요소 | 외부 솔루션 대응 (묶음 기준) | 역할 경계 |
| --- | --- | --- | --- |
| **I · MAGE** (운영) | MAGE 코어 + MANA + MARK | **LLMOps + IAM 플랫폼** — LiteLLM/Portkey 게이트웨이 + Okta 식 권한 정의 + 모델 서빙(vLLM) + 스킬 레지스트리 | 파일 원본(vault)·모델 게이트웨이·**그래프와 파일의 IAM 정의까지만**. 지식그래프 기능·뷰어는 MAI Support 로 이관 |
| **II · MAGIC** (개발) | MAGIC + MOJO + MERLIN + MAGMA + MANA | **Claude Desktop + Claude Code + IDE 확장 + GitHub** 를 한 설치본으로 — "Claude for Developers + GitHub Copilot 스위트" 격 | 개발자 클라이언트 묶음(MAGIC-Setup.exe) + MAGMA 서버. 모델은 MAGE 게이트웨이 |
| **III · MAI Support** (현업) | MESH + MAGNET + 지식그래프(MAGE 에서 이관) + 공통 셸 | **Notion + Slack + 사내 지식그래프(Glean/Neo4j Bloom 식 뷰어)** 를 한 로그인·한 화면으로 — "Atlassian Confluence+Slack+Glean 통합" 격 | 하나의 서비스. 권한 판정은 MAGE IAM 에 위임, 추출 LLM 은 MAGE 게이트웨이 |
| (세트 밖) MYSTIC | — | Tableau Pulse | 별도 작업 |

### 구성요소별 매핑 (Step 2 에서 달라지는 것만)
| 구성요소 | Step 1 소속 | Step 2 소속 | 매핑 변화 |
| --- | --- | --- | --- |
| 지식그래프·뷰어 | MAGE 안 기능 | MAI Support 의 graph 서비스 | Glean/Bloom 식 "지식 뷰어" 로 독립. 저장소 base.json → SQLite |
| IAM | MAGE 안 기능 | MAGE 의 핵심 역할 | Okta/Keycloak 식 권한 서버 성격이 전면으로 |
| MANA | 독립 레포, 산출물 없음 | MAGE·MAGIC 양쪽 동봉 팩 | Claude Code 플러그인 마켓플레이스 = 두 제품의 부속 |
| MARK | 독립 레포, 산출물 없음 | MAGE 동봉 wheel | 소비자 없음. 동봉만 |
| MAGMA 데스크톱 | MAI-Suite-Setup.exe 선택 항목 | MAGIC-Setup.exe 기본 항목 | GitHub Desktop 격 |
| MESH·MAGNET 클라이언트 | 선택 항목 | MAI-Support-Setup.exe | Notion·Slack 데스크톱 격 |

### Step 2 안의 MAGMA — MAGIC 에 편입, "프롬프트가 곧 이력"
MAGMA 는 MAGIC 세트의 구성요소이면서 **바이브코딩 이력의 저장소**가 된다(근거 mai-suite/docs/SETS-PLAN.md §8).
| 층 | 내용 | 외부 대응 |
| --- | --- | --- |
| 브랜치 = 작업 | `vibe/<user>/<작업명>` 을 MAGIC 의 "새 작업" 버튼이 만든다. 사람이 git 을 몰라도 된다 | GitHub Desktop 의 브랜치 뷰 |
| 커밋 = AI 턴 묶음 | MOJO 가 이미 강제로 박는 `AI-Model` · `AI-Session-Id` · `AI-Assisted` 트레일러 | Copilot 커밋 속성 표기 |
| git-notes = 프롬프트 전문 | `refs/notes/mai` 에 그 커밋을 만든 턴의 프롬프트·응답·도구 호출·diff 해시. 별도 DB 없이 push 로 따라간다 | (대응 없음 — 차별점) |
| 롤백 세 층 | 턴 되감기(커밋 전 체크포인트) · 커밋 되돌리기(revert·분기, 이력 보존) · 세션 재개(`AI-Session-Id` 로 resume) | git revert + Claude Code `--resume` |
| 원장·리뷰 | MAGMA policy 해시 체인 원장 · 리뷰봇이 notes 의 프롬프트를 근거로 "의도 대비 구현" 리뷰 | GitLab 감사 로그 + Copilot 코드리뷰 |
MAGMA 데스크톱(Tauri)은 MAGIC 안의 "작업" 탭으로 흡수된다. 현업 사용자에게는 reset --hard 를 주지 않는다.

### Step 1 → Step 2 에서 안 바뀌는 것
레포 이름·코드 식별자·포트 슬롯(0~5)·MAGE 인증 위임(MESH·MAGNET 비밀번호 = MAGE)·통합본(`MAI_SET=all`) 은 유지.
