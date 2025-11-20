# 데이터 모델: LangGraph 기반 Q&A 시스템

**Date**: 2025-11-19
**Feature**: 001-langgraph-qa-system

## 개요

Q&A 시스템의 핵심 엔티티 및 관계를 정의합니다. PostgreSQL (메인 데이터) + Redis (세션 캐시)를 사용합니다.

---

## 엔티티 다이어그램

```
┌─────────────────────┐
│ ConversationSession │
│  (Redis)            │
└─────────┬───────────┘
          │ 1
          │
          │ N
┌─────────┴───────────┐
│     Message         │
│  (Redis embedded)   │
└─────────────────────┘

┌─────────────────────┐
│  KnowledgeSource    │
│  (PostgreSQL)       │
└─────────┬───────────┘
          │ 1
          │
          │ N
┌─────────┴───────────┐
│ KnowledgeEmbedding  │
│  (PostgreSQL)       │
└─────────────────────┘

┌─────────────────────┐
│   CrawlLog          │
│  (PostgreSQL)       │
└─────────────────────┘
```

---

## 1. ConversationSession (Redis)

사용자의 대화 세션을 저장합니다. Redis에서 30분 TTL로 관리됩니다.

### 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `session_id` | UUID | ✅ | 세션 고유 식별자 (Primary Key) |
| `language` | String (2자) | ✅ | 감지된 언어 코드 ('ko' \| 'en') |
| `created_at` | DateTime (ISO 8601) | ✅ | 세션 생성 시간 |
| `last_activity` | DateTime (ISO 8601) | ✅ | 마지막 활동 시간 (TTL 갱신 기준) |
| `messages` | List[Message] | ✅ | 대화 메시지 목록 (최대 50개, 초과 시 FIFO) |

### Redis Key 구조

```
Key: session:{session_id}
TTL: 1800 seconds (30분)
```

### Validation Rules

- `session_id`: UUID v4 형식
- `language`: 'ko' 또는 'en'만 허용
- `messages`: 최대 50개 (초과 시 가장 오래된 메시지 자동 삭제)
- TTL: 매 활동마다 30분으로 갱신

### 예시 (JSON)

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "language": "ko",
  "created_at": "2025-11-19T10:00:00Z",
  "last_activity": "2025-11-19T10:15:30Z",
  "messages": [
    {
      "role": "user",
      "content": "NURI가 뭐예요?",
      "timestamp": "2025-11-19T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "NURI는 스마트팜과 장애인 고용 통합을 추구하는 글로벌 사회적 임팩트 스타트업입니다.",
      "timestamp": "2025-11-19T10:00:05Z",
      "sources": ["https://nuri-platform.com/about"],
      "confidence_score": 0.92
    }
  ]
}
```

---

## 2. Message (Embedded in ConversationSession)

대화 메시지 단위입니다. ConversationSession의 일부로 저장됩니다.

### 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `role` | Enum ('user' \| 'assistant') | ✅ | 메시지 발신자 |
| `content` | String | ✅ | 메시지 내용 (최대 2000자) |
| `timestamp` | DateTime (ISO 8601) | ✅ | 메시지 생성 시간 |
| `sources` | List[String] (URL) | ❌ | 답변 출처 (assistant만 해당) |
| `confidence_score` | Float (0.0~1.0) | ❌ | 답변 신뢰도 (assistant만 해당) |
| `suggested_questions` | List[String] | ❌ | 제안 질문 (assistant만 해당, 최대 3개) |

### Validation Rules

- `role`: 'user' 또는 'assistant'만 허용
- `content`: 1~2000자
- `sources`: URL 형식 검증 (정규식)
- `confidence_score`: 0.0 이상 1.0 이하
- `suggested_questions`: 각 질문 최대 200자, 최대 3개

---

## 3. KnowledgeSource (PostgreSQL)

홈페이지에서 크롤링한 콘텐츠의 원본을 저장합니다.

### 테이블 스키마

```sql
CREATE TABLE knowledge_sources (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('ko', 'en')),
    last_modified TIMESTAMP,
    crawled_at TIMESTAMP DEFAULT NOW(),
    is_stale BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_knowledge_sources_language ON knowledge_sources(language);
CREATE INDEX idx_knowledge_sources_url ON knowledge_sources(url);
CREATE INDEX idx_knowledge_sources_is_stale ON knowledge_sources(is_stale);
```

### 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `id` | Integer (Serial) | ✅ | Primary Key |
| `url` | String (500자) | ✅ | 페이지 URL (Unique) |
| `title` | String (500자) | ✅ | 페이지 제목 |
| `content` | Text | ✅ | 페이지 본문 (HTML 제거됨) |
| `language` | String (2자) | ✅ | 콘텐츠 언어 ('ko' \| 'en') |
| `last_modified` | DateTime | ❌ | 서버 응답 Last-Modified 헤더 |
| `crawled_at` | DateTime | ✅ | 마지막 크롤링 시간 |
| `is_stale` | Boolean | ✅ | 크롤링 실패 시 true (3회 연속 실패) |
| `metadata` | JSONB | ❌ | 추가 메타데이터 (예: meta description, keywords) |
| `created_at` | DateTime | ✅ | 레코드 생성 시간 |
| `updated_at` | DateTime | ✅ | 레코드 업데이트 시간 |

### Validation Rules

- `url`: URL 형식, 500자 이내, Unique
- `title`: 1~500자
- `content`: 1자 이상
- `language`: 'ko' 또는 'en'
- `is_stale`: 3회 연속 크롤링 실패 시 true

### Lifecycle

1. **생성**: 크롤러가 새 페이지 발견 시 INSERT
2. **업데이트**: 5분마다 크롤링 시 `last_modified` 비교 후 변경된 경우 UPDATE
3. **Stale 표시**: 크롤링 3회 연속 실패 시 `is_stale = true` (하지만 삭제하지 않음, 마지막 데이터 유지)

---

## 4. KnowledgeEmbedding (PostgreSQL with pgvector)

KnowledgeSource의 임베딩 벡터를 저장합니다. 시맨틱 검색에 사용됩니다.

### 테이블 스키마

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_embeddings (
    id SERIAL PRIMARY KEY,
    knowledge_source_id INTEGER REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,  -- 동일 소스 내 청크 순서
    chunk_text TEXT NOT NULL,  -- 청크 원본 텍스트 (512 토큰)
    embedding vector(1536) NOT NULL,  -- OpenAI text-embedding-3-small
    language VARCHAR(2) NOT NULL CHECK (language IN ('ko', 'en')),
    token_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(knowledge_source_id, chunk_index)
);

-- HNSW 인덱스 (cosine similarity 기반 ANN 검색)
CREATE INDEX idx_embeddings_vector ON knowledge_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_embeddings_language ON knowledge_embeddings(language);
CREATE INDEX idx_embeddings_knowledge_source_id ON knowledge_embeddings(knowledge_source_id);
```

### 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `id` | Integer (Serial) | ✅ | Primary Key |
| `knowledge_source_id` | Integer (FK) | ✅ | KnowledgeSource 참조 |
| `chunk_index` | Integer | ✅ | 청크 순서 (0부터 시작) |
| `chunk_text` | Text | ✅ | 청크 원본 텍스트 (최대 512 토큰 ≈ 2000자) |
| `embedding` | Vector(1536) | ✅ | 임베딩 벡터 |
| `language` | String (2자) | ✅ | 청크 언어 ('ko' \| 'en') |
| `token_count` | Integer | ✅ | 청크의 실제 토큰 수 |
| `created_at` | DateTime | ✅ | 임베딩 생성 시간 |

### Validation Rules

- `knowledge_source_id`: 유효한 KnowledgeSource 참조
- `chunk_index`: 0 이상, (knowledge_source_id, chunk_index) 조합 Unique
- `chunk_text`: 1~2000자
- `embedding`: 1536 차원 벡터
- `language`: 'ko' 또는 'en'
- `token_count`: 1~512

### Chunking Strategy

- **Size**: 512 토큰 (tiktoken 기준)
- **Overlap**: 50 토큰
- **분할 기준**: 문단(`\n\n`) 우선, 초과 시 문장(`.`, `!`, `?`) 단위 분할

### 검색 쿼리 예시

```sql
-- 한국어 질문에 대한 top-5 관련 문서 검색
SELECT
    ke.id,
    ke.chunk_text,
    ks.url,
    ks.title,
    1 - (ke.embedding <=> :query_embedding) AS similarity
FROM knowledge_embeddings ke
JOIN knowledge_sources ks ON ke.knowledge_source_id = ks.id
WHERE ke.language = 'ko'
  AND ks.is_stale = FALSE
ORDER BY ke.embedding <=> :query_embedding
LIMIT 5;
```

---

## 5. CrawlLog (PostgreSQL)

크롤링 작업 로그를 저장합니다. 운영 모니터링 및 디버깅에 사용됩니다.

### 테이블 스키마

```sql
CREATE TABLE crawl_logs (
    id SERIAL PRIMARY KEY,
    started_at TIMESTAMP NOT NULL,
    finished_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('running', 'success', 'failed')),
    pages_crawled INTEGER DEFAULT 0,
    pages_updated INTEGER DEFAULT 0,
    pages_failed INTEGER DEFAULT 0,
    error_message TEXT,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_crawl_logs_started_at ON crawl_logs(started_at);
CREATE INDEX idx_crawl_logs_status ON crawl_logs(status);
```

### 필드

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `id` | Integer (Serial) | ✅ | Primary Key |
| `started_at` | DateTime | ✅ | 크롤링 시작 시간 |
| `finished_at` | DateTime | ❌ | 크롤링 종료 시간 |
| `status` | Enum | ✅ | 상태 ('running' \| 'success' \| 'failed') |
| `pages_crawled` | Integer | ✅ | 크롤링한 총 페이지 수 |
| `pages_updated` | Integer | ✅ | 업데이트된 페이지 수 |
| `pages_failed` | Integer | ✅ | 실패한 페이지 수 |
| `error_message` | Text | ❌ | 오류 메시지 (실패 시) |
| `duration_seconds` | Integer | ❌ | 크롤링 소요 시간 (초) |
| `created_at` | DateTime | ✅ | 레코드 생성 시간 |

### Validation Rules

- `status`: 'running', 'success', 'failed' 중 하나
- `pages_crawled`, `pages_updated`, `pages_failed`: 0 이상
- `duration_seconds`: 양수

### Lifecycle

1. **시작**: 크롤러 시작 시 `status='running'` 레코드 생성
2. **완료**: 크롤링 완료 시 `status='success'`, `finished_at`, `duration_seconds` 업데이트
3. **실패**: 3회 재시도 후에도 실패 시 `status='failed'`, `error_message` 업데이트

---

## 엔티티 관계 요약

### PostgreSQL 관계

```
KnowledgeSource (1) ─── (N) KnowledgeEmbedding
```

- `KnowledgeSource` 삭제 시 연관된 `KnowledgeEmbedding` 자동 삭제 (CASCADE)

### Redis 관계

```
ConversationSession (1) ─── (N) Message (embedded)
```

- `Message`는 별도 테이블이 아닌 `ConversationSession`의 배열 필드

### 독립 엔티티

- `CrawlLog`: 다른 엔티티와 관계 없음 (순수 로그)

---

## 데이터 보존 정책

| 엔티티 | 보존 기간 | 정리 방법 |
|--------|---------|---------|
| `ConversationSession` | 30분 (비활성) | Redis TTL 자동 만료 |
| `KnowledgeSource` | 영구 (stale도 유지) | 수동 정리 (관리자 판단) |
| `KnowledgeEmbedding` | 영구 | `KnowledgeSource` 삭제 시 CASCADE |
| `CrawlLog` | 90일 | 월간 cron job으로 90일 이전 삭제 |

---

## 인덱스 전략

### PostgreSQL

- **KnowledgeSource**: `url` (Unique), `language`, `is_stale`
- **KnowledgeEmbedding**: `embedding` (HNSW), `language`, `knowledge_source_id`
- **CrawlLog**: `started_at`, `status`

### Redis

- Key 패턴: `session:{uuid}`
- TTL 인덱스: Redis 자동 관리

---

## 다음 단계

Phase 1 계속: API 계약(OpenAPI) 정의
