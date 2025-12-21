from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import food_entries, summaries, tips
from app.api.deps import get_current_user

app = FastAPI(title="Gut Health Tracker API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(food_entries.router, prefix="/food-entry", tags=["Food Entries"])
app.include_router(summaries.router, prefix="", tags=["Summaries"])
app.include_router(tips.router, prefix="", tags=["Tips"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/me")
async def me(user_id: str = Depends(get_current_user)):
    return {"user_id": user_id}