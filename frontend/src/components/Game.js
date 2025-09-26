import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roll, resetGame } from "../redux/gameSlice";
import { getAllowedPins, buildFrames, isGameOver } from "../redux/gameSlice";
import ScoreBoard from "./ScoreBoard";

const Game = () => {
  const dispatch = useDispatch();
  const rolls = useSelector((s) => s.game.rolls);
  const frames = useSelector((s) => s.game.frames);
  const scores = useSelector((s) => s.game.scores);
  const gameOver = useSelector((s) => s.game.gameOver);

  const [summary, setSummary] = useState("");

  const allowed = getAllowedPins(rolls);
  const currentFrameIndex = Math.min(buildFrames(rolls).length - 1, 9);
  const inProgress = !isGameOver(rolls);

  const handleSummarize = () => {
    setSummary(`Frames: ${JSON.stringify(frames)} | Scores: ${JSON.stringify(scores)}`);
  };

  const handleReset = () => {
    dispatch(resetGame());
    setSummary(""); // 🔑 clear the old summary
  };

  return (
    <div>
      <ScoreBoard
        frames={frames}
        scores={scores}
        currentFrameIndex={currentFrameIndex}
        gameOver={gameOver}
      />

      {/* Roll buttons */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        {inProgress ? (
          <>
            <div style={{ marginBottom: 8, fontWeight: "bold" }}>
              Choose pins knocked down:
            </div>
            <div>
              {Array.from({ length: 11 }, (_, n) => (
                <button
                  key={n}
                  onClick={() => dispatch(roll(n))}
                  disabled={!allowed.includes(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontWeight: "bold" }}>Game Over</div>
        )}
      </div>

      {/* Reset + Summarize buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          gap: "10px",
        }}
      >
        <button onClick={handleReset}>Reset Game</button>
        <button onClick={handleSummarize} disabled={inProgress}>
          Summarize
        </button>
      </div>

      {/* Summary box */}
      {summary && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
          }}
        >
          <div
            style={{
              padding: 16,
              background: "#f9f9f9",
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              maxWidth: 600,
              textAlign: "center",
            }}
          >
            <h3>Game Summary</h3>
            <p>{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
