-- Initialize NURI Q&A System Database
-- This script is executed when the PostgreSQL container starts for the first time

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create knowledge_sources table
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

-- Create indexes for knowledge_sources
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_language ON knowledge_sources(language);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_url ON knowledge_sources(url);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_is_stale ON knowledge_sources(is_stale);

-- Create knowledge_embeddings table
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

-- Create HNSW index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON knowledge_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_embeddings_language ON knowledge_embeddings(language);
CREATE INDEX IF NOT EXISTS idx_embeddings_knowledge_source_id ON knowledge_embeddings(knowledge_source_id);

-- Create crawl_logs table
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

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_knowledge_sources_updated_at
    BEFORE UPDATE ON knowledge_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial system log
INSERT INTO crawl_logs (started_at, finished_at, status, pages_crawled, pages_updated, pages_failed, duration_seconds)
VALUES (NOW(), NOW(), 'success', 0, 0, 0, 0);

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'NURI Q&A Database initialized successfully with pgvector extension';
END $$;
