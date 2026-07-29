from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # BMONI sandbox
    bmoni_api_key: str
    bmoni_base_url: str = "https://embedded-dev.bmoni.com"

    # Gemini (intent parsing + plain-language responses)
    gemini_api_key: str
    gemini_model: str = "gemini-3.5-flash"

    # YarnGPT (hosted TTS)
    yarngpt_api_key: str = ""
    yarngpt_api_base_url: str = "https://yarngpt.ai/api/v1"

    # Whisper (local STT)
    whisper_model_size: str = "base"

    # Local app data
    database_url: str = "sqlite:///./bmoni_copilot.db"
    pending_transfer_ttl_seconds: int = 300

    # Transaction Guardian thresholds
    guardian_amount_multiplier: float = 2.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
