# 미래에셋 AI 패밀리 — 일자별 릴리즈 히스토리 (백필)

> `.bus/bin/minutes.js`의 릴리즈 노트 섹션(`collectReleases`)을 과거 날짜로 소급 실행해 생성한 문서다.
> 대상 기간 **2026-06-01 ~ 2026-08-12**, 전 12개 레포 로컬 git log 기준(--all, no-merges, KST 일자).
> 집계: **개발일 42일 · 커밋 723건**. 생성일 2026-08-12.
> 수기 요약본은 [release-notes.md](release-notes.md) 참조 — 이 문서는 기계 생성 원본 데이터다.

### 2026-06-04

_1개 레포 · 커밋 1건_

#### 🧙 MAGE (1)
- `26ae1774` feat(baremetal): slim 번들(GPU 휠 제외) + install --torch-venv — _Cloud User_

### 2026-06-17

_1개 레포 · 커밋 9건_

#### 🧙 MAGE (9)
- `0f00cfc1` feat(inference): 추론 대상 관리 일원화 — 새 '추론 대상' 탭 — _Cloud User_
- `b0fa36da` feat(inference): 추론 대상 통합 source 라벨 + 'local' 잔재 정리 — _Cloud User_
- `899768a2` feat(graph): 빌드 provenance(built_with) 기록 — _Cloud User_
- `7df23c5d` feat(ingest): 구축 서빙 인스턴스 선택기 + built_with 연결 — _Cloud User_
- `575ab93c` feat(policy-ui): 정책 탭 권한을 카탈로그 체크박스로 구체화 — _Cloud User_
- `334714dc` feat(iam): 기능별 권한 세분화 + 정책 권한 적용 + goose 권한 게이팅 — _Cloud User_
- `393db68d` feat(skills): 마켓 검수 + 승인 스킬을 키별 allowlist로 goose(/mcp) 노출 — _Cloud User_
- `f40ec438` feat(baremetal): Layout↔Tenant 통합 + 멀티모델 키 + goose MCP 호환 — _Cloud User_
- `58a81b73` feat(graph): 외부 MCP 게이트웨이 + goose 연동, 노드 자동화 제거, emit_audit 수정 — _Cloud User_

### 2026-06-18

_1개 레포 · 커밋 10건_

#### 🧙 MAGE (10)
- `fda5f9d4` fix(litellm): Anthropic /v1/messages 를 chat/completions 로 강제 (Responses API 우회) — _Cloud User_
- `2a455dca` fix(health): 대시보드 헬스체크를 /api/v1/health 로 이동 — nginx /health 프록시 불필요 — _Cloud User_
- `38e58475` chore: goose 클라이언트 산출물 제거 — goose-ma 레포로 이전 — _Cloud User_
- `85fdc23e` refactor(ui): 스킬 '만들기' 탭 제거 — 포탈은 관리/검수 전담, 저작은 goose(skill_create) — _Cloud User_
- `efd9a8ff` fix(portal): /health nginx 프록시 + local 더미 제거 + goose skill_create MCP 도구 — _Cloud User_
- `8e250018` feat(gateway): /v1/messages thinking 토글 주입 (기본 OFF, Anthropic thinking 파라미터로 per-request ON) — _Cloud User_
- `8b2b7737` fix(baremetal): vllm@.service PATH 에 venv/bin 추가 (ninja 등 빌드도구) — _Cloud User_
- `4e58316c` fix(provision): 재생성 시 커스텀 serve 인자(EXTRA_ARGS) 초기화 방지 — _Cloud User_
- `e5eb5549` docs(turboquant): 확정 스택(Py3.11/vLLM0.19.1)에 맞춰 정정 — _Cloud User_
- `e05e1485` docs(turboquant): vLLM 0.19.1 TurboQuant 통합 런북 + provision --turboquant 옵트인 — _Cloud User_

### 2026-06-22

_1개 레포 · 커밋 15건_

#### 🧙 MAGE (15)
- `4a2f0bb9` build(install): codeexec 멱등 배포 블록 + :398 thinking-kwargs 정리 — _Cloud User_
- `3ad2728d` build(baremetal): codeexec 단일 이미지 배선 — 휠(wheels-codeexec) 다운로드 + codeexec/tenant-ssh 스테이징 — _Cloud User_
- `baa32e67` feat(codeexec): 산출물 다운로드(URL+base64) + 단일 128K 기본값 + YaRN 패치 — _Cloud User_
- `aee5819f` refactor(codeexec): computer-use 를 포탈에서 제거 → goose(클라이언트) 소관 — _Cloud User_
- `762605bb` feat(provision): L40S 다중사용 롱컨텍스트 기본값 — fp8 KV + chunked-prefill + util 0.92 + --max-num-seqs — _Cloud User_
- `26624116` feat(tenant-ssh): admin UI SSH key issue/revoke modal (E frontend) — _Cloud User_
- `6758f888` feat(gateway): 테넌트별 Anthropic EXT 포트(F) — _Cloud User_
- `20912b8a` feat(codeexec): Tier2 대화형 computer-use 프로파일(C) — _Cloud User_
- `2535b54f` feat(codeexec): HWP/HWPX 헬퍼 모듈(B) + CODEEXEC_LIB 주입 — _Cloud User_
- `22c42504` feat(tenant-ssh): 테넌트 SFTP chroot 파일접근 + 백엔드 키 관리(E) — _Cloud User_
- `68dc3ac6` chore(codeexec): bwrap userns 사전검증 스크립트 + env 예시 — _Cloud User_
- `6b2746d0` feat(compute-tenant): --kind compute(VM) + python-exec 툴 + 테넌트 목록 연동 — _Cloud User_
- `4c043873` feat(codeexec): bwrap 샌드박스 코드 인터프리터 사이드카 (compute 테넌트용) — _Cloud User_
- `b44dc18e` feat(baremetal): 테넌트 로그 SSE 라이브 스트리밍 — _Cloud User_
- `c5dade81` fix(model-backend): '모델 backend' 탭에 베어메탈 테넌트 노출 — _Cloud User_

### 2026-06-23

_1개 레포 · 커밋 3건_

#### 🧙 MAGE (3)
- `90e30e4b` feat(baremetal-ui): 테넌트 생성 폼에 Anthropic EXT 포트(F) 노출 — _Cloud User_
- `eba8ba9a` feat(gateway): per-key thinking 기본값 — goose 가 UI 토글 없이 키로 thinking ON — _Cloud User_
- `65fe26c7` fix(install): warn() 함수 정의 누락 — set -e 에서 'warn: command not found' 로 중단 — _Cloud User_

### 2026-06-24

_1개 레포 · 커밋 23건_

#### 🧙 MAGE (23)
- `1cb92180` fix(MAGE dev): 알파 잔여 제거(닫힌 흰영역 투명화) — _Cloud User_
- `8506ddb0` docs(MAGE dev): 패밀리 링크 mirae-mana → MANA — _Cloud User_
- `6442ca0e` fix(MAGE dev): 로고 알파 클린업 — _Cloud User_
- `0be2444b` docs(MAGE dev): 패밀리 섹션 — MANA/MAGIC 상호 링크 — _Cloud User_
- `391c98ad` style(MAGE dev): 로고 배경 투명 + 제목 약자 병기 — _Cloud User_
- `6e10f5ca` feat(MAGE dev): 킬 스위치 전용 탭 반영(채널=dev) — _Cloud User_
- `6a2fe547` refactor(MAGE dev): 스킬관리 코드 완전 제거(main 동일) — _Cloud User_
- `4361bb15` docs(MAGE beta): README 뱃지 위에 로고 추가 — _Cloud User_
- `0fd37f79` feat(MAGE dev): 관리패널 킬스위치 사유입력 enhancement 반영(채널=dev) — _Cloud User_
- `db6ea8fa` docs(MAGE beta): 베타 미리보기 README + 기술문서 — _Cloud User_
- `bfd23b92` chore(MAGE): dev 채널 — MAGE_CHANNEL='dev'(전체 admin 탭 노출, 개발중) — _Cloud User_
- `ee2f2e82` fix(MAGE): 채널 플래그를 IS_RELEASE(as string)로 — const 리터럴 narrowing 으로 인한 TS2367 회피 — _Cloud User_
- `5cb2b478` feat(MAGE): 릴리즈 채널 — admin 베타 탭 분리 + 스킬 재편 + 킬스위치 관리패널 일원화 — _Cloud User_
- `b913af7b` docs(MAGE): README 개조식 정리 + GitHub 버전/배지 헤더 — _Cloud User_
- `52bc39b8` rebrand(MAGE): 공식 로고(마법사) 아이콘 적용 — 글씨 제외 마크만 — _Cloud User_
- `338dbbbf` docs(MAGE): README 인트로 톤 부드럽게 + 브랜딩(마법사/acronym) 제거 — _Cloud User_
- `73236fc3` chore: uv.lock gitignore (lockfile 미추적 관례) — _Cloud User_
- `40d22a1d` refactor(ui): WorkflowEditor 페이지 제거 + 베이스 폰트 가독성 상향 — _Cloud User_
- `1beb8fb0` docs(rebrand): RELEASE 의 레포 URL mai-portal → MAGE (GitHub 리네임 반영) — _Cloud User_
- `16a0e334` rebrand(MAGE): M:AI Portal → MAGE 브랜딩 + 오렌지 스파크 마크 통일 — _Cloud User_
- `05dcd6dc` docs(rebrand): MaLife Lake → MAGE (MiraeAsset AI Governance Engine) — _Cloud User_
- `63069293` fix(review): 멀티에이전트 리뷰 확정 이슈 수정 (HIGH 4 + MEDIUM 6 + LOW 8) — _Cloud User_
- `353905aa` fix(codeexec): venv python(심볼릭) 샌드박스 exec 경로 바인드 — _Cloud User_

### 2026-06-25

_1개 레포 · 커밋 7건_

#### ⚙️ MOJO (7)
- `1f76435` docs(MOJO): .env.example — MAGE 게이트웨이 연결 설정(검증된 OPENAI_* 변수) — _sckahn_
- `e78e71b` feat(MOJO): 시작 배너 별 뾰족하게(astroid p0.5) + 대각 미래에셋 오렌지 그라데이션(셀단위) — _sckahn_
- `6b9f1bc` feat(MOJO): 시작 배너 십자성을 미래에셋 CI 오렌지(#F37021)로 고정 — _sckahn_
- `139182a` feat(MOJO): 시작 배너를 십자성(4점 스파크)로 — 로고 스파크와 통일 — _sckahn_
- `42cc9ab` rebrand(MOJO): 프로그램명/usage qwen→mojo, 약자 병기, 로고 서브타이틀 — _sckahn_
- `f12d1d0` rebrand(MOJO): Qwen Code → MOJO (MiraeAsset AI 코딩 CLI) — _sckahn_
- `bcb0efa` fix(ide): validate QWEN_CODE_IDE_SERVER_PORT before reading lock file (#5805) — _sckahn_

### 2026-06-26

_1개 레포 · 커밋 4건_

#### ⚙️ MOJO (4)
- `7c3f513` docs(readme): 이름 어원·라이선스 부연 설명 제거 (법적 고지는 LICENSE 파일에 유지) — _sckahn_
- `07f6f8d` ci(mojo): qwen-code 상속 워크플로 23개 전부 제거 (포크 불필요 + private Actions 분 폭식 차단) — _sckahn_
- `9b48590` feat(mojo): recipe-import 이름 개선(generic 파일명→title) + 예시 레시피 2종(release-risk/project-analyzer) — _sckahn_
- `736a6ff` feat(mojo): goose 레시피 → MOJO 슬래시커맨드 변환기(recipe-import.mjs) — _sckahn_

### 2026-06-29

_3개 레포 · 커밋 31건_

#### 🧙 MAGE (1)
- `025bebff` docs(family): MYSTIC 추가(7멤버) — _sckahn_

#### 🪄 MERLIN (14)
- `b20ab68` feat(cli): PROFRAME_CLAUDE_ARGS — bin 런처(node.exe)에 prefix 인자(cli-entry.js) 전달 — _sckahn_
- `b2b59c8` fix(merlin): SDK 구버전 Lucene 제외 + 번들 lib classpath 우선 — IndexWriter 생성자 충돌 해결 — _sckahn_
- `d02d30e` fix(merlin): classpath 에서 .source_ 번들 제외 — javac 중복 컴파일 방지 — _sckahn_
- `3d23f3c` build(merlin): PDE build 우회 — 직접 javac(1.6) 컴파일로 dropins 번들 jar 생성 — _sckahn_
- `7fd4211` fix(pde): skipFetch 시 staging/{features,plugins} 에 소스 직접 배치 — _sckahn_
- `b1e6c58` fix(pde): skipFetch/skipMaps — 로컬 소스 빌드라 CVS fetch 단계 제거 — _sckahn_
- `0c6d5f0` ci(merlin): Eclipse 3.7 헤드리스 PDE 빌드 워크플로 — dropins jar 산출(feasibility) — _sckahn_
- `bd51982` feat(cli): NDJSON 에 tools 정의 포함 — MOJO merlin-bridge 도구 광고용 — _sckahn_
- `190b866` docs(family): MYSTIC 추가(7멤버) — _sckahn_
- `00a2274` docs(family): MARK 링크 org 이전 반영 — _sckahn_
- `724c891` design: MERLIN 로고 삽입 + 가족 섹션 MARK 추가(6멤버) — _sckahn_
- `4832768` design: MERLIN 로고 교체(미래에셋 군청/오렌지 브랜드) — _sckahn_
- `614ddf2` docs(family): 가족 섹션 설명 제거 — 링크만 유지 — _sckahn_
- `3601e5a` docs: MERLIN README — 미래에셋 AI 패밀리(Eclipse/PRO-frame IDE 임베디드 AI 어시스턴트) — _sckahn_

#### ⚙️ MOJO (16)
- `4d508b1` fix(mojo): .nsi UTF-8 BOM — 인스톨러 한글 깨짐 해결 — _sckahn_
- `826a7cc` fix(suite): .nsi UTF-8 BOM — 인스톨러 한글 깨짐 해결(makensis UTF-8 파싱) — _sckahn_
- `e204c18` feat(suite): MERLIN Eclipse 경로 자동감지(dropins 스캔) + proframe.ini/eclipse.ini 자동탐지 — _sckahn_
- `f70104c` feat(suite): MERLIN 컴포넌트 추가 — dropins + eclipse.ini MOJO 브리지 자동배선 — _sckahn_
- `aee5c61` feat(merlin+suite): merlin-bridge(MERLIN↔MOJO) + MAI suite 인스톨러 — _sckahn_
- `b852152` docs(family): MYSTIC 추가(7멤버) — _sckahn_
- `26b8d67` docs(family): MARK 링크 org 이전 반영 — _sckahn_
- `55f59f6` docs(family): MARK 추가(6멤버) — _sckahn_
- `8fbf437` design: MOJO 로고 교체(미래에셋 군청/오렌지 브랜드) — _sckahn_
- `c8cac00` docs: 존댓말 제거·개조식 통일 — _sckahn_
- `8a9c08d` docs(family): 가족 섹션 설명 제거 — 링크만 유지 — _sckahn_
- `f4ad1f5` docs(family): MERLIN(IDE 플러그인) 추가 — _sckahn_
- `cd231f2` ci(mojo): makensis OUTFILE 절대경로 — installer 가 repo 루트에 생성되게(NSIS는 컴파일 성공) — _sckahn_
- `58caa3d` ci(mojo): extract/makensis 를 PowerShell(Expand-Archive)로 — Git Bash unzip 부재 해결 + 절대경로 — _sckahn_
- `5918867` build(mojo): Windows 인스톨러(NSIS) — 설치 중 키 입력 → ~/.qwen/.env — _sckahn_
- `2b53119` docs(mojo): 기본 프로바이더를 Anthropic 호환으로 — MAGE Anthropic 게이트웨이(/v1/messages) — _sckahn_

### 2026-06-30

_2개 레포 · 커밋 6건_

#### 🧙 MAGE (5)
- `e29d2f7b` fix(baremetal): fresh-image 원샷 블로커 3건 일괄(F1~F3 audit) — _sckahn_
- `bbe01c8b` feat(baremetal): --no-base-model — base 인스턴스 없이 GPU foundation만(B방식) — _sckahn_
- `1746f86e` fix(baremetal): 신선배포 무결성 — 재발 문제 일괄 차단(F1~F7) — _sckahn_
- `e4559822` feat(baremetal): Phase 2 — GPU 개수 자동 할당(여유 GPU fitting) — _sckahn_
- `dfc922e7` feat(baremetal): 프로필(이미지) 카탈로그 — AWS AMI+인스턴스 타입 스타일 provisioning — _sckahn_

#### ⚙️ MOJO (1)
- `5b8de13` harden(suite): MERLIN jar 버전 하드코딩 제거 — 버전무관 *.jar + merlin_tag 파라미터화 — _sckahn_

### 2026-07-01

_3개 레포 · 커밋 9건_

#### 🧙 MAGE (2)
- `3849f02b` feat(baremetal-ui): 전수검사 남은 3건(#3 관측성 #4 모델검증 #5 스팸/로그) — _sckahn_
- `6cf7979e` fix(baremetal-ui): AWS식 프로비저닝 전수검사 상위 2건(감사) — _sckahn_

#### 🪄 MERLIN (1)
- `d4e247e` refactor(merlin): claude→mojo 전면 리브랜딩 — _sckahn_

#### ⚙️ MOJO (6)
- `62d1888` fix(suite): MERLIN 브리지 시스템프로퍼티 proframe.claude→proframe.mojo (리브랜딩 일치) — _sckahn_
- `d7317ad` fix(installer): 재설치 시 잠긴 node.exe 건너뛰게(SetOverwrite try) — _sckahn_
- `4fc9f5f` fix(installer): NSIS FileWrite 문법 — set 문의 batch식 따옴표 제거 — _sckahn_
- `a50dca7` fix(installer): mojo.cmd 가 ambient ANTHROPIC_* 비우고 실행(#7 키 틀림) — _sckahn_
- `3d1382a` design(mojo): 시작 배너 ASCII 로고 → MOJO 워드마크(ANSI Shadow) — _sckahn_
- `e7f96ea` fix(installer): MOJO standalone 경로버그 — cli-entry.js not found + MERLIN 브리지 — _sckahn_

### 2026-07-02

_6개 레포 · 커밋 12건_

#### 🧙 MAGE (6)
- `da0c4028` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_
- `1993b202` feat(baremetal): --set-allow-ips — 기존 EXT 블록 허용 IP in-place 갱신 — _sckahn_
- `7ecacc54` feat(baremetal): EXT 포트 IP allowlist — 망 대역 밖 접근 차단(--allow-ips) — _sckahn_
- `57dfcd8f` feat(codeexec): ext_port 에 /codeexec 프록시 라우트(--codeexec-port) — _sckahn_
- `3c086ea6` feat(codeexec): provision --kind compute 에 goose 세션 배선 — _sckahn_
- `31580a03` feat(codeexec): Phase3 goose 코딩 세션 API — /shell + /fs/read + /fs/write — _sckahn_

#### 🎩 MAGIC (2)
- `b5a3190` docs: 약어 풀이 7곳에 MiraeAsset 표기 추가 — _sckahn_
- `58d4703` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_

#### 💧 MANA (1)
- `7b82a27` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_

#### 📊 MARK (1)
- `e0f8d45` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_

#### 🪄 MERLIN (1)
- `4262e78` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_

#### ⚙️ MOJO (1)
- `58d4703` brand: 공식 로고 반영 (이미지 텍스트 판독으로 매핑 확인, 투명배경) — _sckahn_

### 2026-07-03

_1개 레포 · 커밋 1건_

#### 🔮 MYSTIC (1)
- `9c95092` fix(installer): HELP_FILE 경로 — NSIS File 상대경로는 .nsi 기준. 절대경로 /D 전달 + 기본값 ..\ 교정 — _sckahn_

### 2026-07-06

_6개 레포 · 커밋 14건_

#### 🎩 MAGIC (5)
- `7256ab1` docs(security): 잔여 위험 등록부 추가(SECURITY-RESIDUAL.md) — _sckahn_
- `86c9a93` fix(security): WebView TLS 검증 전역 무력화·CSP 해제 제거 (desktop-tauri) — _sckahn_
- `be26170` fix(channel): 봇 채널 import를 지연 팩토리로 변경해 부분 allowlist에서도 비활성 채널이 로드되지 않도록 수정 — _sckahn_
- `dc56848` chore: MAGIC Tauri 셸 기술부채 정리(스텁 구현·딥링크 브랜딩) — _sckahn_
- `8a0f938` chore: MOJO 리브랜딩 잔재 정리 및 봇 채널 공격표면 축소 — _sckahn_

#### 💧 MANA (1)
- `bb6bf41` chore: 설치 스크립트·문서 품질 기술부채 정리 — _sckahn_

#### 📊 MARK (1)
- `86403ab` chore: 품질 기술부채 정리 (세션 상한·네이밍 문서화·입력 검증) — _sckahn_

#### 🪄 MERLIN (2)
- `33d56a4` docs(execute-command): cwd 설정이 보안 샌드박스가 아님을 주석에 정확히 명시 — _sckahn_
- `8bed61f` chore: MERLIN 품질 기술부채 정리 (execute_command 구현, 쓰기 정책, JSON 파서 견고화) — _sckahn_

#### ⚙️ MOJO (2)
- `be26170` fix(channel): 봇 채널 import를 지연 팩토리로 변경해 부분 allowlist에서도 비활성 채널이 로드되지 않도록 수정 — _sckahn_
- `8a0f938` chore: MOJO 리브랜딩 잔재 정리 및 봇 채널 공격표면 축소 — _sckahn_

#### 🔮 MYSTIC (3)
- `d9e9c41` refactor(ext): 백엔드 서빙 제거 → 인스톨러 로컬 CRX 레지스트리 방식(서버 불필요) — _sckahn_
- `cc45cd4` feat(ext): 크롬 확장 엔터프라이즈 강제설치(무개입) 배포 채널 추가 — _sckahn_
- `7b3338d` chore: 미사용 레거시 모듈 제거 및 확장↔백엔드 엔드포인트 프리픽스 정합 — _sckahn_

### 2026-07-07

_5개 레포 · 커밋 24건_

#### 🎩 MAGIC (5)
- `0b1b95a` chore(ci): 설치본을 Release 자산으로 게시 — 아티팩트 스토리지 우회 — _sckahn_
- `8ac26aa` chore(ci): Tauri 아티팩트 업로드 축소 — 설치본만 + 7일 retention — _sckahn_
- `b3468a3` feat(settings): 개발자 설정에 코드 모드 토글 추가 — _sckahn_
- `a50667a` fix(ui): "Cannot read properties of undefined" 런타임 크래시 11건 수정 — _sckahn_
- `4e9cd02` fix(tauri): fs 접근을 런타임/설정 기반으로 부여 + shim 누락 메서드 보강 — _sckahn_

#### 🧲 MAGNET (5)
- `94f732d` design: 공식 MAGNET 로고 반영 (자석 심볼 + 워드마크 + 태그라인) — _sckahn_
- `a69d2bb` feat: MAGNET AI 를 MAGE 테넌트로 중앙통제 연동 — _sckahn_
- `a6a2ae1` feat: MAGNET AI — /ai 슬래시커맨드·REST·관리자 설정·LLM 연동 — _sckahn_
- `8af7258` feat: Rocket.Chat 8.7 기반 MAGNET 리브랜딩 · 폐쇄망 배포 · 설치 문서 — _sckahn_
- `58bf166` docs: MESH/MAGNET 초기 README — _sckahn_

#### 🪄 MERLIN (2)
- `46051b5` fix(core): mcp.tools 패키지 Export-Package 추가 — UI의 PermissionGate 로드 실패 해결 — _sckahn_
- `5e6d997` fix(index): Lucene 4.10.4→4.7.2 다운그레이드로 JDK 1.6 런타임 로드 실패 해결 — _sckahn_

#### 🕸️ MESH (4)
- `3bb245c` feat: MESH 로고 반영 (메시 마크 SVG · 워드마크 · 파비콘) — _sckahn_
- `3a32c1e` feat: 중앙통제 아키텍처 — PostgreSQL 저장소 + 인증/세션/감사 — _sckahn_
- `439cc33` feat: BlockNote 기반 MESH 사내 지식 허브 구현 (폐쇄망 + 온프렘 AI) — _sckahn_
- `e09ef0f` docs: MESH/MAGNET 초기 README — _sckahn_

#### 🔮 MYSTIC (8)
- `41a240e` build(ext): 배포용 CRX(server/src/resources/ext/mystic.crx) 커밋 예외 복원 — _sckahn_
- `ac7921a` fix(ext): PoC 확장 설치를 forcelist+백엔드 update.xml 방식으로 복원 — _sckahn_
- `69b0119` ci(installer): PoC 인스톨러 Release 발행으로 업데이트(main 반영) — _sckahn_
- `af37880` ci(installer): PoC 인스톨러를 Release 자산으로 발행(아티팩트 한도 우회) — _sckahn_
- `1267ba2` ci(installer): PoC 인스톨러 Windows 빌드 워크플로 추가(디스패치 활성화) — _sckahn_
- `2c8c0cb` ci(installer): PoC 인스톨러 Windows 빌드 워크플로 추가 — _sckahn_
- `657bbfa` feat(installer): PoC 자기완결형 로컬 인스톨러(백엔드+MCP+확장 동봉) — _sckahn_
- `e7f5586` fix(ext): 챗봇 노출 조건을 활성 탭 data-label 전용으로 제한 — _sckahn_

### 2026-07-08

_8개 레포 · 커밋 35건_

#### 🎩 MAGIC (11)
- `a3e0ad2` style(ui): 다크모드 베이스를 미래에셋 군청(navy)으로 — _sckahn_
- `ea31ecd` fix(agent): 시스템 프롬프트에 연속 실행 지침 추가 — '예고 후 정지' 억제 — _sckahn_
- `a07ec5f` fix(windows): hooks 셸 명령을 Windows(cmd /C)에서도 실행 — _sckahn_
- `44c9191` fix(windows): 사이드바 macOS 신호등 여백(pt-[34px]) Windows 게이팅 — _sckahn_
- `d813caa` feat(ext): 브라우저 조정 확장(Playwright MCP) 번들 추가 — _sckahn_
- `094a2df` feat(windows): computercontroller 화면 캡처(screenshot) Windows 지원 — _sckahn_
- `04f81fa` chore(ui): 사용자 노출 goose 잔재 정리 — 문서 타이틀 MAGIC + 미사용 import 제거 — _sckahn_
- `fd7352f` fix(ui): 설정 '설정 열기' 동작 복구 + 스위치 ON 오렌지 브랜딩 — _sckahn_
- `8113139` perf(ui): 코워크 프리즈 수정 — 메시지 렌더 O(N²)→O(N) + 알림 무한증가 cap — _sckahn_
- `b248cb7` ci: MAI Suite 인스톨러를 아티팩트 대신 릴리스로 발행 (아티팩트 quota 회피) — _sckahn_
- `693c937` style(ui): 피칭덱 목업 톤 리스킨 — 미래에셋 오렌지 primary + 브랜딩 (기능 불변) — _sckahn_

#### 🌋 MAGMA (4)
- `944695d` feat: MAGMA AI Copilot — 폐쇄망 on-prem LLM 연동(코드완성·채팅·커밋메시지·MR 자동리뷰) + 클라이언트 Git 쓰기 연산 — _sckahn_
- `cdea5d6` feat: MAGMA 서버(Forgejo 기반)·클라이언트(Tauri 기반) 폐쇄망 스캐폴딩 — _sckahn_
- `f794e96` docs: MAGMA 두 축 구조 명시 — 서버(GitLab 벤치마크) + 데스크톱 클라이언트(GitKraken 벤치마크), 폐쇄망 전용 — _sckahn_
- `920a681` docs: MAGMA 초기 README — 사내 Git 호스팅·CI/CD 플랫폼 (폐쇄망 전용) — _sckahn_

#### 🧲 MAGNET (7)
- `a3587e7` ci: 원본 Rocket.Chat 워크플로·Dependabot 비활성화 (Actions 분 절약) — _sckahn_
- `bb0a0cc` feat: 제품군 채널 등록 — MAGE 중앙 등록 API (봇 + 인커밍 웹훅) — _sckahn_
- `1a04772` design: 브랜드 컬러를 미래에셋 공식 토큰(MAGE 팔레트)에 정렬 — _sckahn_
- `866b8de` feat(deploy): 사내 TLS(HTTPS) 종단 — PWA 설치형 앱 지원 — _sckahn_
- `125bbb3` fix(pwa): 설치형 웹앱(PWA) 브랜딩을 MAGNET 으로 — _sckahn_
- `cd67a47` ci: 폐쇄망 번들 릴리스 워크플로 (release-airgap) — _sckahn_
- `4c57df8` feat(deploy): 폐쇄망 반입용 단일 파일 번들 (pack-airgap) — _sckahn_

#### 📌 mai-family (4)
- `b1bf935` feat(pages): 루트를 슬라이드쇼로 — index.html = 통합덱(61슬라이드) — _sckahn_
- `24863cf` fix(decks): MAGMA 로고를 아이콘 전용으로 교체 — 워드마크·제목 중복 제거 — _sckahn_
- `273154d` feat(decks): MAGMA 덱에 공식 로고 + 아키텍처·데이터흐름·폐쇄망반입 슬라이드 추가 — _sckahn_
- `92c7968` 미래에셋 AI 패밀리 (MALife-AI) — 제품 소개 랜딩 + 발표자료 — _sckahn_

#### 🪄 MERLIN (4)
- `080fdd5` fix(core): root 패키지 com.proframe.mojo.core Export-Package 추가 — Activator 로드 실패 해결 — _sckahn_
- `a803036` chore: 로컬 빌드 산출물 디렉터리 .gitignore 등록 (dropins-out/update-site-out/build-out) — _sckahn_
- `2daae49` fix(preferences): API Key 페이지 StorageException 직접 참조 제거 — 페이지 로드 실패 해결 — _sckahn_
- `3113c70` feat(onboarding): 온보딩 첫 화면에 API Key 입력 필드 추가 — _sckahn_

#### 🕸️ MESH (3)
- `3b949ee` feat: Confluence ↔ MESH 양방향 변환기 + 임포트/익스포트 — _sckahn_
- `294578b` feat: PWA 반영 (설치형 + 앱 셸 캐싱) — _sckahn_
- `903acba` build: 폐쇄망 배포용 standalone 번들 패키징 스크립트 — _sckahn_

#### ⚙️ MOJO (1)
- `b248cb7` ci: MAI Suite 인스톨러를 아티팩트 대신 릴리스로 발행 (아티팩트 quota 회피) — _sckahn_

#### 🔮 MYSTIC (1)
- `19d87bf` fix(ext): CRX 재패키징 — data-label 전용 content.js 반영 + v1.0.1 — _sckahn_

### 2026-07-09

_9개 레포 · 커밋 52건_

#### 🎩 MAGIC (6)
- `45e7ac6` ci: build on push to main (#7) — _sckahn_
- `6fec38b` ci: build on push to main (#25) — _sckahn_
- `d9bf391` ci: use self-hosted windows runner (#6) — _sckahn_
- `0bff329` ci: run on self-hosted windows runner pool (#24) — _sckahn_
- `ab4f054` feat(i18n): MOJO 한글 기본화 및 Qwen 프롬프트·compact·help 개선 — _sckahn_
- `bbfd628` style(ui): mai-family 공식 디자인 시스템으로 톤 통일 — _sckahn_

#### 🌋 MAGMA (8)
- `e7366c5` fix(tauri): bundle nsis only (msi/WiX needs .NET3.5) (#5) — _sckahn_
- `8a1cb74` fix(tauri): add placeholder app icons (#4) — _sckahn_
- `b484301` fix(tauri): remove invalid '//' comment keys from tauri.conf.json (#3) — _sckahn_
- `235a218` docs: 명세 3종 작성 — 기능 명세서·함수 정의서·데이터 정의서 (코드 기준) — _sckahn_
- `b86d848` ci: add windows build workflow (calls MALife-AI/ci reusable) (#2) — _sckahn_
- `3375204` docs: 클라이언트 라이트/다크 스크린샷 첨부 + mai-family-design 스킬을 프로젝트 스킬로 포함 — _sckahn_
- `1550cb7` style: 주황 버튼 라벨을 브랜드 흰 글씨로 유지(--on-accent #ffffff) — _sckahn_
- `1f77abf` test: 기능별 단위테스트 71개 추가(gateway/Rust/프론트) + 클라이언트 라이트모드 도입 — _sckahn_

#### 🧲 MAGNET (8)
- `8a05524` fix(i18n): 설치 마법사 onboarding 네임스페이스 한국어 번역 83개 추가 — _sckahn_
- `4fca5f7` fix(setup-wizard): 로고 폴백을 MAGNET 워드마크로 교체 (yarn patch) — _sckahn_
- `ac35481` docs: MAGNET 신규 코드 기능·함수·데이터 명세서 3종 추가 — _sckahn_
- `617631d` docs: Dependabot 취약점 32건 트리아지 · 수용 리스크 기록 — _sckahn_
- `19c4d64` refactor: productRegistry 채널 문자열화 타입 가드로 ESLint no-base-to-string 정리 — _sckahn_
- `96a89e2` fix(deploy): MongoDB 6.0 → 8.0 (RC 8.7 은 7.0 미만을 치명적 에러로 종료) — _sckahn_
- `df1acf9` docs(design): mai-family-design 프리뷰 (라이트/다크, 자기완결 HTML) — _sckahn_
- `a19f6df` design: mai-family-design 스킬 적용 — theme-custom-css 정정 — _sckahn_

#### 📌 mai-family (7)
- `dcae3f5` ci: add MAI Suite installer (MAGIC+MOJO+MERLIN) on self-hosted windows (#1) — _sckahn_
- `e494e43` 모바일 세로 화면에서 가로 다이어그램 잘림 수정 — _Claude_
- `96d0e33` ci: GitHub Pages 정적 배포 워크플로 추가 — _Claude_
- `73f2046` 모바일 세로 화면 글씨 크기 개선 — _Claude_
- `4ece020` fix(decks): 연결 트리(성좌)에 MESH·MAGNET·MAGMA 추가 — 7→10개 최신화 — _sckahn_
- `1bbbba9` chore: re-trigger pages build — _sckahn_
- `6eff81c` feat(pages): 루트 슬라이드쇼에 좌상단 햄버거 목차 메뉴 추가 — _sckahn_

#### 📦 mai-suite (4)
- `7df8278` feat: 서버 airgap 번들 워크플로 (MAGE·MAGNET·MESH) — _Claude_
- `17d8ce9` fix(ci): self-hosted 러너 호환 — pwsh→powershell + gh PATH 전파 + Out-File utf8 — _Claude_
- `e64e7b7` ci: 자체 러너([self-hosted, windows])로 전환 + gh/NSIS 보강 — _Claude_
- `143f27c` feat: mai-suite 오케스트레이터 — 통합 인스톨러 빌드 워크플로 — _Claude_

#### 🪄 MERLIN (4)
- `2a4baf9` docs: 기능명세서/함수정의서/데이터정의서 작성 (v0.1.8 기준) — _sckahn_
- `76ff1bf` feat(ui): 개발편의 기능 묶음 — 단축키/우클릭/멀티라인/Stop/@symbol — _sckahn_
- `85ea8af` feat(ui): '@' 파일명 자동완성 (JFace ContentProposalAdapter) — _sckahn_
- `e7cf177` feat(ui): ChatView 브랜드 톤 적용 (미래에셋 네이비/주황) — _sckahn_

#### 🕸️ MESH (6)
- `89186ca` docs: 기능 명세서·함수 정의서·데이터 정의서 추가 — _sckahn_
- `05524ad` fix: docx 라이브러리 번들 포함 + start.sh 바인딩 수정 — _sckahn_
- `d7a6294` feat: Word(.docx) 양방향 지원 — 수동 Confluence 파일 교환 완성 — _sckahn_
- `0f36f55` fix: RBAC·Confluence 적대적 리뷰 반영(보안 하드닝) — _sckahn_
- `f37fe1c` feat: RBAC — 공개/부서/개인 가시성 접근 통제 — _sckahn_
- `eec2f57` feat: Confluence REST API 실시간 양방향 동기화 (on-prem) — _sckahn_

#### ⚙️ MOJO (3)
- `45e7ac6` ci: build on push to main (#7) — _sckahn_
- `d9bf391` ci: use self-hosted windows runner (#6) — _sckahn_
- `ab4f054` feat(i18n): MOJO 한글 기본화 및 Qwen 프롬프트·compact·help 개선 — _sckahn_

#### 🔮 MYSTIC (6)
- `5d01fb6` ci: build on push to main (#4) — _sckahn_
- `95e0b1a` docs: 기능 명세서·함수 정의서·데이터 정의서 추가 — _sckahn_
- `9b195bc` ci(installer): 셀프 호스트 Windows 러너 워크플로 main 등록(디스패치 활성화) — _sckahn_
- `4698dd4` ci(installer): 셀프 호스트 Windows 러너용 PoC 빌드 워크플로 추가 — _sckahn_
- `b67059a` ci: use self-hosted windows runner (#3) — _sckahn_
- `04d5d31` fix(llm): LLM_BASE_URL 호스트 누락 시 명확히 안내 + 인스톨러 입력 검증 — _sckahn_

### 2026-07-10

_12개 레포 · 커밋 70건_

#### 🧙 MAGE (1)
- `c857d4df` ci: Project #9 자동 추가 워크플로 (#14) — _sckahn_

#### 🎩 MAGIC (9)
- `66e1e74` chore(providers): 알리바바 LLM 프리셋 3종 + Alibaba ModelStudio UI 제거 — _sckahn_
- `dccb8c4` ci: Project #9 자동 추가 워크플로 (#9) — _sckahn_
- `edc893b` ci: Project #9 자동 추가 워크플로 (#27) — _sckahn_
- `31faea6` chore(providers): 외부 LLM 프리셋 7종 + third-party 선택 UI 제거 — _sckahn_
- `aeef3bb` chore(channels): 내장 플랫폼 채널 5종 제거 (telegram/weixin/dingtalk/feishu/qqbot) — _sckahn_
- `70773f4` chore(i18n): settings.schema.json 재생성 — language 기본값 ko 반영 — _sckahn_
- `36c313f` test: 리브랜딩(Qwen Code→MOJO) 이후 스테일 테스트 기대값 정합화 + docs URL 버그 수정 — _sckahn_
- `f8350ed` fix(security): npm audit fix로 의존성 취약점 비파괴 수정 — _sckahn_
- `69a6bf5` docs: 한글화 기능 명세서·함수 정의서·데이터 정의서 추가 — _sckahn_

#### 🌋 MAGMA (8)
- `03bb3a0` docs(ai-gateway): MAGE 두-방언(Anthropic 챗 / OpenAI FIM) 구성 반영 — _sckahn_
- `aac168e` feat(ai-gateway): 채팅/커밋/리뷰를 Anthropic Messages 로 전환 (FIM 은 OpenAI 유지) — _sckahn_
- `1bf0f2a` ci: Project #9 자동 추가 워크플로 (#6) — _sckahn_
- `29eafcb` docs: 정의서에 워크스페이스 선택·데스크톱 클라이언트 반영 — _sckahn_
- `476c5ea` ci(forgejo): nsis-only 로 정렬 — msi 제외(tauri.conf.json bundle.targets=[nsis] 일치) — _sckahn_
- `12e035c` ci: Windows 데스크톱 빌드 워크플로 + per-user 설치 — _sckahn_
- `896ef7a` ci: 폐쇄망 Forgejo Actions 워크플로 — Windows .exe/.msi 빌드 + PR 테스트 — _sckahn_
- `06cd738` feat: 첫 실행 워크스페이스 선택 화면 — 저장소 열기/클론/초기화 (네이티브 폴더 선택) — _sckahn_

#### 🧲 MAGNET (7)
- `b13c4b5` ci: Project #9 자동 추가 워크플로 (#7) — _sckahn_
- `c2ea2da` docs: 정의서에 폐쇄망 셋업 위저드 관리자 등록 반영 — _sckahn_
- `584486f` feat(setup-wizard): 폐쇄망 단일 화면 관리자 설치(이메일 없이 아이디 로그인) — _sckahn_
- `cbe7cc7` docs: 정의서에 Tauri 데스크톱 래퍼 반영 — _sckahn_
- `b184f66` ci(desktop): 아티팩트 업로드 실패가 잡을 중단시키지 않도록 continue-on-error — _sckahn_
- `b708ca4` ci(desktop): Windows 빌드를 사내 self-hosted 러너 풀로 실행 — _sckahn_
- `8c4e23a` feat(desktop): MAGNET Tauri 데스크톱 클라이언트 + Windows 빌드 워크플로 추가 — _sckahn_

#### 📌 mai-family (1)
- `9560ccc` docs(deck): 통합 피치덱 신규 기능 카드 반영 — _sckahn_

#### 📦 mai-suite (6)
- `d7cab51` chore(installer): 수트 아이콘(마법사 엠블럼) + 설치 문구 정돈 + FIM 타겟 정정 — _sckahn_
- `7d4297c` feat(suite): 서버 통합 번들 + 클라이언트 공용 서버주소 배선 — _sckahn_
- `ce3ce60` ci: Project #9 자동 추가 워크플로 (#3) — _sckahn_
- `d9a3ecd` feat: MYSTIC 기본 번들 활성화 (mystic-v0.2.0) — _sckahn_
- `a680acd` feat: MYSTIC·MAGNET·MAGMA 컴포넌트 번들 추가 + NSI 자가소유 — _sckahn_
- `a9ef2d0` feat(suite): fresh main 빌드 + MESH 데스크톱·서버 번들 추가 (#1) — _sckahn_

#### 💧 MANA (1)
- `a839a54` ci: Project #9 자동 추가 워크플로 (#4) — _sckahn_

#### 📊 MARK (1)
- `d9c96b1` ci: Project #9 자동 추가 워크플로 (#2) — _sckahn_

#### 🪄 MERLIN (2)
- `8ac1ba7` ci: Project #9 자동 추가 워크플로 (#3) — _sckahn_
- `8d2ae74` ci: dropins 빌드를 Windows self-hosted + rolling 릴리스로 (#2) — _sckahn_

#### 🕸️ MESH (17)
- `c475572` ci: Project #9 자동 추가 워크플로 (#2) — _sckahn_
- `44a6110` feat(desktop): 저장된 서버 주소 자동 접속 — _sckahn_
- `c5fb1f0` feat(deploy): 서버 컨테이너화 + 통합 compose(MAGE mai-net 연동) — _sckahn_
- `1f48a6e` feat(ai): Anthropic Messages API provider 추가 (가족 표준) — _sckahn_
- `b7bb835` docs: 정의서에 한글(HWP/HWPX) 문서 변환 반영 — _sckahn_
- `82bcde7` fix(desktop): Tauri 런처 화면에도 Pretendard 폰트 적용 — _sckahn_
- `0b2e91e` fix(ui): Pretendard 폰트 번들 + 문서 본문·제목 정렬/여백 정리 — _sckahn_
- `4f320d8` feat: 문서 포맷 확장 Phase 3 — 한글(HWP/HWPX) 읽기+쓰기 — _sckahn_
- `7198ad4` feat: 문서 포맷 확장 Phase 2 — 인라인 코드 셀(CodeMirror) + HTML 미리보기 — _sckahn_
- `3be6473` feat: 문서 포맷 확장 Phase 1 — md·xlsx·pptx·pdf 가져오기/내보내기 — _sckahn_
- `afd8c43` ci: 빌드 후 오래된 TEMP 정리(러너 디스크 회수) — _sckahn_
- `18aa482` ci: 데스크톱 빌드를 Windows 러너로 고정 — _sckahn_
- `8e79004` ci: 서버 tar·데스크톱 설치물을 rolling 릴리스로 발행 (#1) — _sckahn_
- `e2ba849` ci: 서버 tar·데스크톱 설치물을 rolling 릴리스로 발행 — _sckahn_
- `603e67a` ci: 아티팩트를 GitHub 업로드 대신 러너 로컬로 반출 — _sckahn_
- `570f1e8` ci: self-hosted 러너 빌드 워크플로우 추가 — _sckahn_
- `b8fd51b` feat: Tauri 데스크톱 씬 클라이언트 추가 — _sckahn_

#### ⚙️ MOJO (8)
- `66e1e74` chore(providers): 알리바바 LLM 프리셋 3종 + Alibaba ModelStudio UI 제거 — _sckahn_
- `dccb8c4` ci: Project #9 자동 추가 워크플로 (#9) — _sckahn_
- `31faea6` chore(providers): 외부 LLM 프리셋 7종 + third-party 선택 UI 제거 — _sckahn_
- `aeef3bb` chore(channels): 내장 플랫폼 채널 5종 제거 (telegram/weixin/dingtalk/feishu/qqbot) — _sckahn_
- `70773f4` chore(i18n): settings.schema.json 재생성 — language 기본값 ko 반영 — _sckahn_
- `36c313f` test: 리브랜딩(Qwen Code→MOJO) 이후 스테일 테스트 기대값 정합화 + docs URL 버그 수정 — _sckahn_
- `f8350ed` fix(security): npm audit fix로 의존성 취약점 비파괴 수정 — _sckahn_
- `69a6bf5` docs: 한글화 기능 명세서·함수 정의서·데이터 정의서 추가 — _sckahn_

#### 🔮 MYSTIC (9)
- `36ceeb3` ci: Project #9 자동 추가 워크플로 (#6) — _sckahn_
- `53d4129` docs: 정의서에 MCP 진단 유틸·설치 검증 반영 — _sckahn_
- `193b55c` ci(installer): 러너 디스크 고갈 방지 — 아티팩트 스텝 제거·임시물 정리 — _sckahn_
- `65f58c7` debug(mcp): MCP 원본 응답·사용 datasource_id 로깅 추가(PoC 진단) — _sckahn_
- `8e2d41c` fix(installer): TABLEAU_SERVER_URL·PAT_NAME·PAT_SECRET 필수 검증 추가 — _sckahn_
- `2cb6dc4` fix(mcp): TaskGroup ExceptionGroup 언래핑 — MCP 실제 실패 원인 노출 — _sckahn_
- `a008fe5` ci(installer): 릴리스 발행을 REST API 직접 업로드로 전환(gh CLI 불필요) — _sckahn_
- `18d7e11` ci(installer): 셀프호스트 run 블록 ASCII 전용화 — PS 5.1 CP949 한글 깨짐 방지 — _sckahn_
- `cbe7204` ci(installer): 셀프호스트 러너 호환 — pwsh→powershell(5.1)·TLS1.2·포터블 npm — _sckahn_

### 2026-07-11

_4개 레포 · 커밋 35건_

#### 🧙 MAGE (16)
- `0ac84251` feat(observability): 테넌트별 부하/동시성 대시보드 + 알람 (#30) — _sckahn_
- `5959b332` feat(model-hub): 공유 스토어 → 서빙 pod /models 자동 마운트 배선 (#29) — _sckahn_
- `50cc8942` feat(model-hub): 공유 가중치 스토어(NFS/MinIO) 매니페스트 (#28) — _sckahn_
- `e0e70a90` feat(slices): vLLM 설정 테넌트 편집 폼 + 재기동 (#27) — _sckahn_
- `33c3a177` feat(slices): NPU(RBLN) vLLM 템플릿 + DevBox 영속작업공간/SSH 배선 (#26) — _sckahn_
- `b124773f` feat(model-hub): 모델 종류/양자화 메타 + 테넌트 가동가능성 표시 (#25) — _sckahn_
- `9d6f2bc6` feat(observability): DCGM exporter 배포 + 포탈 LLM 지표 강화 (#24) — _sckahn_
- `f4e35230` feat(slice): 테넌트 격리(NetworkPolicy) + 이종 GPU/NPU nodeSelector (#23) — _sckahn_
- `07c610a6` feat(slice): vLLM 설정 편집+재기동 API (테넌트 속성) (#21) — _sckahn_
- `0e542f6a` feat(infra): 사내 레지스트리(Harbor) + 테넌트 이미지 카탈로그 + DevBox (#19) — _sckahn_
- `5786c6ed` feat(infra): NPU(리벨리온 RBLN) 워커 노드 추가 번들 (#22) — _sckahn_
- `37c9bf19` feat(infra): GPU 워커 노드 추가 번들 (k3s agent join) (#20) — _sckahn_
- `7ca54278` fix(ci): frontend prepare 훅 제거 + 대형 이미지는 러너 로컬(깃헙 미업로드) (#18) — _sckahn_
- `e9b7fa76` fix(ci): freeze 에 --emit-index-url — backend torch cu129 설치 가능 (#17) — _sckahn_
- `7206bfdd` ci: 단일노드 compose 트랙 airgap 번들 발행 (#16) — _sckahn_
- `f411cdf5` feat(infra): 단일노드 통합 compose 트랙 + nginx 패밀리 라우팅 (#15) — _sckahn_

#### 🌋 MAGMA (4)
- `a5b2331` ci: 서버 airgap 이미지 번들 발행 워크플로 (#8) — _sckahn_
- `c5b9068` ci: airgap 빌드를 self-hosted Linux(WSL) 러너로 고정 — _sckahn_
- `c72b5b5` ci: 서버 airgap 이미지 번들 발행 워크플로 추가 — _sckahn_
- `0fdaa0f` feat(ai-gateway): 채팅/커밋/리뷰 Anthropic Messages 전환 (FIM 은 OpenAI 유지) (#7) — _sckahn_

#### 📦 mai-suite (3)
- `e8bd8a1` feat(ci): 서버 번들 분할반입 — 얇은 오케스트레이션 + 제품별 개별 airgap — _sckahn_
- `8e842e7` feat(ci): 서버 번들 ③ — 실물 airgap tar 를 products/ 로 추출·조립 — _sckahn_
- `e661cb1` feat(ci): 서버 번들에 원클릭 오케스트레이션 레이어 취합 — _sckahn_

#### 🕸️ MESH (12)
- `527a813` fix(ci): 데스크톱 빌드 CARGO_HOME 을 짧은 경로로 (롱패스 근본해결) (#8) — _sckahn_
- `9bb0a86` fix(ci): 데스크톱 빌드 CARGO_HOME 을 짧은 경로로 (롱패스 근본해결) — _sckahn_
- `aa3ceb7` fix(ci): cargo NUL 오염 crate 를 src+cache 양쪽에서 제거 (#7) — _sckahn_
- `e676386` fix(ci): cargo NUL 오염 crate 를 src+cache 양쪽에서 제거 — _sckahn_
- `1ef2456` fix(ci): cargo 정리 스텝 shell 을 powershell 로 (러너에 pwsh 없음) (#6) — _sckahn_
- `6265fb1` fix(ci): cargo 정리 스텝 shell 을 powershell 로 (러너에 pwsh 없음) — _sckahn_
- `9376ae0` fix(ci): 데스크톱 빌드 cargo 레지스트리 NUL 손상 자가복구 (#5) — _sckahn_
- `9aba8e7` ci: 서버 도커 이미지 airgap 발행 워크플로 (#4) — _sckahn_
- `089478e` ci: 이미지 airgap 빌드를 self-hosted Linux(WSL) 러너로 — _sckahn_
- `688f4b2` fix(ci): 데스크톱 빌드 cargo 레지스트리 NUL 손상 자가복구 — _sckahn_
- `3d6c914` ci: 서버 도커 이미지 airgap 발행 워크플로 추가 — _sckahn_
- `3b69972` feat: 서버 컨테이너화 + Anthropic provider + 데스크톱 자동접속 (#3) — _sckahn_

### 2026-07-12

_1개 레포 · 커밋 3건_

#### 🧙 MAGE (3)
- `b6f0b3b8` feat(observability): Kueue GPU 스케줄링/공정분배 대시보드 + 알람 (#34) — _sckahn_
- `96314c76` feat(scheduling): Kueue GPU 공정분배 + 오토스케일 on/off 토글 (#33) — _sckahn_
- `b616a04c` feat(autoscale): 큐 기반 무중단 오토스케일 (KEDA + graceful drain) (#31) — _sckahn_

### 2026-07-13

_1개 레포 · 커밋 1건_

#### 🧙 MAGE (1)
- `49d07563` feat(settings): Serving Settings 구조화 폼 (오토스케일·Kueue·모델스토어 토글) (#35) — _sckahn_

### 2026-07-14

_11개 레포 · 커밋 35건_

#### 🧙 MAGE (3)
- `4d3b7f7b` fix(ci): .gitattributes 추가 — 셸 스크립트 LF 강제(bash \r 방지) (#38) — _sckahn_
- `35d68b19` docs: AI 패밀리 통합 플랜 + 지도(FAMILY_MAP) + 계약(FAMILY_CONTRACT) (#36) — _sckahn_
- `5f530b9c` feat(audit): 외부 제품 AI 감사 인제스트 엔드포인트 POST /api/v1/audit/events (#37) — _sckahn_

#### 🎩 MAGIC (4)
- `9c14cf4` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#11) — _sckahn_
- `5036d86` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#30) — _sckahn_
- `9dd90a2` feat: X-MAI 헤더·MAGE 감사 싱크 + 차단신호 존중 훅 (#12) — _sckahn_
- `13e11d5` feat: X-MAI 헤더·MAGE 중앙 감사 emit 배선(Goose) (#31) — _sckahn_

#### 🌋 MAGMA (3)
- `1170565` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#9) — _sckahn_
- `1c0f614` feat(ai-gateway): X-MAI 헤더·MAGE 중앙 감사 emit 배선 (#11) — _sckahn_
- `0a8644e` fix(ci): 데스크톱 빌드 Windows 러너 고정 + CARGO_HOME 짧은경로 (#10) — _sckahn_

#### 🧲 MAGNET (2)
- `743d4c5` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#8) — _sckahn_
- `1147d12` feat(magnet-ai): X-MAI 헤더·MAGE 중앙 감사 emit 배선 (#9) — _sckahn_

#### 📦 mai-suite (9)
- `746e4bc` fix(ci): 서버 번들 빌드를 Linux 러너로 이동 — deploy.sh CRLF(\r) 근절 (#8) — _sckahn_
- `94b3cdd` fix(ci): 서버 번들 빌드를 Linux 러너로 이동 — deploy.sh CRLF(\r) 근절 — _sckahn_
- `d6cb6da` feat(ci): 서버 풀번들 러너 로컬 조립(fetch-products + 제품 airgap, 릴리스 미발행) — _sckahn_
- `392c562` chore: 임시 진단 워크플로 제거 — _sckahn_
- `e168fe1` chore: 임시 러너 디스크 진단(풀번들 확인) — _sckahn_
- `3fcf957` feat(suite): 서버 통합 번들(split-import) + 클라 인스톨러 구성 확정 (#7) — _sckahn_
- `f08dd07` fix(ci): MAGNET 태그를 실존 릴리스 desktop-v0.1.0 로 (magnet-desktop-main-latest 부재) — _sckahn_
- `2bee152` fix(ci): MESH 스텝도 선택 처리 — fresh 빌드 실패해도 suite 계속(MERLIN 과 동일) — _sckahn_
- `4495dc9` feat(installer): MERLIN 옵션화 + MAGMA 기본 + Git for Windows(git bash) 번들 — _sckahn_

#### 💧 MANA (2)
- `c456d84` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#5) — _sckahn_
- `5d8294c` fix: 자산 수량 단일소스화 + 스킬 매니페스트 공급망 필드 (#6) — _sckahn_

#### 📊 MARK (2)
- `3c3e991` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#3) — _sckahn_
- `de18d01` feat: 호출자 컨텍스트 수용 + best-effort AI 감사 emit (#4) — _sckahn_

#### 🪄 MERLIN (2)
- `ab37b09` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#4) — _sckahn_
- `9581b5e` feat: X-MAI 컨텍스트 전달·MAGE 감사 emit(JDK1.6 호환) (#5) — _sckahn_

#### 🕸️ MESH (2)
- `78bde5a` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#9) — _sckahn_
- `edbbb0a` feat: AI 패밀리 통합 배선(X-MAI·감사 emit) + ai 감사 버그 수정 (#10) — _sckahn_

#### ⚙️ MOJO (2)
- `9c14cf4` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#11) — _sckahn_
- `9dd90a2` feat: X-MAI 헤더·MAGE 감사 싱크 + 차단신호 존중 훅 (#12) — _sckahn_

#### 🔮 MYSTIC (4)
- `c3112b8` fix(ci): PoC(Windows) 워크플로 self-hosted 전환 (#9) — _sckahn_
- `8133413` docs: AI 패밀리 통합 플랜(AD/SSO·감사증적·특화 포함) (#7) — _sckahn_
- `7bf2115` feat: X-MAI 헤더·MAGE 감사 emit + print→logging (#8) — _sckahn_
- `47c1575` feat(ext): PAT Name 설정·데이터소스 자동 스코핑·설치 버전 단일소스화 — _sckahn_

### 2026-07-15

_3개 레포 · 커밋 22건_

#### 🧙 MAGE (5)
- `6c5222f2` fix(ci): compose-airgap 아티팩트 업로드 quota 실패 무해화 (continue-on-error) (#43) — _sckahn_
- `4e277a24` feat(front): 프론트 공개 포트 기본 8880 → 8000 (사용자 지정) (#42) — _sckahn_
- `0090b0c6` feat(front): MAGE 프론트 공개 포트 80 → 8880 (기본값, HTTP_PORT 로 override) (#41) — _sckahn_
- `d77d172c` feat(slice): 포트 대역 규약 코드화 — 종류(task)별 서비스 포트 배치 (고립분 ③ 정합) (#40) — _sckahn_
- `720f7d63` docs(specs): MAGE 시스템 정의서 5종 main 반영 (기존 security/finding-fixes 고립분 백포트) (#39) — _sckahn_

#### 📦 mai-suite (14)
- `1575321` fix(ci): 러너 청소 win 잡 라벨 매칭 수정 — 이름 라벨 불가 → 병렬 3잡 분산 (#15) — _sckahn_
- `41b1bfe` fix(ci): 러너 청소 win 잡 라벨 매칭 수정 — 이름 라벨 불가 → 병렬 3잡 분산 — _sckahn_
- `320d4be` ci: 러너 청소 워크플로 (win-r1·r2·r3 + wsl-ubuntu) (#14) — _sckahn_
- `0d23a4c` ci: 러너 청소 워크플로 (win-r1·r2·r3 + wsl-ubuntu) — _sckahn_
- `ff19413` fix(ci): 풀번들 자립 팩 리소스 완화 — WSL 러너 사망 방지 (#13) — _sckahn_
- `3ca7e06` fix(ci): 풀번들 자립 팩 리소스 완화 — WSL 러너 사망 방지 — _sckahn_
- `2dc1455` fix(ci): 풀번들 자립 팩 — MAGE freeze 스텝 이식 (gitignore requirements 생성) (#12) — _sckahn_
- `9fb0aa9` fix(ci): 풀번들 자립 팩 — MAGE freeze 스텝 이식 (gitignore requirements 생성) — _sckahn_
- `e8c3f31` feat(servers): 자립 이미지 팩 + 클린 재설치 (#11) — _sckahn_
- `8a162c0` feat(servers): 자립 이미지 팩 + 클린 재설치 — _sckahn_
- `0b1e921` docs(servers): MAGE 프론트도어 포트 8000 (MAGE#42 정합) (#10) — _sckahn_
- `23f34a5` docs(servers): MAGE 프론트도어 포트 8000 (MAGE#42 정합) — _sckahn_
- `a220b6b` docs(servers): MAGE 프론트도어 포트 8880 노출 (.env HTTP_PORT) (#9) — _sckahn_
- `b4f39dd` docs(servers): MAGE 프론트도어 포트 8880 노출 (.env HTTP_PORT) — _sckahn_

#### 🔮 MYSTIC (3)
- `2fcb81d` feat(config): 팝업에서 백엔드 .env 편집 (GET/POST /config) — v1.0.3 — _sckahn_
- `1e5c85e` fix(poc): 강제설치 채널 CRX/버전 갱신 — PoC 가 1.0.1 로 남던 버그 — _sckahn_
- `2f3c82e` feat(server): 뷰 LUID 제한을 기본 ON(fail-closed) — RESTRICT_TO_VIEW 플래그 — _sckahn_

### 2026-07-20

_3개 레포 · 커밋 19건_

#### 🧙 MAGE (3)
- `8ac3051f` feat(baremetal): 고립분 백포트 ⑤+③잔여 — service 테넌트·NIC/zone 망격리·모니터링/설정 UI (#46) — _sckahn_
- `b6dda84d` feat(deploy): 고립분 백포트 ④ — 무중단 배포 (롤아웃 API·graceful·원자 스왑) (#45) — _sckahn_
- `da7b26df` fix(security): 고립분 백포트 ② — 보안 4건 + 기술부채 + 잔여위험 등록부 (#44) — _sckahn_

#### 📦 mai-suite (7)
- `9003742` fix(ci): 풀번들 자립팩 — vLLM/LiteLLM 이미지 영속 캐시(WSL 사망 완화) (#19) — _sckahn_
- `daaf4eb` fix(ci): 풀번들 자립팩 — vLLM/LiteLLM 이미지 영속 캐시(WSL 사망 완화) — _sckahn_
- `310fffd` fix(ci): split-bundle 폴더 입력 지원 + 진단 ls (#18) — _sckahn_
- `ae07e36` fix(ci): split-bundle 폴더 입력 지원 + 진단 ls — _sckahn_
- `61e61c1` fix(ci): split-bundle 폴더 입력 지원 + 진단 ls — _sckahn_
- `68a4838` feat(servers): 반입용 2GB 분할 — split-bundle.yml + 풀번들 자동 분할 (#16) — _sckahn_
- `9382c79` feat(servers): 반입용 2GB 분할 — split-bundle.yml + 풀번들 자동 분할 — _sckahn_

#### 🔮 MYSTIC (9)
- `db3901e` fix(prompt): VDS 쿼리 생성 강화 — 없는 필드 금지·필터 SET 전용 — _sckahn_
- `6ec8e12` feat(auto-resolve): 임베드→같은 이름 게시 원본 폴백 — _sckahn_
- `c6a2ce3` fix(build): click 8.1.7 고정 + collect_all(click) + pyinstaller --clean — _sckahn_
- `2cd0ec6` fix(build): click 서브모듈 번들 — 'No module named click.termui' 크래시 해결 — _sckahn_
- `f44e659` feat(auto-resolve): 뷰(워크북)→게시 데이터소스 LUID REST 자동 역조회 — _sckahn_
- `8668cc9` debug(llm): 실제 전송 모델명 로깅 — build_llm_client(env값) + _create(전송값) — _sckahn_
- `6cd3ee9` fix(ext-update): /ext CRX·update.xml no-cache + 버전별 CRX URL — 업데이트 멈춤 방지 — _sckahn_
- `eaf0e14` fix(ext): 임베드된 Tableau(iframe/tableau-viz) 뷰 감지 — v1.0.5 — _sckahn_
- `f9fb8fe` feat(access): 뷰→데이터소스 매핑(조회권한 화이트리스트) — v1.0.4 — _sckahn_

### 2026-07-21

_4개 레포 · 커밋 32건_

#### 🧙 MAGE (3)
- `605c8404` ci(airgap): hosted(ubuntu-latest) 기본 + /mnt 디스크 우회 (WSL 사망 회피) — _sckahn_
- `8e8c3af6` fix(airgap): 존재하지 않는 projecthami/hami-scheduler 이미지 제거 (#48) — _sckahn_
- `1523f7fe` ci: release-airgap self-hosted 전환 + freeze/디스크 정합 (k3s airgap 번들 빌드) (#47) — _sckahn_

#### 📌 mai-family (15)
- `6f0dec9` feat: 핵심 3종 전용 상세 슬라이드 추가 (원본 이상으로 상세) — _sckahn_
- `432750f` content: 도입 순서 슬라이드 제거 + 로드맵 순서/부서 정비 — _sckahn_
- `2ed40e4` style: 커버 마지막 줄 '이제 그 AI라는 마법을 공개합니다'로 변경 — _sckahn_
- `a34b413` feat: 실제 화면 슬라이드 추가 + 배포 계획(원본 참고) + 커버 문구 — _sckahn_
- `4a12910` style: 커버 문구 자연화 — 억지 접속 제거, 짧은 문장 3개로 분리 — _sckahn_
- `0895e26` style: 커버 문구 정리 + 보조 슬라이드 2×2 + 배경 스파클 상시화 — _sckahn_
- `799ab54` style: 어투 자연화 + 마법 보라태그 제거 + 카드 기능 줄바꿈/흰색 — _sckahn_
- `33b739b` fix: 슬라이드쇼 스크롤 제거 + 3번 이후 카드 설명 개조식화 — _sckahn_
- `f30dd49` fix: 슬라이드 스크롤바 숨김 + 세 법칙 간격 조정 — _sckahn_
- `0a810ed` style: 원본 디자인 시스템 이식 + 세 법칙 오프닝 — _sckahn_
- `05193a5` feat: 원본 덱 트랜지션 이식 + 로드맵 구체화 — _sckahn_
- `92a6bb7` style: 커버 카피를 절제된 톤으로 교체 — _sckahn_
- `bfb340e` refactor: 실행 브리프 커버를 기술×마법(클라크 제3법칙)으로 복원 + 제품 소개 강화 — _sckahn_
- `6310b6b` feat: 실행 브리프 슬라이드 추가 (core-roadmap.html) — _sckahn_
- `427044f` docs: 제품 설명 쉬운 표현으로 다듬고 카드 UI 정렬 통일 — _sckahn_

#### 📦 mai-suite (5)
- `3f90900` fix(ci): HF 다운로드 hf CLI 전환 (huggingface-cli 폐기) (#22) — _sckahn_
- `b10a877` fix(ci): HF 다운로드 hf CLI 전환 (huggingface-cli 폐기) — _sckahn_
- `378b912` fix(ci): HF 다운로드 — huggingface-cli 폐기 → hf CLI + hf_xet — _sckahn_
- `dc5b360` feat(ci): HF 모델 다운로드 + 1.9GB 분할 워크플로 (airgap 반입) (#20) — _sckahn_
- `ad7ff8a` feat(ci): HF 모델 다운로드 + 1.9GB 분할 워크플로 (airgap 반입) — _sckahn_

#### 🔮 MYSTIC (9)
- `db12178` fix(toggle): 📷 ON = /chat + 현재화면(MCP·지식 동시), OFF = /chat(MCP만) — v1.0.8 — _sckahn_
- `778fcbf` fix(view-data): 406 해결 — Accept text/csv 강제 제거(*/*) — _sckahn_
- `150a583` feat(knowledge): 데이터소스 지식 두껍게 — 컬럼+총계(원값)+차원별 집계 — _sckahn_
- `1cae593` fix(knowledge): 데이터소스 개요를 항상 확보 + 뷰데이터 상태 로깅 — _sckahn_
- `0e2b3b5` feat(knowledge): 뷰 데이터 텍스트 지식구축 + 📷 토글 + 지식 기반 챗 — v1.0.7 — _sckahn_
- `c4f66c6` fix(dashboard): map-reduce 로 전환 — 'request too large' 해결 — _sckahn_
- `4858b45` feat(dashboard): 멀티모달 대시보드 분석(모든 시트 렌더+데이터 종합) — v1.0.6 — _sckahn_
- `ce126e9` feat(installer): 재설치 시 기존 버전 자동 제거(.onInit) — 확장 clean 갱신 — _sckahn_
- `2947930` feat(query): 컬럼 스키마 강제 정제 + 에이전틱 쿼리 재시도 루프 — _sckahn_

### 2026-07-22

_3개 레포 · 커밋 27건_

#### 🧙 MAGE (1)
- `a1cc85ff` ci(airgap): vLLM 이미지 번들 제외 (hosted 디스크 회피 · 타깃서 별도 import) — _sckahn_

#### 📌 mai-family (23)
- `f41deec` content: 핵심 3종 상세 기능을 직관 키워드로 재작성(비유 제거) — _sckahn_
- `234f7f1` style: 기능 주황 강조를 슬라이드당 2개로 축소(줄마다 → 핵심만) — _sckahn_
- `01373f2` chore: PDF 재생성 — 오프닝 슬라이드·주황 볼드·업무망 PC 반영(토글 숨김) — _sckahn_
- `165f1ce` feat: '그래서, 언제 됩니까?' 오프닝 슬라이드 + 다크모드 토글 + 기능 주요점 주황 볼드 — _sckahn_
- `e281f0f` content: 푸터 'AI혁신 & 빅데이터운용본부' → 'AI혁신팀' 전체 변경 — _sckahn_
- `035ceb3` fix: 핵심 상세 슬라이드 기능 문장 압축 — 2열에서 행바꿈 제거(한 줄 정렬) — _sckahn_
- `e9a2b29` layout: 전 슬라이드 텍스트 확대·여백 채움 + 배포계획 2열 전체폭 수정 — _sckahn_
- `039db95` style: 모든 도형 그림자(회색 딤) 제거 — 플랫+테두리만, PDF 재생성 — _sckahn_
- `bb61002` chore: PDF 재생성 — 다단 레이아웃 강제(2열 병렬·3열)·로드맵 뱃지 통합·사진 딤 제거 반영 — _sckahn_
- `55211b5` layout: 로드맵 단계뱃지 상단 통합·카드 텍스트 확대, 상세 기능 2열 병렬, 사진 딤 제거 — _sckahn_
- `2987d7e` chore: BI 로고·구분선 반영 PDF 재생성 — _sckahn_
- `adb647d` design: BI 세부요소 추가 — 로고 이미지(PDF 추출) + 헤딩 구분선 — _sckahn_
- `47e5e83` chore: BI 리스킨 반영 — 코퍼레이트 PDF 재생성, 구 다크/라이트 PDF 정리 — _sckahn_
- `b4bc0ac` design: 미래에셋생명 BI 톤으로 전면 리스킨 (light corporate) — _sckahn_
- `ec7546c` feat: 라이트 테마 PDF 추가 + 다운로드 페이지에 다크/라이트 선택 — _sckahn_
- `26fd6f4` feat: 발표자료 다운로드 페이지 + PDF 호스팅 — _sckahn_
- `71b50bb` style: 커버 플레인 제거 + MAGE 2컬럼 문구 간결화 + 시인성/요약 문체 개선 — _sckahn_
- `f450b5a` feat: 동적 반응형 풀블리드 + 콘텐츠 auto-fit (모든 화면 잘림·스크롤·여백 없음) — _sckahn_
- `d7d6b7d` fix: 피치덱 — 스크롤 제거, 16:9 화면맞춤(잘림·스크롤 없음) + 대비 유지 — _sckahn_
- `3890209` style: 좌우 레터박스 제거(가로 100vw·16:9 유지) + 글씨 대비 강화 — _sckahn_
- `2eb37cc` feat: 업계 현황·차별점 비교 슬라이드 추가 (내재화 우위 근거) — _sckahn_
- `add7895` style: Why-Now 슬라이드에서 NEXT 바(및 MAGE 언급) 제거 — _sckahn_
- `7b18ce9` feat: '왜 사내 폐쇄망 AI인가' 전략 슬라이드 추가 — _sckahn_

#### 🔮 MYSTIC (3)
- `deee830` fix(ci): 러너 디스크 정리 강화(TEMP·npm/pip/pyinstaller 캐시) + 여유공간 경고 — _sckahn_
- `fd1237e` fix(ci): 셀프호스티드 빌드 전 디스크 정리 — makensis "can't write bytes" 해결 — _sckahn_
- `c9f2cd7` feat(toolcall): 에이전틱 툴콜링(LLM이 run_query 직접 호출) + 파이프라인 폴백 — _sckahn_

### 2026-07-23

_1개 레포 · 커밋 2건_

#### 🔮 MYSTIC (2)
- `18748f5` ci: 디스크 1GB 미만이면 조기 실패(명확한 메시지) — _sckahn_
- `623dc7d` feat(chat): 화면잘림 보정 + 멀티턴 메모리 + 쿼리 로깅 — v1.0.9 — _sckahn_

### 2026-07-24

_3개 레포 · 커밋 17건_

#### 🧙 MAGE (4)
- `b045ac47` fix(airgap): v0.2.1 — data-dir/models-dir 옵션 + grafana 사이드카 비활성 + vLLM 분리 — _sckahn_
- `5c0aa73b` fix(airgap): KPS admission webhook 비활성화 — certgen 이미지 부재로 훅 timeout — _sckahn_
- `ad77d18c` ci(upload-vllm): 릴리스에 add-vllm.sh 동봉 (checkout 추가) — _sckahn_
- `702a7023` feat(airgap): vLLM 나중에-추가 스크립트(add-vllm.sh) + 분할본 업로드 워크플로 — _sckahn_

#### 📦 mai-suite (8)
- `cdf1c61` ci: 번들 정리(WSL 공간 확보) + VHDX 압축 안내 워크플로 (#26) — _sckahn_
- `8bcfe85` ci: 번들 정리(WSL 공간 확보) + VHDX 압축 안내 워크플로 — _sckahn_
- `bfd8c9f` feat(ci): 러너의 mai-family-servers-full 에서 vLLM 추출+1.9GB 분할 (#25) — _sckahn_
- `256da80` feat(ci): 러너의 mai-family-servers-full 에서 vLLM 추출+1.9GB 분할 — _sckahn_
- `b0c39c2` ci: 러너 실제 물리 디스크 프로브 (WSL /mnt/c + Windows Get-PSDrive) (#24) — _sckahn_
- `6f3708f` ci: 러너 실제 물리 디스크 프로브 (WSL /mnt/c + Windows Get-PSDrive) — _sckahn_
- `cdf68e7` feat(ci): 도커 이미지 pull→save(gz)→1.9GB 분할 워크플로 (#23) — _sckahn_
- `f3a471d` feat(ci): 도커 이미지 pull→save(gz)→1.9GB 분할 워크플로 — _sckahn_

#### 🔮 MYSTIC (5)
- `73884d2` ci(cleanup): npm 제거+_tool 정리+에러무시+exit0 — _sckahn_
- `17d6665` ci(cleanup): shell pwsh->powershell(5.1) — _sckahn_
- `4738d89` ci: 러너 디스크 정리 워크플로우(main 등록) — _sckahn_
- `e10c6aa` ci: 셀프호스티드 러너 디스크 정리 워크플로우(3중 병렬) — _sckahn_
- `c0b0c7e` fix(toolcall): 필터 자동 교정(operator/value→SET) — -32602 무한루프 해결 — _sckahn_

### 2026-07-25

_1개 레포 · 커밋 1건_

#### 🔮 MYSTIC (1)
- `f5ac31b` test(server): query_utils 분리 + 단위테스트 24개 — _sckahn_

### 2026-07-27

_2개 레포 · 커밋 11건_

#### 🧙 MAGE (3)
- `1728b149` fix(airgap): grafana 이미지 태그를 번들 것(11.2.0)으로 고정 (airgap pull 실패 해소) — _sckahn_
- `3ad1036f` fix(airgap): helm sudo-PATH(/usr/bin 심볼릭+전체경로) + 이미지 import non-aborting — _sckahn_
- `371e2671` fix(airgap): step4 커스텀 nvidia containerd 템플릿 제거 (containerd 크래시 해소) — _sckahn_

#### 🔮 MYSTIC (8)
- `eea7d5c` feat(toolcall): 툴 결과를 행수 대신 '문자 예산'으로 제한 + 정렬/스텝 상향 — _sckahn_
- `50eb06d` ci(build): 빌드 pre-cleanup 에서 _tool 삭제 제거 + cleanup 잡은 _tool 통째 wipe — _sckahn_
- `13af9b6` feat(glossary): 보험/IFRS17 용어사전 — 자연어→재료(예정·실제) 매핑 — _sckahn_
- `f545f31` feat(toolcall): 예실차 계산(예정-실제) 유도 + 화면 최우선 읽기, 무관 값 대체 금지 — _sckahn_
- `90b66ce` ci(build): pre-cleanup 에서 _tool(호스티드 툴캐시) 정리 — 재빌드 디스크 누적 방지 — _sckahn_
- `4415f9d` fix(toolcall): 없는 컬럼 시 유사 실제 컬럼 제안(difflib+prefix) — 헛호출 감소 — _sckahn_
- `36272a1` ci(build): pre-cleanup npm/pip stderr 격리(cmd)+에러무시 — 스텝 exit1 방지 — _sckahn_
- `dc0d8be` fix(toolcall): 설명 대신 실제 run_query 실행 + 그룹/월별은 차원 그룹화 유도 — _sckahn_

### 2026-07-28

_2개 레포 · 커밋 7건_

#### 🧙 MAGE (4)
- `06f7a8b6` fix(airgap): HAMi kube-scheduler 를 registry.k8s.io 로 (폐쇄망 빌드 러너 pull 가능) — _sckahn_
- `aaf0e9da` fix(airgap): 전 차트 이미지 태그 helm-render 기준 전수 정합 + loki 설치버그 — _sckahn_
- `600cc431` fix(airgap): backend enableServiceLinks:false (K8s 서비스 env 주입 크래시 해소) — _sckahn_
- `a052f849` fix(airgap): 앱 이미지 태그를 번들버전과 분리해 0.1.0 고정 (ImagePullBackOff 해소) — _sckahn_

#### 🔮 MYSTIC (3)
- `ff9997f` feat(toolcall): read_view_data 툴 — 뷰 계산값(예실차/예정/실제)을 뷰 표에서 직접 조회 — _sckahn_
- `22c721f` feat(toolcall): find_value 툴 추가 — 값이 어느 차원 컬럼에 있는지 찾아 헛탐색 제거 — _sckahn_
- `af1aa7d` fix(toolcall): 툴 호출 없이 설명만 반환하던 문제 수정 — run_query 강제 재요청 — _sckahn_

### 2026-07-29

_2개 레포 · 커밋 2건_

#### 🧙 MAGE (1)
- `afb274b5` ci(upload-vllm): parts 경로를 태그 버전에서 파생 (0.19.0 하드코딩 제거) — _sckahn_

#### 🔮 MYSTIC (1)
- `3973ad4` feat(toolcall): list_views 툴 — 시트 이름을 힌트로 맞는 시트를 골라 읽게 — _sckahn_

### 2026-07-30

_1개 레포 · 커밋 2건_

#### 🧙 MAGE (2)
- `dc8ba9c1` feat(airgap): IAM 초기 시드 — 배포 시 /vault/iam.yaml 자동 생성(admin) — _sckahn_
- `33043a23` ci(upload-vllm): save-image-split 산출 경로(_단일) fallback 추가 — _sckahn_

### 2026-07-31

_1개 레포 · 커밋 3건_

#### 🔮 MYSTIC (3)
- `55bc9e5` feat(toolcall): few-shot 을 MCP 메타데이터로 동적 생성 — 캡션 하드코딩 제거 — _sckahn_
- `b5e940c` feat(toolcall): 쿼리 형성 튜닝 — 함수규칙/few-shot/기간변환 + role 교정 + 스키마힌트 + 골든평가 — _sckahn_
- `22a3394` fix(toolcall): 답변에 쿼리 JSON 노출 차단 — 실제 수치로 재작성 강제 — _sckahn_

### 2026-08-03

_1개 레포 · 커밋 3건_

#### 🧙 MAGE (3)
- `71078b74` feat: convert 병렬화(--jobs) + vault 자동탐색 개선 — 대량 코퍼스 대응 — _sckahn_
- `263fe3f2` fix: Windows 러너에 pwsh 없음 — Windows PowerShell 로 전환 — _sckahn_
- `8746e439` feat: 보험 온톨로지 구축 도구 + Windows 단일 실행파일 빌드 파이프라인 — _sckahn_

### 2026-08-04

_11개 레포 · 커밋 38건_

#### 🧙 MAGE (5)
- `b3808892` chore: ChromaDB 역할매칭·K8s 프로브·배포 핀 방어 정리 (#12) — _sckahn_
- `e1f297da` feat(cors): 관리 콘솔용 CORS 설정(기본 비활성, 오리진 지정 시 장착) — _sckahn_
- `6f8dc8c9` feat(skill): 사용자별 가시성 + 권한관리 스킬 레지스트리 — _sckahn_
- `37e851ed` MAI 보강과제: MAGE-1~6 구현 (#49) — _sckahn_
- `cbef742a` fix(airgap): KPS admission webhook 비활성화 — certgen 이미지 부재로 훅 timeout (#50) — _sckahn_

#### 🎩 MAGIC (13)
- `8672d7b` feat(magic): MAGIC 2.0 — MOJO 엔진 기반 미래에셋 AI 업무비서 데스크톱 — _sckahn_
- `5a252d0` chore: 리브랜딩(표면) + 봇 채널 기본 비활성화 (#4) — _sckahn_
- `5910d76` ci: Tauri setup.exe 를 rolling 릴리스로 발행 (#26) — _sckahn_
- `13b4b27` build(deps): bump actions/upload-artifact from 4 to 7 (#20) — _dependabot[bot]_
- `935ce64` build(deps): bump actions/checkout from 4 to 7 (#5) — _dependabot[bot]_
- `bd401d4` chore: mai-suite 인스톨러 워크플로 제거 — MALife-AI/mai-suite 로 이관됨 (#8) — _sckahn_
- `f953baa` build(deps): bump actions/setup-node from 4 to 6 (#19) — _dependabot[bot]_
- `09b28a6` build(deps): bump actions/cache from 5.0.2 to 6.1.0 (#21) — _dependabot[bot]_
- `0237632` build(deps): bump actions/add-to-project from 1.0.2 to 2.0.0 (#28) — _dependabot[bot]_
- `c3f4d3d` chore: Tauri 셸 스텁 실구현 + 딥링크 브랜딩 (#22) — _sckahn_
- `067bcd5` test(cli): AuthDialog 위저드 테스트 플레이크 제거 + extensions list 로케일 고정 (#14) — _sckahn_
- `f3997c5` MAI 보강과제: MAGIC-1~3 구현 (#33) — _sckahn_
- `db723d9` MAI 보강과제: MOJO-1~4 구현 (#13) — _sckahn_

#### 🌋 MAGMA (1)
- `c780ae6` MAI 보강과제: MAGMA-1~6 구현 (#12) — _sckahn_

#### 🧲 MAGNET (1)
- `50e8d41` MAI 보강과제: MAGNET-1~3 구현 (#10) — _sckahn_

#### 📦 mai-suite (4)
- `4007360` ci(build-suite): MOJO 체크아웃 경로 mojo→mojo-src (러너 파일시스템 손상 우회) — _sckahn_
- `7293d74` ci(build-suite): pre-clean 강화 — 잔재 프로세스 kill + 롱패스 rmdir + 실패시 명시적 abort — _sckahn_
- `3126d21` ci(build-suite): MOJO 체크아웃 전 robocopy 강제 정리(러너 잔재 롱패스/잠금 파일 대응) — _sckahn_
- `62387b1` ci: MAGIC fresh 빌드 복귀 (고정 폴백 해제) (#4) — _sckahn_

#### 💧 MANA (4)
- `5b17ed3` fix(marketplace): 폐쇄망 - 외부 CDN 폰트 링크 제거(system-ui 폴백) — _sckahn_
- `09d9068` feat(marketplace): MAGE 스킬 레지스트리 관리자 콘솔 추가 — _sckahn_
- `5f35408` chore: 설치 스크립트·문서 품질 기술부채 정리 (#3) — _sckahn_
- `1aff6e4` MAI 보강과제: MANA-1~3 구현 (#7) — _sckahn_

#### 📊 MARK (2)
- `e38d5bb` chore: 품질 기술부채 정리 (세션 상한·네이밍 문서화·입력 검증) (#1) — _sckahn_
- `fb0e147` MAI 보강과제: MARK-1~3 구현 (#5) — _sckahn_

#### 🪄 MERLIN (1)
- `7070182` MAI 보강과제: MERLIN-1~3 구현 (#6) — _sckahn_

#### 🕸️ MESH (1)
- `a901aef` MAI 보강과제: MESH-1~3 구현 (#11) — _sckahn_

#### ⚙️ MOJO (5)
- `8672d7b` feat(magic): MAGIC 2.0 — MOJO 엔진 기반 미래에셋 AI 업무비서 데스크톱 — _sckahn_
- `5a252d0` chore: 리브랜딩(표면) + 봇 채널 기본 비활성화 (#4) — _sckahn_
- `bd401d4` chore: mai-suite 인스톨러 워크플로 제거 — MALife-AI/mai-suite 로 이관됨 (#8) — _sckahn_
- `067bcd5` test(cli): AuthDialog 위저드 테스트 플레이크 제거 + extensions list 로케일 고정 (#14) — _sckahn_
- `db723d9` MAI 보강과제: MOJO-1~4 구현 (#13) — _sckahn_

#### 🔮 MYSTIC (1)
- `4f41873` MAI 보강과제: MYSTIC-1~3 구현 (#10) — _sckahn_

### 2026-08-05

_1개 레포 · 커밋 3건_

#### 🧙 MAGE (3)
- `78497360` docs: 입문 설명서 파일명을 GraphRAG-한눈에.md 로 변경 — _cek_
- `8c1d7275` docs: 그래프 & GraphRAG 입문 설명서 추가 — _cek_
- `1a445411` docs: backend/graph 지식그래프 모듈 문서 추가 — _cek_

### 2026-08-06

_8개 레포 · 커밋 26건_

#### 🧙 MAGE (9)
- `dac1d580` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `fec232e0` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_
- `e66f86e4` fix(airgap): v0.2.3 전면 401 해소 + 반입 후에야 드러나던 배포 결함 일괄 수정 — _sckahn_
- `164d9051` fix(bundle): 후속 5건 — 경보 룰 0개·smoke-test 누락·포트 하드코딩·compose 신원헤더·models 링크 — _sckahn_
- `f530c191` feat(sim): mac 는 mock, linux 는 실제 — 반입 전 배포 예행 트랙 추가 — _sckahn_
- `17effd30` fix(gateway): 업로드 1MB 상한·패밀리 엔드포인트 미프록시·퇴직자 키 통과 수정 — _sckahn_
- `cd6170b2` fix(airgap): 반입 후에야 드러나던 배포 결함 일괄 수정 (데이터 소실·색인 불능·GPU 미광고) — _sckahn_
- `372bd085` fix(nginx): 신원 헤더를 strip 만 하고 대체가 없어 아무도 로그인 못 하던 문제 — _sckahn_
- `30dfe894` fix(iam): v0.2.3 전면 401 3중 원인 해소 — 시드 스키마·핫리로드·권한 잠김 — _sckahn_

#### 🎩 MAGIC (5)
- `7919ef2` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `a04cea9` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `87b742e` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_
- `4d900e0` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_
- `44cae53` 보안·안정성 수정 + Windows/브랜딩 정리 (main 최신 병합 포함) (#46) — _sckahn_

#### 🌋 MAGMA (2)
- `848c3ef` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `6a97f5e` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

#### 📦 mai-suite (2)
- `1e64515` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `794d5fa` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

#### 🪄 MERLIN (2)
- `bad2358` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `cd52ce8` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

#### 🕸️ MESH (2)
- `ad23be0` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `1704a12` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

#### ⚙️ MOJO (2)
- `7919ef2` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `87b742e` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

#### 🔮 MYSTIC (2)
- `55b14f3` ci: add-to-project v2.0.0 로 통일 — _sckahn_
- `a58f1e7` ci: 자동추가 워크플로 — dependabot PR 대응 + Linux 러너 — _sckahn_

### 2026-08-08

_8개 레포 · 커밋 9건_

#### 🧲 MAGNET (1)
- `6f3ad18` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 📦 mai-suite (2)
- `7f8fdf9` docs(contract): 타 제품군 이식용 템플릿 + 방법론 스킬 연계 — _sckahn_
- `6713b12` feat(contract): 패밀리 계약을 mai-suite 로 이관 + 생성·검사 도구 — _sckahn_

#### 💧 MANA (1)
- `3c50f31` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 📊 MARK (1)
- `e0e5754` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 🪄 MERLIN (1)
- `f0f0f6e` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 🕸️ MESH (1)
- `37cdb05` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### ⚙️ MOJO (1)
- `404f665` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 🔮 MYSTIC (1)
- `f0c8d6a` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

### 2026-08-10

_9개 레포 · 커밋 88건_

#### 🧙 MAGE (18)
- `ef3986ba` feat(slice): 제품 번들 배포 — 형제 제품을 호스팅 테넌트로 (계약 G) (#55) — _sckahn_
- `a8747e81` feat(airgap): 계약 G 번들·devbox 이미지 등재 + 앱 태그 __VERSION__ 고정 — _sckahn_
- `0b349f54` feat(slice): 제품 번들 배포 — 형제 제품을 호스팅 테넌트로 (계약 G) — _sckahn_
- `d44d5477` feat(audit): 인증 방언 통일 + decision 어휘 분리 + 감사 파일 파트 분할 (MAGE#56 대응, #58 재개) (#60) — _sckahn_
- `aaa9d343` test: #54 머지 후 직접 호출 테스트에 X-MAI 5종 파라미터 명시 — _sckahn_
- `3a6f1623` docs(audit): mr_review_triggered 등재 — MAGMA 질의 답변 — _sckahn_
- `4d8d2764` feat(audit): 인증 방언 통일 + decision 어휘 분리 + 감사 파일 파트 분할 — _sckahn_
- `24ec361a` fix(gateway): X-Mai-Tenant 핀으로 교차 테넌트 이탈 — 핀을 키 허용범위로 제한 (#57) — _sckahn_
- `e6ee049e` feat(audit): 게이트웨이가 질의·응답 전문을 마스킹 후 기록 (계약 D) (#54) — _sckahn_
- `990327da` feat(gateway): X-MAI-* 5종 수신·기록 — 계약 C 의 MAGE 측 DoD 이행 — _sckahn_
- `5f198d21` feat(audit): 인증 방언 통일 + decision 어휘 분리 + 감사 파일 파트 분할 — _sckahn_
- `1ab3a315` fix(gateway): X-Mai-Tenant 핀으로 교차 테넌트 이탈 — 핀을 키 허용범위로 제한 — _sckahn_
- `6646215c` feat(airgap): 계약 G 번들·devbox 이미지 등재 + 앱 태그 __VERSION__ 고정 — _sckahn_
- `3cc4f29f` feat(audit): 스트리밍 응답 기록 + 전문 파기 잡 3트랙 배선 (계약 D 완결) — _sckahn_
- `635f9d27` feat(audit): 게이트웨이가 질의·응답 전문을 마스킹 후 기록 (계약 D) — _sckahn_
- `a9ec60d9` feat(slice): 제품 번들 배포 — 형제 제품을 호스팅 테넌트로 (계약 G) — _sckahn_
- `525e8b51` feat(auth): 세션 로그인 — 신원을 클라이언트 헤더에서 서버 서명 쿠키로 이전 (#53) — _sckahn_
- `6c116d8b` fix: HAMi 침묵 실패 가드 + 부서 폴더 권한 상승 + helm 부재 조기중단 + models PV nodeAffinity (#52) — _sckahn_

#### 🎩 MAGIC (11)
- `f6644e3` feat(core): scale microcompaction keep-recent default to model context window — _sckahn_
- `981be00` chore(release): MAGIC 2.0.0 — 버전 인상 + README 정리 + 설치본 브랜딩 잔재 제거 — _sckahn_
- `d72736d` chore(brand): rename remaining qwen-facing strings and themes to Mojo — _sckahn_
- `1fe4ee6` feat(ui): enable flicker-free alt-screen renderer (useTerminalBuffer) by default — _sckahn_
- `dc6c8eb` feat(context): switch project context file to MOJO.md (keep QWEN.md compat) — _sckahn_
- `2de0ffc` ci: 3호망(net3) 설치본 빌드·발행 경로 추가 (#55) — _sckahn_
- `ea54cc3` 계약 문서 참조 + 계약 F 위반 해소(3호망 빌드 분리) + 통합문서 현행화 (#54) — _sckahn_
- `14db2f2` docs(contract): 계약 문서 재생성 — X-MAI-Tenant 편입 반영 — _sckahn_
- `28825b1` docs(contract): 계약 문서를 이 레포 규칙에 맞추고 실제 채택 상태 선언 — _sckahn_
- `da1b522` style(docs): AI_FAMILY_INTEGRATION.md prettier 포맷 정합 — _sckahn_
- `8988897` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 🌋 MAGMA (14)
- `05ef669` fix(ai-gateway): 감사 어휘 정렬 — decision 제거, outcome + meta.result (MAGE#58) (#18) — _sckahn_
- `34a8cae` fix(ai-gateway): 감사 어휘 정렬 — decision 제거, outcome + meta.result (MAGE#58) — _sckahn_
- `4a42a63` docs: 계약 A 배포 전 체크리스트 — 새 airgap 번들 굽기 전 MAGE 앞단 확인 (#17) — _sckahn_
- `3cd2827` docs: 계약 A 배포 전 체크리스트 — 새 airgap 번들 굽기 전 MAGE 앞단 확인 — _sckahn_
- `9165e23` fix(ai-gateway): Anthropic 경로 인증 방언 단일화 — Bearer 중복 제거 (계약 A) (#16) — _sckahn_
- `f08ab29` fix(ai-gateway): Anthropic 경로 인증 방언 단일화 — Bearer 중복 제거 (계약 A) — _sckahn_
- `2b779fe` feat(ai-gateway): 챗·커밋·FIM 경로에 X-MAI 헤더·중앙 감사 배선 (계약 C·D) (#14) — _sckahn_
- `f1af855` docs(contract): 계약 A 판정 요청 링크 (MAGE#56) — _sckahn_
- `d89f933` docs: AI_FAMILY_INTEGRATION 공백 표 정정 — 헤더·감사는 해소됨 — _sckahn_
- `bb831b5` fix(contract): 선언 파일의 레지스트리 호스트명 제거 — 계약 G 자기오탐 — _sckahn_
- `bcb2fa3` feat(ai-gateway): 챗·커밋·FIM 경로에 X-MAI 헤더·중앙 감사 배선 (계약 C·D) — _sckahn_
- `3a3fa1a` docs(contract): 패밀리 계약 의무 문서 + 현재 코드 기준 준수 현황 (#13) — _sckahn_
- `5087e89` ci: 서버 airgap 이미지 번들 발행 워크플로 (#15) — _sckahn_
- `f2ac8cc` docs(contract): 패밀리 계약 의무 문서 + 현재 코드 기준 준수 현황 — _sckahn_

#### 🧲 MAGNET (8)
- `fc5c1ed` feat(magnet-ai): mai-bus 코디네이터 봇 등록 지점 추가 — _sckahn_
- `8c76a8b` docs(contract): B 오탐 원인 갱신 — i18n 아니라 코어 EE 의 oidc 부분문자열 — _sckahn_
- `8720880` docs(contract): 검사기가 CLAUDE.md 를 제외하게 되어 D 행 원문 복구 — _sckahn_
- `287fa81` docs(contract): 계약 문서가 검사 리포트를 오염시키던 문제 해결 — _sckahn_
- `0063f9c` docs(contract): A 행 판정 정정 — AI_Model 기본값은 위반이 아니다 — _sckahn_
- `3d34cdc` docs(contract): 채택 선언(.mai-contract.yml)을 계약 v1 정정에 맞춤 — _sckahn_
- `73d7b54` docs(contract): x-mai-tenant 드리프트 판정 철회 + 핀 제약 반영 — _sckahn_
- `9123e54` docs(contract): 계약 문서를 MAGNET 레포 실제 구조·이행 현황에 맞춤 — _sckahn_

#### 📦 mai-suite (15)
- `9903f41` feat(contract): 판정 출처 표기 + 계약 C 부분이행 한계 명시 + MYSTIC 계약 F 비대상 — _sckahn_
- `d43b957` fix(contract): 오탐 2건 — i18n 번역문 스캔 제외 + dialect_mixed 배타접속사 보정 — _sckahn_
- `ab6e2f7` fix(contract): 간접 게이트웨이 소비 탐지 + MESH 계약 F 비대상 + 기본 브랜치 판정 — _sckahn_
- `708f2dc` fix(contract): 스캔 제외 두 갈래를 하나로 — 툴체인 캐시 + 자기참조 파일명 변형 — _sckahn_
- `16ea36b` fix(contract): dialect_mixed 에 review_hint 값 부여 — _sckahn_
- `996ac6a` fix(contract): X-MAI-Tenant 금지 철회(MAGE 하드닝으로 해소) + 스캔 위생 — _sckahn_
- `2966ca1` docs(contract): 준수 현황 재생성 — MAGMA 계약 C·D 머지 반영(main 2b779fe) — _sckahn_
- `2824312` fix(contract): 선언 파일(.mai-contract.yml)을 스캔 대상에서 제외 — _sckahn_
- `410939b` feat(contract): 리포트에 형제 레포 스캔 대상 기록 — _sckahn_
- `a55f659` docs(contract): 준수 현황 재생성 — MAGMA G 자기오탐 해소(O→X) — _sckahn_
- `db6ee8c` docs(contract): 준수 현황 재생성 — MAGIC 머지(ea54cc3) 반영 — _sckahn_
- `2992328` feat(contract): X-MAI-Tenant 계약 편입 + CI 검사 배선 — _sckahn_
- `c8303a8` fix(contract): 계약 F 현황 재정정 + 자기참조 오탐 제거 — _sckahn_
- `a0b4d25` fix(contract): 계약 F 현황 정정 — MAGE codeexec 3종은 이미 구현·동작 중 — _sckahn_
- `8c40d78` feat(contract): 패밀리 계약을 mai-suite 로 이관 + 생성·검사 도구 (#27) — _sckahn_

#### 🪄 MERLIN (3)
- `677e022` docs(contract): 계약 F 를 5호망 전용 배포 기준으로 정정 + 3호망 전환 가드 — _sckahn_
- `7d9fdc1` docs(contract): 패밀리 계약 v1 채택 선언(.mai-contract.yml) 추가 — _sckahn_
- `c762201` chore: .gitattributes 복원 — .sh 개행을 LF로 고정 — _sckahn_

#### 🕸️ MESH (5)
- `a3a51ea` fix(contract): 계약 A 이중 인증 방언 제거 + C·D 현황 정정 (#13) — _sckahn_
- `af6dc99` fix(contract): 계약 A 이중 인증 방언 제거 + C·D 현황 정정 — _sckahn_
- `29667b9` index on main: aa3ceb7 fix(ci): cargo NUL 오염 crate 를 src+cache 양쪽에서 제거 (#7) — _sckahn_
- `4c51916` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 (#12) — _sckahn_
- `e11e087` docs(contract): 계약 문서를 MESH 코드 실측에 맞춰 보정 — _sckahn_

#### ⚙️ MOJO (11)
- `e32a5fc` feat(model): expose model.maxOutputTokens to raise the initial output budget — _sckahn_
- `d45b731` fix(recovery): stop paraphrased-answer repetition in output-token recovery — _sckahn_
- `22971ac` feat(compression): preserve completed-task list in compaction summary — _sckahn_
- `b40c89f` feat(loop): headless-aware loop-detection default + configurable per-turn tool-call cap — _sckahn_
- `d72736d` chore(brand): rename remaining qwen-facing strings and themes to Mojo — _sckahn_
- `1fe4ee6` feat(ui): enable flicker-free alt-screen renderer (useTerminalBuffer) by default — _sckahn_
- `dc6c8eb` feat(context): switch project context file to MOJO.md (keep QWEN.md compat) — _sckahn_
- `14db2f2` docs(contract): 계약 문서 재생성 — X-MAI-Tenant 편입 반영 — _sckahn_
- `28825b1` docs(contract): 계약 문서를 이 레포 규칙에 맞추고 실제 채택 상태 선언 — _sckahn_
- `da1b522` style(docs): AI_FAMILY_INTEGRATION.md prettier 포맷 정합 — _sckahn_
- `8988897` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 — _sckahn_

#### 🔮 MYSTIC (3)
- `ca0924e` fix(audit): decision 을 정책 판단 전용으로 정리 — 흐름 분기는 route 로 분리 — _sckahn_
- `5ac308b` docs(contract): 아웃바운드 HTTP 지점 인벤토리 — 부분 이행 사각지대 대비 — _sckahn_
- `8b25640` docs(contract): 패밀리 계약 의무 문서 + 작업 지침 참조 추가 (#11) — _sckahn_

### 2026-08-11

_1개 레포 · 커밋 1건_

#### 🎩 MAGIC (1)
- `075cdf0` fix(core): qwen3.x 입력 한도를 256K로 산정 — 게이트웨이 서빙 스펙 반영 — _sckahn_

### 2026-08-12

_3개 레포 · 커밋 10건_

#### 🧙 MAGE (7)
- `2d2ca807` feat(graph-api): /search 응답에 redacted 메타 노출 (프론트 배지용) — _sckahn_
- `bd0adceb` feat(agent): ACL redacted 안내 프롬프트 주입 + 테스트 3케이스 (③⑥) — _sckahn_
- `39caf665` feat(graph): ACL redacted 집계 — 권한 밖 노드 존재+담당부서만 검색결과에 전달 (①②④⑤) — _sckahn_
- `1eecc4a1` test(graph): P1 런타임 v2 일원화 테스트 12케이스 (P1 ③) — _sckahn_
- `6e745b29` feat(graph): P1 — 런타임 추출을 온톨로지 v2 스키마로 일원화 — _sckahn_
- `2bab9272` feat(graph): v1→v2 어휘 마이그레이션 스크립트 + 테스트 (P2 ②④) — _sckahn_
- `f73c6939` feat(ontology): legacy_compat 노드 타입 매핑 보완 — condition·person 추가 + 구조노드 passthrough 목록 (P2 ①) — _sckahn_

#### 📌 mai-family (2)
- `a6cf452` refactor(decks): 일자별 릴리즈 노트를 덱에서 분리 — docs/release-notes.md로 보존 (Liam 지시) — _sckahn_
- `9f3de39` feat(decks): 기능 개발 히스토리 피치덱 — 50일 타임라인 + 일자별 릴리즈 노트 — _sckahn_

#### 🕸️ MESH (1)
- `771642c` fix(test): confluence 동기화 describe 타임아웃 20s — CI 콜드 스타트 대응 — _sckahn_
