# 기술 조사: LangGraph 기반 Q&A 시스템

**Date**: 2025-11-19
**Feature**: 001-langgraph-qa-system

## 개요

NURI 홈페이지 콘텐츠를 지식 베이스로 활용하는 대화형 Q&A 시스템 구축을 위한 기술 스택 및 아키텍처 패턴 조사.

---

## 1. LangGraph 에이전트 아키텍처

### 결정사항
**LangGraph StateGraph** 패턴을 사용하여 Q&A 에이전트 워크플로우 구축

### 근거
- **상태 기반 워크플로우**: 대화 이력, 검색 결과, 언어 감지 등 복잡한 상태 관리 필요
- **조건부 분기**: 신뢰도 임계값에 따라 답변/재검색/명확화 요청 분기
- **재시도 로직**: LLM 실패 시 자동 재시도 및 폴백 전략

### LangGraph 노드 구조

```python
from langgraph.graph import StateGraph, END

# 상태 정의
class QAState(TypedDict):
    question: str
    detected_language: str
    chat_history: List[Message]
    retrieved_docs: List[Document]
    answer: str
    suggested_questions: List[str]
    confidence_score: float

# 노드 함수
async def detect_language_node(state: QAState) -> QAState:
    # langdetect 또는 OpenAI로 언어 감지
    pass

async def retrieve_documents_node(state: QAState) -> QAState:
    # pgvector에서 top-k 문서 검색
    pass

async def generate_answer_node(state: QAState) -> QAState:
    # OpenAI로 답변 생성 (RAG)
    pass

async def suggest_questions_node(state: QAState) -> QAState:
    # 관련 질문 3개 생성
    pass

def should_answer(state: QAState) -> str:
    # 신뢰도 > 0.7이면 answer, 아니면 clarify
    return "answer" if state["confidence_score"] > 0.7 else "clarify"

# 그래프 구성
graph = StateGraph(QAState)
graph.add_node("detect_language", detect_language_node)
graph.add_node("retrieve_docs", retrieve_documents_node)
graph.add_node("generate_answer", generate_answer_node)
graph.add_node("suggest_questions", suggest_questions_node)

graph.set_entry_point("detect_language")
graph.add_edge("detect_language", "retrieve_docs")
graph.add_conditional_edges(
    "retrieve_docs",
    should_answer,
    {"answer": "generate_answer", "clarify": END}
)
graph.add_edge("generate_answer", "suggest_questions")
graph.add_edge("suggest_questions", END)

qa_agent = graph.compile()
```

### 고려한 대안
- **LangChain LCEL만 사용**: 조건부 분기 및 복잡한 상태 관리가 어려움
- **순수 Python 함수**: 재시도, 로깅, 모니터링 등 직접 구현 필요

---

## 2. 벡터 DB 선택

### 결정사항
**PostgreSQL with pgvector extension**

### 근거
1. **기존 인프라 활용**: NURI 플랫폼이 이미 PostgreSQL + PostGIS 사용 중 (헌법 Technology Standards)
2. **운영 단순화**: 별도 벡터 DB 서버 불필요, 기존 백업/복구 프로세스 재사용
3. **성능**: 10,000 벡터 규모에서 pgvector 성능 충분 (HNSW 인덱스 사용 시 <200ms 검색 가능)
4. **비용 효율**: 추가 라이선스 비용 없음

### pgvector 설정

```sql
-- Extension 설치
CREATE EXTENSION IF NOT EXISTS vector;

-- 임베딩 테이블
CREATE TABLE knowledge_embeddings (
    id SERIAL PRIMARY KEY,
    knowledge_source_id INTEGER REFERENCES knowledge_sources(id),
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI text-embedding-3-small 차원
    language VARCHAR(2) NOT NULL,  -- 'ko' or 'en'
    created_at TIMESTAMP DEFAULT NOW()
);

-- HNSW 인덱스 (빠른 ANN 검색)
CREATE INDEX ON knowledge_embeddings
USING hnsw (embedding vector_cosine_ops);
```

### 고려한 대안
- **Pinecone**: SaaS 비용 발생, 데이터 주권 문제
- **Weaviate**: 별도 서버 운영 필요, 초기 규모에 과도
- **Chroma**: 로컬 개발용 적합, 프로덕션 확장성 검증 부족

---

## 3. 임베딩 모델 선택

### 결정사항
**OpenAI text-embedding-3-small** (1536 차원)

### 근거
1. **비용 효율**: text-embedding-3-large 대비 80% 저렴, 성능 차이 <5%
2. **다국어 지원**: 한국어/영어 모두 우수한 성능
3. **검색 품질**: MTEB 벤치마크 상위권 (한국어: 70+ score)
4. **짧은 지연시간**: 배치 요청 시 100ms 이내

### 임베딩 생성 전략

```python
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_embeddings(texts: List[str]) -> List[List[float]]:
    # 배치 처리 (최대 2048 텍스트)
    response = await client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
        encoding_format="float"
    )
    return [item.embedding for item in response.data]
```

### 청킹 전략
- **Chunk Size**: 512 토큰 (약 2000자)
- **Overlap**: 50 토큰 (문맥 유지)
- **분할 기준**: 문단 경계 우선, 길이 초과 시 문장 단위 분할

### 고려한 대안
- **Cohere Embed**: 영어 성능 우수하나 한국어 지원 약함
- **sentence-transformers (오픈소스)**: 한국어 모델 부족, API 비용 절감 효과 미미

---

## 4. LLM 선택

### 결정사항
**OpenAI gpt-4o-mini** (답변 생성), **gpt-4o** (복잡한 명확화 요청)

### 근거
1. **gpt-4o-mini**:
   - 비용: gpt-4o 대비 90% 저렴
   - 속도: p95 < 2초 응답 (3초 목표 충족)
   - 품질: 간단한 Q&A에 충분한 정확도
2. **gpt-4o** (폴백):
   - 복잡한 질문 또는 신뢰도 < 0.5일 때 사용
   - 더 정확한 명확화 질문 생성

### 프롬프트 템플릿

```python
ANSWER_PROMPT_KO = """당신은 NURI 스마트팜 플랫폼의 친절한 Q&A 어시스턴트입니다.

사용자 질문: {question}

관련 문서:
{context}

대화 이력:
{chat_history}

위 문서를 바탕으로 질문에 답변하세요. 문서에 정보가 없으면 "요청하신 정보는 현재 홈페이지에 포함되어 있지 않습니다"라고 명확히 알려주세요.
답변 시 출처를 명시하세요 (예: "홈페이지의 '회사 소개' 섹션에 따르면...").
"""

ANSWER_PROMPT_EN = """You are a helpful Q&A assistant for the NURI Smart Farm platform.

User question: {question}

Relevant documents:
{context}

Conversation history:
{chat_history}

Answer the question based on the documents above. If the information is not available in the documents, clearly state "The requested information is not currently available on our website."
Cite your sources when answering (e.g., "According to the 'About Us' section...").
"""
```

### 고려한 대안
- **Claude 3.5 Sonnet**: 한국어 성능 우수하나 비용 높음, API 지역 제한
- **Gemini 1.5 Pro**: 무료 티어 매력적이나 속도 느림 (p95 > 4초)

---

## 5. 크롤링 전략

### 결정사항
**Scrapy + APScheduler** (5분 주기)

### 근거
1. **Scrapy**: 강력한 크롤링 프레임워크, robots.txt 준수, 중복 제거
2. **APScheduler**: Python 네이티브 스케줄러, cron 대비 관리 용이
3. **증분 업데이트**: 변경된 페이지만 재크롤링 (ETag/Last-Modified 활용)

### 크롤러 구현

```python
import scrapy
from apscheduler.schedulers.asyncio import AsyncIOScheduler

class NuriCrawler(scrapy.Spider):
    name = "nuri_crawler"
    allowed_domains = ["nuri-platform.com"]  # 실제 도메인으로 교체
    start_urls = ["https://nuri-platform.com/"]

    def parse(self, response):
        # 텍스트 추출 (BeautifulSoup 사용)
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # 메타데이터
        title = soup.find('title').text
        meta_desc = soup.find('meta', {'name': 'description'})

        # 본문 (article, main, div.content 등)
        content = ' '.join([p.text for p in soup.find_all(['p', 'h1', 'h2', 'h3'])])

        # 언어 감지 (URL 또는 html lang 속성)
        language = response.url.split('/')[3] if len(response.url.split('/')) > 3 else 'ko'

        yield {
            'url': response.url,
            'title': title,
            'content': content,
            'language': language,
            'last_modified': response.headers.get('Last-Modified'),
        }

        # 내부 링크 재귀 크롤링
        for link in response.css('a::attr(href)').getall():
            yield response.follow(link, self.parse)

# 스케줄러
scheduler = AsyncIOScheduler()
scheduler.add_job(run_crawler, 'interval', minutes=5)
```

### 크롤링 실패 처리
- **재시도**: 3회 (지수 백오프: 1분, 2분, 4분)
- **알림**: 3회 실패 시 Slack/이메일 알림
- **폴백**: 마지막 성공 크롤링 데이터 유지 (stale 플래그 설정)

### 고려한 대안
- **BeautifulSoup만 사용**: 중복 제거, 재시도 로직 직접 구현 필요
- **Playwright/Selenium**: JavaScript 렌더링 필요 시 사용 (NURI 플랫폼은 SSR이므로 불필요)

---

## 6. 세션 관리

### 결정사항
**Redis** (30분 TTL)

### 근거
1. **빠른 읽기/쓰기**: In-memory, <10ms 지연시간
2. **TTL 자동 만료**: 30분 비활성 세션 자동 삭제
3. **확장성**: Redis Cluster로 수평 확장 가능

### 세션 데이터 구조

```python
# Redis Key: session:{session_id}
{
    "session_id": "uuid-v4",
    "language": "ko",
    "created_at": "2025-11-19T10:00:00Z",
    "last_activity": "2025-11-19T10:15:00Z",
    "messages": [
        {
            "role": "user",
            "content": "NURI가 뭐예요?",
            "timestamp": "2025-11-19T10:00:00Z"
        },
        {
            "role": "assistant",
            "content": "NURI는 스마트팜과 장애인 고용 통합을 추구하는...",
            "timestamp": "2025-11-19T10:00:05Z",
            "sources": ["https://nuri.com/about"]
        }
    ]
}
```

### 고려한 대안
- **PostgreSQL 세션 테이블**: 디스크 I/O 병목, 수동 정리 cron job 필요
- **JWT 토큰**: 클라이언트 저장 시 크기 제한 (대화 이력 길어지면 초과)

---

## 7. 언어 감지

### 결정사항
**langdetect** 라이브러리 + OpenAI 폴백

### 근거
1. **langdetect**: 빠르고 가벼움 (<100ms), 한국어/영어 95%+ 정확도
2. **OpenAI 폴백**: 혼용 질문("What is 스마트팜?") 처리 시 LLM으로 주 언어 판별

```python
from langdetect import detect

def detect_language(text: str) -> str:
    try:
        lang = detect(text)
        return 'ko' if lang == 'ko' else 'en'
    except:
        # 폴백: OpenAI로 판별
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Detect language (ko/en): {text}"}],
            max_tokens=5
        )
        return response.choices[0].message.content.strip()
```

### 고려한 대안
- **fastText**: 정확도 높으나 모델 크기 큼 (150MB)
- **OpenAI만 사용**: 모든 요청에 API 호출 비용 발생

---

## 8. 보안 및 입력 검증

### 결정사항
**Pydantic + SQL Parameterization + Rate Limiting**

### 근거
1. **Pydantic**: FastAPI 네이티브 검증, 타입 안전성
2. **SQL 파라미터화**: SQLAlchemy ORM 사용으로 SQL 인젝션 자동 방지
3. **Rate Limiting**: slowapi (IP 기반: 분당 60 요청)

```python
from pydantic import BaseModel, Field, validator
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    session_id: Optional[str] = None

    @validator('question')
    def validate_question(cls, v):
        # XSS 방지: HTML 태그 제거
        import bleach
        clean = bleach.clean(v, strip=True)

        # SQL 키워드 패턴 감지 (추가 방어)
        dangerous_patterns = ['DROP', 'DELETE', 'UPDATE', 'INSERT', '<script']
        if any(pattern in clean.upper() for pattern in dangerous_patterns):
            raise ValueError("Invalid input detected")

        return clean

@app.post("/api/qa")
@limiter.limit("60/minute")
async def qa_endpoint(request: QuestionRequest):
    pass
```

---

## 9. 모니터링 및 로깅

### 결정사항
**Prometheus + Grafana + Structured Logging (structlog)**

### 근거
1. **Prometheus**: 표준 메트릭 수집 (응답 시간, 에러율, 크롤링 성공률)
2. **Grafana**: 시각화 대시보드 (헌법 Observability 원칙)
3. **structlog**: JSON 구조화 로그, ELK 스택 연동 가능

```python
import structlog

logger = structlog.get_logger()

# 사용 예
logger.info(
    "answer_generated",
    session_id=session_id,
    question=question[:50],
    answer_length=len(answer),
    confidence_score=confidence,
    latency_ms=latency,
    language=language
)
```

### 주요 메트릭
- **qa_request_duration_seconds**: 응답 시간 히스토그램
- **qa_request_total**: 요청 수 카운터 (상태별: success/error)
- **vector_search_latency_seconds**: 벡터 검색 지연시간
- **crawler_success_total**: 크롤링 성공/실패 카운터
- **session_active_count**: 활성 세션 수

---

## 10. 배포 전략

### 결정사항
**Docker Compose (개발/스테이징) + Kubernetes (프로덕션)**

### 근거
1. **Docker Compose**: 로컬 개발 환경 빠른 구축
2. **Kubernetes**: 수평 확장, 무중단 배포, 헬스체크

```yaml
# docker-compose.yml (개발)
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/nuri_qa
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: ankane/pgvector:latest
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

volumes:
  pgdata:
```

### CI/CD 파이프라인
1. GitHub Actions: 테스트 + 린트
2. Docker 이미지 빌드 + ECR 푸시
3. Kubernetes 배포 (Helm chart)
4. E2E 테스트 (프로덕션 환경)

---

## 요약

| 카테고리 | 선택 기술 | 주요 근거 |
|---------|---------|---------|
| 에이전트 프레임워크 | LangGraph StateGraph | 상태 기반 워크플로우, 조건부 분기 |
| 벡터 DB | PostgreSQL + pgvector | 기존 인프라 활용, 운영 단순화 |
| 임베딩 | OpenAI text-embedding-3-small | 비용 효율, 다국어 지원 |
| LLM | gpt-4o-mini + gpt-4o (폴백) | 속도/비용 균형 |
| 크롤러 | Scrapy + APScheduler | 5분 주기 자동화, 증분 업데이트 |
| 세션 저장소 | Redis (30분 TTL) | 빠른 읽기/쓰기, 자동 만료 |
| 언어 감지 | langdetect + OpenAI 폴백 | 속도 우선, 혼용 질문 대응 |
| 보안 | Pydantic + Rate Limiting | 입력 검증, DDoS 방지 |
| 모니터링 | Prometheus + Grafana + structlog | 헌법 Observability 준수 |
| 배포 | Docker Compose + Kubernetes | 로컬 개발 + 프로덕션 확장성 |

**다음 단계**: Phase 1 - 데이터 모델 및 API 계약 정의
