from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from enum import Enum

class MealType(str, Enum):
    breakfast = "breakfast"
    lunch = "lunch"
    dinner = "dinner"
    snack = "snack"

class FoodEntryCreate(BaseModel):
    date: date
    time: Optional[time] = None
    meal_type: MealType
    food_text: str

class FoodEntryUpdate(BaseModel):
    food_text: str

class FoodEntryResponse(BaseModel):
    id: str
    time: Optional[str]
    meal_type: str
    food_text: str