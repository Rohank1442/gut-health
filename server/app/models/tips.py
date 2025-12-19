from pydantic import BaseModel
from typing import List

class TipsLogCreate(BaseModel):
    date: str  # "YYYY-MM-DD"
    tips: List[str]

class TipsLogResponse(BaseModel):
    date: str
    tips: List[str]