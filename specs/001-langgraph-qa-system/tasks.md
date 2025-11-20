# 작업 목록: LangGraph 기반 지능형 Q&A 시스템

**Input**: 설계 문서 from `/specs/001-langgraph-qa-system/`
**Prerequisites**: plan.md (필수), spec.md (필수), research.md, data-model.md, contracts/

**조직화**: 작업은 사용자 스토리별로 그룹화되어 각 스토리의 독립적 구현 및 테스트를 가능하게 합니다.

## 형식: `[ID] [P?] [Story] 설명`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: 이 작업이 속한 사용자 스토리 (예: US1, US2, US3)
- 설명에 정확한 파일 경로 포함

## 경로 규칙

- **Web app**: `backend/src/`, `frontend/src/`
- 아래 경로는 plan.md 구조 기준

---

## Phase 1: Setup (프로젝트 초기화)

**목적**: 프로젝트 구조 및 기본 의존성 설치

- [ ] T001 백엔드 디렉토리 생성 (`backend/`)
- [ ] T002 프론트엔드 디렉토리 생성 (`frontend/`)
- [ ] T003 백엔드 Python 가상환경 생성 (`backend/venv/`)
- [ ] T004 백엔드 requirements.txt 작성 (LangGraph, LangChain, FastAPI, pgvector, Redis 등)
- [ ] T005 백엔드 의존성 설치 (`pip install -r backend/requirements.txt`)
- [ ] T006 [P] 프론트엔드 Next.js 프로젝트 초기화 (`npx create-next-app@latest frontend/`)
- [ ] T007 [P] 프론트엔드 의존성 설치 (axios, react-i18next 등)
- [ ] T008 환경 변수 파일 템플릿 생성 (`backend/.env.example`)
- [ ] T009 [P] Docker Compose 파일 작성 (`docker-compose.dev.yml` - PostgreSQL, Redis)
- [ ] T010 [P] .gitignore 파일 업데이트 (venv, .env, node_modules 등)
- [ ] T011 백엔드 디렉토리 구조 생성 (`backend/src/{agents,crawlers,embeddings,models,services,api,db}`)
- [ ] T012 [P] 백엔드 테스트 디렉토리 생성 (`backend/tests/{unit,integration,contract}`)
- [ ] T013 [P] 프론트엔드 디렉토리 구조 생성 (`frontend/src/{components,lib,types}`)

---

## Phase 2: Foundational (필수 인프라 - 모든 스토리 차단)

**목적**: 모든 사용자 스토리 구현 전에 반드시 완료되어야 하는 핵심 인프라

**⚠️ CRITICAL**: 이 Phase가 완료되기 전까지 사용자 스토리 작업 시작 불가

### 데이터베이스 설정

- [ ] T014 Docker Compose로 PostgreSQL + pgvector 컨테이너 시작
- [ ] T015 PostgreSQL pgvector extension 설치 (`CREATE EXTENSION vector;`)
- [ ] T016 knowledge_sources 테이블 생성 (`backend/src/db/schema.sql`)
- [ ] T017 knowledge_embeddings 테이블 생성 (HNSW 인덱스 포함)
- [ ] T018 crawl_logs 테이블 생성
- [ ] T019 [P] Redis 컨테이너 시작 및 연결 테스트

### 백엔드 기본 설정

- [ ] T020 [P] 환경 변수 로더 구현 (`backend/src/config.py` - Pydantic Settings)
- [ ] T021 [P] PostgreSQL 연결 풀 구현 (`backend/src/db/postgres.py` - asyncpg 또는 psycopg2)
- [ ] T022 [P] Redis 클라이언트 구현 (`backend/src/db/redis.py` - redis-py)
- [ ] T023 FastAPI 앱 초기화 (`backend/src/api/main.py`)
- [ ] T024 CORS 미들웨어 설정 (`backend/src/api/middleware.py`)
- [ ] T025 [P] Rate Limiting 미들웨어 구현 (slowapi - 분당 60 요청)
- [ ] T026 [P] 보안 미들웨어 구현 (XSS, CSRF 보호 헤더)
- [ ] T027 [P] 구조화 로깅 설정 (`structlog` - JSON 포맷)

### Pydantic 모델 (공통 데이터 구조)

- [ ] T028 [P] ConversationSession 모델 정의 (`backend/src/models/session.py`)
- [ ] T029 [P] Message 모델 정의 (`backend/src/models/message.py`)
- [ ] T030 [P] Question 모델 정의 (`backend/src/models/question.py`)
- [ ] T031 [P] Answer 모델 정의 (`backend/src/models/answer.py`)
- [ ] T032 [P] KnowledgeSource 모델 정의 (`backend/src/models/knowledge.py`)
- [ ] T033 [P] SuggestedQuestion 모델 정의 (`backend/src/models/suggestion.py`)

### 크롤링 인프라

- [ ] T034 Scrapy Spider 기본 구조 생성 (`backend/src/crawlers/web_crawler.py`)
- [ ] T035 크롤러 설정 파일 작성 (robots.txt 준수, 재시도 로직)
- [ ] T036 크롤링 결과 → KnowledgeSource 저장 로직 (`backend/src/crawlers/storage.py`)
- [ ] T037 APScheduler 스케줄러 초기화 (`backend/src/crawlers/scheduler.py` - 5분 주기)
- [ ] T038 크롤링 실패 알림 로직 구현 (3회 실패 시 is_stale=true 설정)

### 임베딩 인프라

- [ ] T039 OpenAI 클라이언트 초기화 (`backend/src/embeddings/client.py`)
- [ ] T040 텍스트 청킹 함수 구현 (`backend/src/embeddings/chunker.py` - 512 토큰, 50 토큰 overlap)
- [ ] T041 임베딩 생성 함수 구현 (`backend/src/embeddings/generator.py` - text-embedding-3-small)
- [ ] T042 벡터 저장 함수 구현 (`backend/src/embeddings/vector_store.py` - pgvector INSERT)
- [ ] T043 벡터 검색 함수 구현 (cosine similarity, top-k 검색)

### 헬스체크 엔드포인트

- [ ] T044 헬스체크 라우터 생성 (`backend/src/api/routes/health.py`)
- [ ] T045 PostgreSQL 연결 상태 체크 로직
- [ ] T046 Redis 연결 상태 체크 로직
- [ ] T047 OpenAI API 연결 상태 체크 로직 (간단한 ping)
- [ ] T048 헬스체크 엔드포인트 FastAPI 라우터에 등록

**Checkpoint**: Foundation 완료 - 사용자 스토리 구현 이제 병렬 시작 가능

---

## Phase 3: User Story 1 - 홈페이지 콘텐츠 기반 질문 응답 (Priority: P1) 🎯 MVP

**Goal**: NURI 플랫폼 정보에 대한 자연어 질문에 3초 이내 답변 제공

**Independent Test**: "NURI의 Tier 1 시장은 어디인가요?" 질문 → 정확한 답변 + 출처 표시 확인

### 언어 감지

- [ ] T049 [P] [US1] langdetect 언어 감지 함수 구현 (`backend/src/services/language_detector.py`)
- [ ] T050 [P] [US1] OpenAI 폴백 언어 감지 함수 구현 (혼용 질문 대응)
- [ ] T051 [US1] 언어 감지 서비스 통합 (langdetect 우선, 실패 시 OpenAI)

### LangGraph 에이전트 - 노드 구현

- [ ] T052 [P] [US1] LangGraph 상태 정의 (`backend/src/agents/state.py` - QAState TypedDict)
- [ ] T053 [P] [US1] 언어 감지 노드 구현 (`backend/src/agents/nodes.py - detect_language_node`)
- [ ] T054 [P] [US1] 문서 검색 노드 구현 (`retrieve_documents_node` - pgvector 쿼리)
- [ ] T055 [US1] 답변 생성 노드 구현 (`generate_answer_node` - gpt-4o-mini RAG)
- [ ] T056 [US1] 신뢰도 평가 노드 구현 (답변 신뢰도 점수 계산)

### LangGraph 에이전트 - 그래프 구성

- [ ] T057 [US1] StateGraph 생성 및 노드 추가 (`backend/src/agents/qa_agent.py`)
- [ ] T058 [US1] 노드 간 엣지 연결 (detect_language → retrieve_docs → generate_answer)
- [ ] T059 [US1] 조건부 엣지 구현 (신뢰도 < 0.7이면 명확화 요청)
- [ ] T060 [US1] 에이전트 그래프 컴파일

### Q&A 서비스 계층

- [ ] T061 [US1] QA 서비스 초기화 (`backend/src/services/qa_service.py`)
- [ ] T062 [US1] 질문 전처리 로직 (XSS 제거, 길이 검증)
- [ ] T063 [US1] LangGraph 에이전트 호출 로직
- [ ] T064 [US1] 답변 후처리 로직 (출처 추출, 포맷팅)
- [ ] T065 [US1] 에러 핸들링 (LLM 실패, 타임아웃 등)

### API 엔드포인트

- [ ] T066 [US1] QuestionRequest/Response Pydantic 스키마 정의 (`backend/src/api/routes/qa.py`)
- [ ] T067 [US1] POST /api/v1/qa/ask 엔드포인트 구현
- [ ] T068 [US1] 요청 유효성 검증 (Pydantic validator)
- [ ] T069 [US1] 응답 시간 측정 로직 (processing_time_ms)
- [ ] T070 [US1] OpenAPI 문서화 주석 추가

### 프론트엔드 UI (기본)

- [ ] T071 [P] [US1] API 클라이언트 유틸리티 생성 (`frontend/src/lib/api-client.ts`)
- [ ] T072 [P] [US1] Q&A 타입 정의 (`frontend/src/types/qa.ts`)
- [ ] T073 [US1] QAInterface 컴포넌트 생성 (`frontend/src/components/QAInterface.tsx` - 질문 입력)
- [ ] T074 [US1] 답변 표시 컴포넌트 구현 (출처 링크 포함)
- [ ] T075 [US1] 로딩 상태 UI 구현
- [ ] T076 [US1] 에러 메시지 표시 UI 구현
- [ ] T077 [US1] Q&A 페이지 생성 (`frontend/src/app/qa/page.tsx`)

### 초기 데이터 준비

- [ ] T078 [US1] 샘플 홈페이지 콘텐츠 SQL 작성 (`backend/data/sample_knowledge.sql`)
- [ ] T079 [US1] 샘플 데이터 DB 삽입
- [ ] T080 [US1] 샘플 콘텐츠 임베딩 생성 스크립트 실행 (`backend/scripts/generate_embeddings.py`)

**Checkpoint**: User Story 1 완전히 기능하며 독립적으로 테스트 가능

---

## Phase 4: User Story 2 - 다국어 질문 응답 (Priority: P2)

**Goal**: 한국어/영어 자동 감지 및 동일 언어로 답변

**Independent Test**: "NURI가 뭐예요?" (한국어) vs "What is NURI?" (영어) → 각각 올바른 언어로 답변

### 언어별 프롬프트 템플릿

- [ ] T081 [P] [US2] 한국어 답변 프롬프트 템플릿 작성 (`backend/src/agents/prompts.py - ANSWER_PROMPT_KO`)
- [ ] T082 [P] [US2] 영어 답변 프롬프트 템플릿 작성 (`ANSWER_PROMPT_EN`)
- [ ] T083 [US2] 언어별 프롬프트 선택 로직 구현 (detect_language 결과 기반)

### 언어별 벡터 검색

- [ ] T084 [US2] 벡터 검색에 언어 필터 추가 (`WHERE language = :detected_language`)
- [ ] T085 [US2] 언어 불일치 시 폴백 로직 (예: 한국어 질문인데 영어 콘텐츠만 있을 때)

### 프론트엔드 다국어 지원

- [ ] T086 [P] [US2] react-i18next 설정 (`frontend/src/lib/i18n.ts`)
- [ ] T087 [P] [US2] 한국어 번역 파일 생성 (`frontend/public/locales/ko/common.json`)
- [ ] T088 [P] [US2] 영어 번역 파일 생성 (`frontend/public/locales/en/common.json`)
- [ ] T089 [US2] 언어 전환 버튼 컴포넌트 구현 (`frontend/src/components/LanguageSwitcher.tsx`)
- [ ] T090 [US2] QAInterface 컴포넌트에 i18n 적용
- [ ] T091 [US2] Next.js 다국어 라우팅 설정 (`frontend/src/app/[lang]/qa/page.tsx`)

### 추가 샘플 데이터

- [ ] T092 [US2] 영어 샘플 콘텐츠 추가 (`backend/data/sample_knowledge_en.sql`)
- [ ] T093 [US2] 영어 콘텐츠 임베딩 생성

**Checkpoint**: User Story 1과 2 모두 독립적으로 작동

---

## Phase 5: User Story 3 - 맥락 기반 대화 이력 유지 (Priority: P3)

**Goal**: 이전 질문/답변 맥락을 기억하여 자연스러운 후속 질문 처리

**Independent Test**: "NURI 농장 위치는?" → "그곳 좌표는?" 질문 시 "그곳"을 이전 답변 위치로 이해

### 세션 관리 서비스

- [ ] T094 [P] [US3] 세션 서비스 초기화 (`backend/src/services/session_service.py`)
- [ ] T095 [P] [US3] 새 세션 생성 함수 (Redis에 UUID 키 생성, 30분 TTL)
- [ ] T096 [P] [US3] 세션 조회 함수 (Redis GET)
- [ ] T097 [P] [US3] 세션 업데이트 함수 (메시지 추가, TTL 갱신)
- [ ] T098 [P] [US3] 세션 삭제 함수 (Redis DEL)

### 대화 이력 통합

- [ ] T099 [US3] QA 서비스에 세션 ID 파라미터 추가
- [ ] T100 [US3] 세션 ID 없을 시 자동 생성 로직
- [ ] T101 [US3] 이전 메시지 조회 및 LangGraph 상태에 추가
- [ ] T102 [US3] 답변 생성 프롬프트에 대화 이력 포함
- [ ] T103 [US3] 새 메시지 세션에 저장 (user + assistant)
- [ ] T104 [US3] 세션 메시지 50개 제한 로직 (FIFO)

### 세션 API 엔드포인트

- [ ] T105 [US3] GET /api/v1/qa/sessions/{session_id} 엔드포인트 구현 (`backend/src/api/routes/qa.py`)
- [ ] T106 [US3] DELETE /api/v1/qa/sessions/{session_id} 엔드포인트 구현
- [ ] T107 [US3] 세션 응답 스키마 정의 (`SessionResponse`)

### 프론트엔드 세션 UI

- [ ] T108 [US3] 세션 ID 로컬스토리지 저장/로드 (`frontend/src/lib/session.ts`)
- [ ] T109 [US3] ChatHistory 컴포넌트 생성 (`frontend/src/components/ChatHistory.tsx`)
- [ ] T110 [US3] QAInterface에 대화 이력 표시 통합
- [ ] T111 [US3] "대화 초기화" 버튼 구현 (세션 삭제 API 호출)

**Checkpoint**: User Story 1, 2, 3 모두 독립적으로 작동

---

## Phase 6: User Story 4 - 능동적 관련 정보 제안 (Priority: P4)

**Goal**: 답변 후 관련 질문 3개 자동 제안

**Independent Test**: "NURI 사업 모델은?" 질문 후 → "NURI 농장 위치도 궁금하신가요?" 같은 제안 표시

### 질문 제안 생성

- [ ] T112 [US4] 질문 제안 프롬프트 템플릿 작성 (`backend/src/agents/prompts.py - SUGGESTION_PROMPT`)
- [ ] T113 [US4] 질문 제안 노드 구현 (`backend/src/agents/nodes.py - suggest_questions_node`)
- [ ] T114 [US4] LangGraph 그래프에 제안 노드 추가 (generate_answer → suggest_questions)
- [ ] T115 [US4] 제안 질문 개수 제한 로직 (최대 3개)
- [ ] T116 [US4] 제안 질문 중복 제거 로직

### 제안 품질 향상

- [ ] T117 [US4] 제안 질문 관련도 점수 계산 (벡터 유사도 기반)
- [ ] T118 [US4] 낮은 관련도 제안 필터링 (임계값: 0.6)
- [ ] T119 [US4] 제안 질문 언어 일치 검증 (원 질문과 동일 언어)

### 프론트엔드 제안 UI

- [ ] T120 [US4] SuggestedQuestions 컴포넌트 생성 (`frontend/src/components/SuggestedQuestions.tsx`)
- [ ] T121 [US4] 제안 질문 클릭 시 자동 입력 기능
- [ ] T122 [US4] 제안 질문 UI 디자인 (버튼 또는 칩 스타일)
- [ ] T123 [US4] QAInterface에 제안 질문 컴포넌트 통합

**Checkpoint**: 모든 사용자 스토리 독립적으로 기능함

---

## Phase 7: 크롤링 자동화 (백그라운드 작업)

**목적**: 5분마다 홈페이지 크롤링 및 지식 베이스 갱신

### 크롤링 스케줄러

- [ ] T124 크롤링 작업 함수 구현 (`backend/src/crawlers/job.py - run_crawler()`)
- [ ] T125 CrawlLog 시작 레코드 생성 (status='running')
- [ ] T126 변경된 페이지 감지 로직 (ETag, Last-Modified 비교)
- [ ] T127 증분 업데이트 로직 (변경된 페이지만 재크롤링)
- [ ] T128 크롤링 완료 시 CrawlLog 업데이트 (status='success', duration)
- [ ] T129 크롤링 실패 시 재시도 로직 (3회, 지수 백오프)
- [ ] T130 3회 실패 시 is_stale=true 설정 및 알림

### 임베딩 자동 재생성

- [ ] T131 크롤링 후 변경된 콘텐츠 임베딩 재생성 트리거
- [ ] T132 기존 임베딩 삭제 로직 (CASCADE로 자동 삭제되지만 명시적 확인)
- [ ] T133 새 임베딩 생성 및 저장
- [ ] T134 임베딩 생성 실패 시 에러 로깅 및 롤백

### 스케줄러 통합

- [ ] T135 APScheduler에 크롤링 작업 등록 (5분 주기)
- [ ] T136 FastAPI 앱 시작 시 스케줄러 자동 시작
- [ ] T137 앱 종료 시 스케줄러 graceful shutdown

---

## Phase 8: 피드백 시스템

**목적**: 답변 만족도 수집 (SC-003: 70% 만족도 측정)

### 피드백 데이터 모델

- [ ] T138 피드백 테이블 생성 (`feedback` - session_id, message_index, rating, comment)
- [ ] T139 Feedback Pydantic 모델 정의 (`backend/src/models/feedback.py`)

### 피드백 API

- [ ] T140 POST /api/v1/qa/feedback 엔드포인트 구현 (`backend/src/api/routes/qa.py`)
- [ ] T141 피드백 저장 로직 (PostgreSQL INSERT)
- [ ] T142 피드백 집계 쿼리 (만족도 비율 계산)

### 프론트엔드 피드백 UI

- [ ] T143 답변별 피드백 버튼 컴포넌트 생성 (👍/👎)
- [ ] T144 피드백 제출 API 호출
- [ ] T145 피드백 후 UI 상태 업데이트 (제출 완료 표시)

---

## Phase 9: 모니터링 및 로깅

**목적**: Prometheus 메트릭 및 Grafana 대시보드 (헌법 Observability 준수)

### Prometheus 메트릭

- [ ] T146 [P] prometheus_client 라이브러리 통합 (`backend/src/monitoring/metrics.py`)
- [ ] T147 [P] qa_request_duration_seconds 히스토그램 정의
- [ ] T148 [P] qa_request_total 카운터 정의 (성공/실패)
- [ ] T149 [P] vector_search_latency_seconds 히스토그램 정의
- [ ] T150 [P] crawler_success_total 카운터 정의
- [ ] T151 [P] session_active_count 게이지 정의
- [ ] T152 GET /metrics 엔드포인트 노출 (`backend/src/api/main.py`)

### 구조화 로깅 강화

- [ ] T153 [P] 주요 함수에 로그 추가 (session_id, question, latency, confidence_score)
- [ ] T154 [P] 에러 로그 상세화 (스택 트레이스, 컨텍스트)
- [ ] T155 [P] 로그 레벨 환경 변수 설정 (DEBUG/INFO/WARNING/ERROR)

### Grafana 대시보드

- [ ] T156 Grafana 설정 파일 생성 (`monitoring/grafana/dashboard.json`)
- [ ] T157 응답 시간 그래프 추가
- [ ] T158 요청 성공률 그래프 추가
- [ ] T159 크롤링 성공률 그래프 추가
- [ ] T160 활성 세션 수 그래프 추가

---

## Phase 10: 보안 강화

**목적**: 헌법 Principle V (Security & Privacy) 완전 준수

### 입력 검증 강화

- [ ] T161 [P] bleach 라이브러리로 HTML 태그 제거 강화
- [ ] T162 [P] SQL 키워드 패턴 감지 로직 추가 (추가 방어층)
- [ ] T163 [P] 질문 길이 제한 엄격 적용 (500자)

### 보안 헤더

- [ ] T164 [P] Content Security Policy (CSP) 헤더 설정
- [ ] T165 [P] HSTS 헤더 설정
- [ ] T166 [P] X-Frame-Options 헤더 설정
- [ ] T167 [P] X-Content-Type-Options 헤더 설정

### Rate Limiting 세밀화

- [ ] T168 IP별 Rate Limit (분당 60 요청) 검증
- [ ] T169 세션별 Rate Limit 추가 (시간당 200 요청)
- [ ] T170 Rate Limit 초과 시 429 응답 및 Retry-After 헤더

---

## Phase 11: 테스트 (선택사항 - 요청 시 구현)

**목적**: 코드 품질 및 신뢰성 검증

### 유닛 테스트

- [ ] T171 [P] 언어 감지 함수 테스트 (`backend/tests/unit/test_language_detector.py`)
- [ ] T172 [P] 청킹 함수 테스트 (`backend/tests/unit/test_chunker.py`)
- [ ] T173 [P] 세션 서비스 테스트 (`backend/tests/unit/test_session_service.py`)
- [ ] T174 [P] QA 서비스 테스트 (모킹 사용)

### 통합 테스트

- [ ] T175 [P] 크롤링 → 임베딩 생성 플로우 테스트 (`backend/tests/integration/test_crawler.py`)
- [ ] T176 [P] 질문 → 벡터 검색 → 답변 생성 플로우 테스트 (`backend/tests/integration/test_qa_flow.py`)
- [ ] T177 [P] 세션 생성 → 메시지 추가 → 조회 플로우 테스트

### API 계약 테스트

- [ ] T178 [P] POST /api/v1/qa/ask OpenAPI 스펙 검증 (`backend/tests/contract/test_api.py`)
- [ ] T179 [P] GET /api/v1/qa/sessions/{session_id} 스펙 검증
- [ ] T180 [P] POST /api/v1/qa/feedback 스펙 검증

### E2E 테스트

- [ ] T181 Playwright 설정 (`frontend/tests/e2e/setup.ts`)
- [ ] T182 질문 입력 → 답변 표시 E2E 테스트 (`frontend/tests/e2e/qa-flow.spec.ts`)
- [ ] T183 언어 전환 E2E 테스트
- [ ] T184 대화 이력 E2E 테스트

---

## Phase 12: 배포 준비

**목적**: 프로덕션 환경 배포

### Docker 이미지

- [ ] T185 백엔드 Dockerfile 작성 (`backend/Dockerfile`)
- [ ] T186 프론트엔드 Dockerfile 작성 (`frontend/Dockerfile`)
- [ ] T187 Docker 이미지 빌드 테스트
- [ ] T188 Docker Compose 프로덕션 파일 작성 (`docker-compose.prod.yml`)

### Kubernetes 설정

- [ ] T189 [P] PostgreSQL Deployment YAML 작성 (`k8s/postgres-deployment.yaml`)
- [ ] T190 [P] Redis Deployment YAML 작성 (`k8s/redis-deployment.yaml`)
- [ ] T191 [P] 백엔드 Deployment YAML 작성 (`k8s/backend-deployment.yaml`)
- [ ] T192 [P] 프론트엔드 Deployment YAML 작성 (`k8s/frontend-deployment.yaml`)
- [ ] T193 [P] Service YAML 파일 작성 (백엔드, 프론트엔드 로드밸런서)
- [ ] T194 [P] ConfigMap 작성 (환경 변수)
- [ ] T195 [P] Secret 작성 (API 키, DB 비밀번호)

### CI/CD 파이프라인

- [ ] T196 GitHub Actions 워크플로우 작성 (`.github/workflows/ci.yml`)
- [ ] T197 린트 및 테스트 단계 추가
- [ ] T198 Docker 이미지 빌드 및 ECR 푸시 단계
- [ ] T199 Kubernetes 배포 단계 (kubectl apply)
- [ ] T200 E2E 테스트 단계 (프로덕션 환경)

---

## Phase 13: 문서화 및 Polish

**목적**: 개발자 온보딩 및 유지보수 용이성

### API 문서

- [ ] T201 [P] FastAPI 자동 생성 문서 확인 및 개선 (`/docs` 엔드포인트)
- [ ] T202 [P] OpenAPI 스펙 최종 검증 (`contracts/api-spec.yaml`)
- [ ] T203 [P] API 사용 예시 README 작성 (`backend/docs/API_EXAMPLES.md`)

### 개발자 가이드

- [ ] T204 [P] 백엔드 개발 가이드 작성 (`backend/docs/DEVELOPMENT.md`)
- [ ] T205 [P] 프론트엔드 개발 가이드 작성 (`frontend/docs/DEVELOPMENT.md`)
- [ ] T206 [P] 크롤러 확장 가이드 작성 (`backend/docs/CRAWLER.md`)
- [ ] T207 [P] 모니터링 설정 가이드 작성 (`monitoring/README.md`)

### 코드 정리

- [ ] T208 [P] 미사용 코드 제거
- [ ] T209 [P] TODO 주석 해결 또는 이슈 등록
- [ ] T210 [P] 타입 힌트 누락 부분 추가
- [ ] T211 [P] Docstring 누락 함수 문서화

### 성능 최적화

- [ ] T212 pgvector HNSW 인덱스 파라미터 튜닝 (m, ef_construction)
- [ ] T213 Redis 메모리 사용량 모니터링 및 최적화
- [ ] T214 FastAPI 워커 수 조정 (CPU 코어 수 기반)
- [ ] T215 프론트엔드 번들 크기 분석 및 최적화 (Next.js Bundle Analyzer)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 의존성 없음 - 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 - **모든 사용자 스토리 차단**
- **User Stories (Phase 3-6)**: Foundational 완료 후
  - 사용자 스토리는 병렬 진행 가능 (팀 리소스 있으면)
  - 또는 우선순위 순서로 순차 진행 (P1 → P2 → P3 → P4)
- **크롤링 자동화 (Phase 7)**: Foundational 완료 후, US1과 병렬 가능
- **피드백 시스템 (Phase 8)**: US1 완료 후
- **모니터링 (Phase 9)**: 언제든지 추가 가능 (병렬)
- **보안 강화 (Phase 10)**: Foundational 완료 후 언제든지
- **테스트 (Phase 11)**: 각 스토리 구현과 병렬 가능 (선택사항)
- **배포 준비 (Phase 12)**: 원하는 스토리 완료 후
- **문서화 (Phase 13)**: 최종 단계

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 완료 후 - 다른 스토리 의존성 없음
- **User Story 2 (P2)**: Foundational 완료 후 - US1과 독립적 (하지만 US1 위에 추가 레이어)
- **User Story 3 (P3)**: Foundational 완료 후 - US1/US2와 독립적
- **User Story 4 (P4)**: Foundational 완료 후 - US1/US2/US3와 독립적

### Within Each User Story

- 언어 감지 → 벡터 검색 → 답변 생성 (순차)
- 프론트엔드 컴포넌트는 API 완성 후
- 샘플 데이터는 스토리 테스트 전

### Parallel Opportunities

#### Setup Phase (병렬 가능)
```bash
T006 (프론트엔드 Next.js 초기화)
T007 (프론트엔드 의존성)
T009 (Docker Compose)
T010 (.gitignore)
T012 (백엔드 테스트 디렉토리)
T013 (프론트엔드 디렉토리 구조)
```

#### Foundational Phase (병렬 가능)
```bash
# Pydantic 모델 (모두 독립적)
T028, T029, T030, T031, T032, T033

# DB 연결 및 설정
T020 (config.py)
T021 (postgres.py)
T022 (redis.py)
T024 (middleware.py)
T025 (rate limiting)
T026 (보안 미들웨어)
T027 (로깅)
```

#### User Story 1 (병렬 가능)
```bash
# 노드 구현 (독립적)
T052 (상태 정의)
T053 (언어 감지 노드)
T054 (문서 검색 노드)
T055 (답변 생성 노드)
T056 (신뢰도 평가 노드)

# 프론트엔드 (독립적)
T071 (API 클라이언트)
T072 (타입 정의)
```

---

## Implementation Strategy

### MVP First (User Story 1만)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료 (**CRITICAL - 모든 스토리 차단**)
3. Phase 3: User Story 1 완료
4. **STOP and VALIDATE**: US1 독립 테스트
5. 배포/데모 준비

**예상 작업량**: ~80 tasks (T001-T080)

### Incremental Delivery (점진적 기능 추가)

1. Setup + Foundational → Foundation 완료
2. User Story 1 추가 → 독립 테스트 → 배포/데모 (**MVP!**)
3. User Story 2 추가 → 독립 테스트 → 배포/데모
4. User Story 3 추가 → 독립 테스트 → 배포/데모
5. User Story 4 추가 → 독립 테스트 → 배포/데모
6. 각 스토리는 이전 스토리를 깨뜨리지 않고 가치 추가

### Parallel Team Strategy (병렬 팀 전략)

여러 개발자가 있다면:

1. 팀 전체가 Setup + Foundational 함께 완료
2. Foundational 완료 후:
   - **Developer A**: User Story 1 (T049-T080)
   - **Developer B**: User Story 2 (T081-T093)
   - **Developer C**: User Story 3 (T094-T111)
   - **Developer D**: 크롤링 자동화 (T124-T137)
3. 스토리들이 독립적으로 완성되고 통합됨

---

## 작업 통계

### 총 작업 수

- **Setup**: 13 tasks (T001-T013)
- **Foundational**: 35 tasks (T014-T048)
- **User Story 1**: 32 tasks (T049-T080)
- **User Story 2**: 13 tasks (T081-T093)
- **User Story 3**: 18 tasks (T094-T111)
- **User Story 4**: 12 tasks (T112-T123)
- **크롤링 자동화**: 14 tasks (T124-T137)
- **피드백 시스템**: 8 tasks (T138-T145)
- **모니터링**: 15 tasks (T146-T160)
- **보안 강화**: 10 tasks (T161-T170)
- **테스트**: 14 tasks (T171-T184)
- **배포 준비**: 16 tasks (T185-T200)
- **문서화**: 15 tasks (T201-T215)

**총계**: **215 tasks**

### 사용자 스토리별 작업 수

- **US1 (P1)**: 32 tasks - **MVP 핵심**
- **US2 (P2)**: 13 tasks - 다국어 지원
- **US3 (P3)**: 18 tasks - 대화 이력
- **US4 (P4)**: 12 tasks - 능동적 제안

### 병렬 실행 가능 작업

- Setup: **7개** 병렬 가능
- Foundational: **15개** 병렬 가능
- US1: **10개** 병렬 가능
- US2: **6개** 병렬 가능
- US3: **8개** 병렬 가능
- US4: **4개** 병렬 가능

---

## MVP Scope 권장사항

**최소 MVP**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (US1)
- **작업 수**: 80 tasks
- **기능**: 기본 Q&A (한국어/영어 혼재 가능, 단일 질문)
- **예상 소요 시간**: 2-3주 (1명 개발자 기준)

**확장 MVP**: 위 + Phase 4 (US2)
- **작업 수**: 93 tasks
- **기능**: 완전한 다국어 지원
- **예상 소요 시간**: 3-4주

**풀 MVP**: 위 + Phase 5 (US3) + Phase 6 (US4)
- **작업 수**: 123 tasks
- **기능**: 모든 핵심 사용자 스토리
- **예상 소요 시간**: 5-6주

---

## Notes

- **[P] 표시**: 다른 파일, 의존성 없음 → 병렬 실행 가능
- **[Story] 라벨**: 특정 사용자 스토리에 매핑 → 추적 용이
- 각 사용자 스토리는 독립적으로 완성 및 테스트 가능
- 각 Checkpoint에서 스토리 독립 검증
- 커밋은 작업 또는 논리적 그룹 단위로 수행
- 스토리 간 의존성을 깨는 교차 종속성 피하기

---

## 다음 단계

작업 목록이 준비되었습니다! 이제 선택할 수 있습니다:

1. **`/speckit.implement`** - Phase별 구현 시작
2. **`/speckit.analyze`** - 명세서 간 일관성 분석
3. **직접 구현 시작** - 이 tasks.md를 참고하여 T001부터 순차 진행

**권장 시작점**: T001 (백엔드 디렉토리 생성)부터 순서대로 진행! 🚀
