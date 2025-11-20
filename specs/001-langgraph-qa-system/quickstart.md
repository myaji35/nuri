# Quickstart: LangGraph 기반 Q&A 시스템

**Date**: 2025-11-19
**Feature**: 001-langgraph-qa-system

## 개요

이 문서는 LangGraph 기반 Q&A 시스템을 로컬 환경에서 빠르게 실행하고 테스트하는 방법을 설명합니다.

**예상 소요 시간**: 15-20분

---

## 사전 요구사항

### 필수 도구

- **Docker** 20.10+ & **Docker Compose** 2.0+
- **Python** 3.11+
- **Node.js** 18+ (프론트엔드)
- **Git**

### API 키

- **OpenAI API Key**: https://platform.openai.com/api-keys 에서 발급
  - 필요한 권한: `gpt-4o-mini`, `text-embedding-3-small`

---

## Step 1: 저장소 클론 및 환경 설정

```bash
# 저장소 클론
cd /Users/gangseungsig/Documents/02_GitHub/01_NURI

# 백엔드 디렉토리 생성 (아직 구현 전이므로 예시)
mkdir -p backend
cd backend

# Python 가상환경 생성 및 활성화
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치 (requirements.txt 생성 후)
pip install --upgrade pip
pip install \
    langgraph==0.2.0 \
    langchain==0.3.0 \
    langchain-openai==0.2.0 \
    fastapi==0.110.0 \
    uvicorn==0.29.0 \
    pydantic==2.6.0 \
    psycopg2-binary==2.9.9 \
    pgvector==0.2.5 \
    redis==5.0.3 \
    scrapy==2.11.0 \
    apscheduler==3.10.4 \
    langdetect==1.0.9 \
    bleach==6.1.0 \
    slowapi==0.1.9 \
    structlog==24.1.0 \
    pytest==8.0.0 \
    pytest-asyncio==0.23.0 \
    httpx==0.27.0

# 환경 변수 파일 생성
cat > .env << 'EOF'
# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database
DATABASE_URL=postgresql://nuri_user:nuri_password@localhost:5432/nuri_qa
REDIS_URL=redis://localhost:6379/0

# Server
HOST=0.0.0.0
PORT=8000
WORKERS=4

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Crawler
CRAWLER_INTERVAL_MINUTES=5
CRAWLER_START_URL=https://nuri-platform.com

# Logging
LOG_LEVEL=INFO
EOF

echo "⚠️  .env 파일을 열어 OPENAI_API_KEY를 실제 키로 교체하세요!"
```

---

## Step 2: 데이터베이스 시작 (Docker Compose)

```bash
# 프로젝트 루트로 이동
cd /Users/gangseungsig/Documents/02_GitHub/01_NURI

# docker-compose.yml 생성
cat > docker-compose.dev.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: ankane/pgvector:latest
    container_name: nuri_qa_postgres
    environment:
      POSTGRES_USER: nuri_user
      POSTGRES_PASSWORD: nuri_password
      POSTGRES_DB: nuri_qa
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nuri_user -d nuri_qa"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: nuri_qa_redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
EOF

# 데이터베이스 시작
docker-compose -f docker-compose.dev.yml up -d

# 헬스체크 대기
echo "⏳ 데이터베이스 준비 중..."
sleep 10

# PostgreSQL 연결 테스트
docker exec -it nuri_qa_postgres psql -U nuri_user -d nuri_qa -c "SELECT version();"

# pgvector extension 설치
docker exec -it nuri_qa_postgres psql -U nuri_user -d nuri_qa -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "✅ 데이터베이스 준비 완료!"
```

---

## Step 3: 데이터베이스 스키마 생성

```bash
cd backend

# 스키마 SQL 파일 생성
cat > schema.sql << 'EOF'
-- Knowledge Sources
CREATE TABLE IF NOT EXISTS knowledge_sources (
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

CREATE INDEX IF NOT EXISTS idx_knowledge_sources_language ON knowledge_sources(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_url ON knowledge_sources(url);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_is_stale ON knowledge_sources(is_stale);

-- Knowledge Embeddings
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id SERIAL PRIMARY KEY,
    knowledge_source_id INTEGER REFERENCES knowledge_sources(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('ko', 'en')),
    token_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(knowledge_source_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON knowledge_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_embeddings_language ON knowledge_embeddings(language);
CREATE INDEX IF NOT EXISTS idx_embeddings_knowledge_source_id ON knowledge_embeddings(knowledge_source_id);

-- Crawl Logs
CREATE TABLE IF NOT EXISTS crawl_logs (
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

CREATE INDEX IF NOT EXISTS idx_crawl_logs_started_at ON crawl_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_crawl_logs_status ON crawl_logs(status);
EOF

# 스키마 적용
docker exec -i nuri_qa_postgres psql -U nuri_user -d nuri_qa < schema.sql

echo "✅ 데이터베이스 스키마 생성 완료!"
```

---

## Step 4: 샘플 데이터 삽입 (테스트용)

```bash
# 샘플 데이터 SQL 생성
cat > sample_data.sql << 'EOF'
-- 샘플 홈페이지 콘텐츠 (한국어)
INSERT INTO knowledge_sources (url, title, content, language)
VALUES
(
    'https://nuri-platform.com/about',
    '회사 소개',
    'NURI는 스마트팜과 장애인 고용 통합을 추구하는 글로벌 사회적 임팩트 스타트업입니다. 우리는 첨단 농업 기술과 포용적 고용을 결합하여 지속 가능한 미래를 만들어갑니다.',
    'ko'
),
(
    'https://nuri-platform.com/market-strategy',
    '시장 전략',
    'NURI의 시장 진출 전략은 3단계로 구성됩니다. Tier 1 (한국): 이미 NURI 농장이 구축된 시장으로, K1 사이트(위도 36.81°, 경도 127.79°)가 운영 중입니다. Tier 2 (우선 진출 시장): 베트남, 태국 등 동남아시아 국가. Tier 3 (장기 목표 시장): 유럽 및 북미.',
    'ko'
);

-- 샘플 콘텐츠 (영어)
INSERT INTO knowledge_sources (url, title, content, language)
VALUES
(
    'https://nuri-platform.com/en/about',
    'About Us',
    'NURI is a global social impact startup focused on smart farming and disability employment integration. We combine cutting-edge agricultural technology with inclusive employment to create a sustainable future.',
    'en'
),
(
    'https://nuri-platform.com/en/market-strategy',
    'Market Strategy',
    'NURI''s market expansion strategy consists of three tiers. Tier 1 (South Korea): Markets with established NURI farms, including the K1 site (latitude 36.81°, longitude 127.79°). Tier 2 (Priority markets): Southeast Asian countries like Vietnam and Thailand. Tier 3 (Long-term goals): Europe and North America.',
    'en'
);
EOF

# 샘플 데이터 삽입
docker exec -i nuri_qa_postgres psql -U nuri_user -d nuri_qa < sample_data.sql

echo "✅ 샘플 데이터 삽입 완료!"
```

---

## Step 5: 임베딩 생성 (초기 지식 베이스 구축)

```bash
cd backend

# 간단한 임베딩 생성 스크립트
cat > generate_embeddings.py << 'EOF'
import os
import asyncio
from openai import AsyncOpenAI
import psycopg2
from psycopg2.extras import execute_values

async def generate_embeddings():
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # PostgreSQL 연결
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()

    # Knowledge sources 조회
    cur.execute("SELECT id, content, language FROM knowledge_sources")
    sources = cur.fetchall()

    for source_id, content, language in sources:
        # 간단한 청킹 (실제로는 더 정교한 로직 필요)
        chunks = [content[i:i+2000] for i in range(0, len(content), 1950)]

        for idx, chunk in enumerate(chunks):
            # 임베딩 생성
            response = await client.embeddings.create(
                model="text-embedding-3-small",
                input=chunk
            )
            embedding = response.data[0].embedding

            # 임베딩 저장
            cur.execute("""
                INSERT INTO knowledge_embeddings
                (knowledge_source_id, chunk_index, chunk_text, embedding, language, token_count)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (knowledge_source_id, chunk_index) DO NOTHING
            """, (source_id, idx, chunk, embedding, language, len(chunk.split())))

    conn.commit()
    cur.close()
    conn.close()
    print("✅ 임베딩 생성 완료!")

asyncio.run(generate_embeddings())
EOF

# 실행
python generate_embeddings.py
```

---

## Step 6: FastAPI 서버 실행

```bash
# FastAPI 앱 시작 (간단한 예시)
cat > main.py << 'EOF'
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="NURI Q&A API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    session_id: str | None = None

@app.post("/api/v1/qa/ask")
async def ask_question(request: QuestionRequest):
    # TODO: LangGraph 에이전트 호출
    return {
        "session_id": "test-session-id",
        "question": request.question,
        "answer": "이것은 테스트 답변입니다. 실제 LangGraph 구현이 필요합니다.",
        "language": "ko",
        "confidence_score": 0.5,
        "processing_time_ms": 100
    }

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# 서버 실행
python main.py &

echo "✅ FastAPI 서버 실행 중 (http://localhost:8000)"
```

---

## Step 7: API 테스트

```bash
# 헬스체크
curl http://localhost:8000/api/v1/health

# 질문 제출 (한국어)
curl -X POST http://localhost:8000/api/v1/qa/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "NURI가 뭐예요?",
    "session_id": null
  }'

# 질문 제출 (영어)
curl -X POST http://localhost:8000/api/v1/qa/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is NURI?",
    "session_id": null
  }'

# API 문서 확인
open http://localhost:8000/docs  # macOS
# 또는 브라우저에서 http://localhost:8000/docs 접속
```

---

## Step 8: 프론트엔드 실행 (선택사항)

```bash
cd /Users/gangseungsig/Documents/02_GitHub/01_NURI

# 프론트엔드 디렉토리로 이동 (또는 생성)
mkdir -p frontend
cd frontend

# Next.js 프로젝트 초기화
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# API 클라이언트 추가
npm install axios

# 간단한 Q&A 페이지 생성
mkdir -p app/qa
cat > app/qa/page.tsx << 'EOF'
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function QAPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/qa/ask', {
        question,
        session_id: null
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">NURI Q&A</h1>
      <div className="space-y-4">
        <textarea
          className="w-full p-4 border rounded"
          rows={3}
          placeholder="질문을 입력하세요..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? '답변 생성 중...' : '질문하기'}
        </button>
        {answer && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="font-semibold">답변:</p>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# 개발 서버 실행
npm run dev

echo "✅ 프론트엔드 실행 중 (http://localhost:3000/qa)"
```

---

## 정리 (Clean Up)

```bash
# FastAPI 서버 종료
pkill -f "python main.py"

# 데이터베이스 종료
cd /Users/gangseungsig/Documents/02_GitHub/01_NURI
docker-compose -f docker-compose.dev.yml down

# (선택) 볼륨 삭제 (데이터 완전 제거)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 다음 단계

Quickstart를 완료했다면:

1. **Phase 2**: `/speckit.tasks` 명령어로 구현 작업 목록 생성
2. **구현 시작**: 작업 목록에 따라 LangGraph 에이전트, 크롤러, API 구현
3. **테스트 작성**: pytest로 유닛/통합 테스트 추가
4. **프로덕션 배포**: Kubernetes 또는 Vercel + AWS 배포

---

## 문제 해결

### Q: PostgreSQL 연결 실패
```bash
# 컨테이너 상태 확인
docker ps
docker logs nuri_qa_postgres

# 수동 연결 테스트
psql postgresql://nuri_user:nuri_password@localhost:5432/nuri_qa
```

### Q: OpenAI API 키 오류
```bash
# .env 파일 확인
cat backend/.env

# 환경 변수 로드 테스트
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('OPENAI_API_KEY'))"
```

### Q: 포트 충돌 (5432, 6379, 8000)
```bash
# 사용 중인 포트 확인
lsof -i :5432
lsof -i :6379
lsof -i :8000

# docker-compose.dev.yml에서 포트 변경 (예: 5433:5432)
```

---

## 참고 자료

- [LangGraph 문서](https://langchain-ai.github.io/langgraph/)
- [pgvector 가이드](https://github.com/pgvector/pgvector)
- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [OpenAPI 스펙](./contracts/api-spec.yaml)
