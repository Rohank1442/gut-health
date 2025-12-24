"""
Configuration settings for the Gut Health Tracker API
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # OpenAI Configuration
    GEMINI_API_KEY: str
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = ["http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080"]
    
    # Scoring Weights (configurable)
    WEIGHT_FIBER: float = 0.25
    WEIGHT_DIVERSITY: float = 0.25
    WEIGHT_PROCESSED: float = 0.20
    WEIGHT_PROBIOTIC: float = 0.15
    WEIGHT_DIGESTIVE: float = 0.15
    
    # Scoring Targets
    TARGET_FIBER_GRAMS: int = 30
    TARGET_DIVERSITY_CATEGORIES: int = 7
    TARGET_PROBIOTIC_SERVINGS: int = 2
    
    # Status Thresholds
    FINAL_STATUS_MIN_ENTRIES: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()