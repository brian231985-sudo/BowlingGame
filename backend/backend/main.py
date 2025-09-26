from fastapi import FastAPI
from bowling_backend.schemas import GameSummaryRequest, GameSummaryResponse
from bowling_backend.services import generate_summary

app = FastAPI(title="Bowling Summarizer API")

@app.get("/")
def root():
    return {"message": "Bowling Summarizer API is running!"}

@app.post("/summarize", response_model=GameSummaryResponse)
def summarize_game(req: GameSummaryRequest):
    summary_text = generate_summary(req.frames, req.scores)
    return GameSummaryResponse(summary=summary_text)
