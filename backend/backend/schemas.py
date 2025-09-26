from pydantic import BaseModel
from typing import List, Optional

class GameSummaryRequest(BaseModel):
    frames: List[List[Optional[int]]]
    scores: List[Optional[int]]

class GameSummaryResponse(BaseModel):
    summary: str
