from fastapi import FastAPI
from backend.schemas import GameSummaryRequest, GameSummaryResponse
from backend.services import generate_summary

app = FastAPI(title="Bowling Summarizer API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Bowling Summarizer API is running!"}

@app.post("/summarize", response_model=GameSummaryResponse)
def summarize_game(req: GameSummaryRequest):
    summary_text = generate_summary(req.frames, req.scores)
    return GameSummaryResponse(summary=summary_text)
