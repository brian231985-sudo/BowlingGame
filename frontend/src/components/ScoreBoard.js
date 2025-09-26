import React from "react";
import Frame from "./Frame";
import "./ScoreBoard.css";

const ScoreBoard = ({ frames, scores, currentFrameIndex, gameOver }) => {
  return (
    <div className="scoreboard">
      {Array.from({ length: 10 }).map((_, i) => (
        <Frame
          key={i}
          frameIndex={i}
          rolls={frames[i] || []}
          score={scores[i] ?? ""}
          isCurrent={!gameOver && i === currentFrameIndex}
        />
      ))}
    </div>
  );
};

export default ScoreBoard;
