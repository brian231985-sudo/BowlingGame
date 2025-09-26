def generate_summary(frames, scores) -> str:
    total_score = scores[-1] if scores and scores[-1] is not None else 0
    return f"The game finished with {total_score} points across {len(frames)} frames."
