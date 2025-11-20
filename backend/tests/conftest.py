"""
Pytest configuration and fixtures for NURI Q&A System tests
"""
import pytest
from typing import Generator


@pytest.fixture
def test_config() -> dict:
    """Test configuration fixture"""
    return {
        "OPENAI_API_KEY": "test-api-key",
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": 5432,
        "POSTGRES_DB": "test_nuri_qa_db",
        "REDIS_HOST": "localhost",
        "REDIS_PORT": 6379,
    }


@pytest.fixture
def mock_session_id() -> str:
    """Mock session ID for testing"""
    return "550e8400-e29b-41d4-a716-446655440000"


@pytest.fixture
def sample_question_ko() -> str:
    """Sample Korean question"""
    return "NURI의 Tier 1 시장은 어디인가요?"


@pytest.fixture
def sample_question_en() -> str:
    """Sample English question"""
    return "What is NURI's business model?"
