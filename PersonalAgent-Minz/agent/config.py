"""Central configuration, read from environment variables / .env file."""
import os
from dataclasses import dataclass

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:  # dotenv is optional at import time
    pass


@dataclass(frozen=True)
class Settings:
    api_key: str = os.getenv("ANTHROPIC_API_KEY", "")
    model: str = os.getenv("AGENT_MODEL", "claude-sonnet-5-5")
    api_token: str = os.getenv("AGENT_API_TOKEN", "")
    db_path: str = os.getenv("AGENT_DB_PATH", "data/agent.db")
    max_steps: int = int(os.getenv("AGENT_MAX_STEPS", "8"))
    max_tokens: int = 1500


def get_settings() -> Settings:
    return Settings()
