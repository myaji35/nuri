# 구현 계획: LangGraph 기반 지능형 Q&A 시스템

**Branch**: `001-langgraph-qa-system` | **Date**: 2025-11-19 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-langgraph-qa-system/spec.md`

## 요약

NURI 홈페이지 콘텐츠를 지식 베이스로 활용하여 방문자의 자연어 질문에 능동적으로 답변하는 LangGraph 기반 대화형 Q&A 시스템을 구축합니다.

**핵심 기능**:
- 한국어/영어 자동 감지 및 동일 언어 응답
- 3초 이내 답변 생성 (RAG 패턴)
- 대화 이력 기반 맥락 유지
- 5분마다 홈페이지 콘텐츠 자동 크롤링 및 지식 베이스 갱신
- 능동적 관련 질문 제안 (최대 3개)

**기술 접근**:
- LangGraph로 상태 기반 에이전트 워크플로우 구축
- 검색 증강 생성(RAG): 벡터 임베딩 + 시맨틱 검색
- 5분 주기 크롤러로 홈페이지 콘텐츠 수집 및 임베딩 생성
- 세션 기반 대화 이력 관리

## 기술 컨텍스트

**Language/Version**: Python 3.11+
**Primary Dependencies**:
- LangGraph 0.2+ (에이전트 워크플로우)
- LangChain 0.3+ (LLM 통합 및 RAG 체인)
- OpenAI API (임베딩: text-embedding-3-small, LLM: gpt-4o-mini)
- FastAPI 0.110+ (백엔드 API 서버)
- Pydantic 2.0+ (데이터 검증)

**Storage**:
- PostgreSQL 15+ with pgvector extension (벡터 임베딩 저장)
- Redis 7+ (세션 캐시 및 대화 이력)

**Testing**:
- pytest 8.0+ (유닛 및 통합 테스트)
- pytest-asyncio (비동기 테스트)
- httpx (API 테스트 클라이언트)

**Target Platform**:
- 백엔드: Linux 서버 (Docker 컨테이너)
- 프론트엔드: Vercel (Next.js 배포)
- 데이터베이스: AWS RDS PostgreSQL 또는 Supabase

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- 응답 생성: p95 < 3초
- 동시 요청 처리: 100 req/s
- 벡터 검색 지연시간: < 200ms
- 크롤링 주기: 5분

**Constraints**:
- OpenAI API 비용 제한 (월 예산 내)
- 벡터 DB 크기: 초기 ~10,000 청크 (50-100 페이지)
- 세션 TTL: 30분 비활성 타임아웃
- WCAG 2.1 AA 준수 (헌법 Principle II)
- XSS/CSRF 보호 필수 (헌법 Principle V)

**Scale/Scope**:
- 예상 일일 활성 사용자: 500-1,000명
- 동시 활성 세션: 최대 100개
- 지식 베이스: 50-100 페이지 (초기), 향후 확장 가능
- 지원 언어: 한국어, 영어

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 검증

✅ **Principle II - Accessibility & Inclusive Design**
- 다국어 지원 (한국어/영어) 필수 → FR-003으로 명시됨
- 키보드 네비게이션 및 스크린 리더 지원 → 프론트엔드 설계 시 적용

✅ **Principle IV - Component Modularity & Testability**
- LangGraph 에이전트, 크롤러, 벡터 검색 모듈 독립적으로 테스트 가능
- 의존성 주입 패턴 사용 (FastAPI DI)

✅ **Principle V - Security & Privacy by Default**
- FR-007: XSS/SQL 인젝션 차단
- 사용자 질문 익명화 저장 (Assumption #7)
- 환경 변수로 API 키 관리

⚠️ **Principle I - Performance-First** (Q&A 시스템은 3D 시각화와 무관하지만 성능 목표 설정)
- SC-001: 3초 이내 응답 → 성능 목표 명확

⚠️ **Principle VI - Responsive & Mobile-First Design**
- 프론트엔드 UI는 모바일 우선 설계 필요 (계획 단계에서 확인)

**결과**: 주요 헌법 원칙 준수. Phase 1 설계 후 재검증 필요.

## 프로젝트 구조

### Documentation (this feature)

```text
specs/001-langgraph-qa-system/
├── plan.md              # 이 파일 (/speckit.plan 명령어 출력)
├── research.md          # Phase 0 출력 (/speckit.plan 명령어)
├── data-model.md        # Phase 1 출력 (/speckit.plan 명령어)
├── quickstart.md        # Phase 1 출력 (/speckit.plan 명령어)
├── contracts/           # Phase 1 출력 (/speckit.plan 명령어)
│   └── api-spec.yaml    # OpenAPI 스펙
└── tasks.md             # Phase 2 출력 (/speckit.tasks 명령어 - 아직 생성 안 됨)
```

### Source Code (repository root)

```text
# Web application 구조 (프론트엔드 + 백엔드)

backend/
├── src/
│   ├── agents/               # LangGraph 에이전트 정의
│   │   ├── qa_agent.py       # Q&A 에이전트 그래프
│   │   ├── nodes.py          # 에이전트 노드 함수들
│   │   └── state.py          # 에이전트 상태 정의
│   ├── crawlers/             # 홈페이지 크롤러
│   │   ├── web_crawler.py    # 크롤링 로직
│   │   └── scheduler.py      # 5분 주기 스케줄러
│   ├── embeddings/           # 임베딩 생성 및 벡터 저장
│   │   ├── generator.py      # OpenAI 임베딩 생성
│   │   └── vector_store.py   # pgvector 연동
│   ├── models/               # Pydantic 모델
│   │   ├── session.py        # ConversationSession
│   │   ├── question.py       # Question
│   │   ├── answer.py         # Answer
│   │   ├── knowledge.py      # KnowledgeSource
│   │   └── suggestion.py     # SuggestedQuestion
│   ├── services/             # 비즈니스 로직
│   │   ├── qa_service.py     # Q&A 처리 서비스
│   │   ├── session_service.py # 세션 관리
│   │   └── language_detector.py # 언어 감지
│   ├── api/                  # FastAPI 라우터
│   │   ├── main.py           # FastAPI 앱 진입점
│   │   ├── routes/
│   │   │   ├── qa.py         # /api/qa 엔드포인트
│   │   │   └── health.py     # /api/health
│   │   └── middleware.py     # CORS, 보안 미들웨어
│   ├── db/                   # 데이터베이스 연결
│   │   ├── postgres.py       # PostgreSQL 연결
│   │   └── redis.py          # Redis 연결
│   └── config.py             # 환경 변수 설정
├── tests/
│   ├── unit/                 # 유닛 테스트
│   │   ├── test_agents.py
│   │   ├── test_services.py
│   │   └── test_embeddings.py
│   ├── integration/          # 통합 테스트
│   │   ├── test_qa_flow.py
│   │   └── test_crawler.py
│   └── contract/             # API 계약 테스트
│       └── test_api.py
├── requirements.txt          # Python 의존성
└── Dockerfile               # 백엔드 컨테이너

frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── [lang]/           # 다국어 라우팅
│   │   │   ├── qa/           # Q&A 페이지
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── api/              # API 프록시 (선택사항)
│   ├── components/           # React 컴포넌트
│   │   ├── QAInterface.tsx   # 질문 입력 및 답변 표시
│   │   ├── ChatHistory.tsx   # 대화 이력
│   │   └── SuggestedQuestions.tsx # 제안 질문
│   ├── lib/                  # 유틸리티
│   │   ├── api-client.ts     # 백엔드 API 호출
│   │   └── i18n.ts           # react-i18next 설정
│   └── types/                # TypeScript 타입
│       └── qa.ts             # Q&A 관련 타입
├── tests/
│   └── e2e/                  # E2E 테스트 (Playwright)
│       └── qa-flow.spec.ts
├── package.json
└── next.config.ts
```

**Structure Decision**: Web application 구조를 선택했습니다.
- **백엔드**: Python/FastAPI로 LangGraph 에이전트 및 RAG 파이프라인 구현
- **프론트엔드**: Next.js로 사용자 인터페이스 및 다국어 지원 구현
- 기존 NURI 플랫폼(`nuri-app/`)과 분리된 독립 서비스로 배포 가능

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

헌법 위반 사항 없음. 모든 원칙 준수.
