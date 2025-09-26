import React from "react";
import "./Frame.css";

const Frame = ({ frameIndex, rolls, score, isCurrent }) => {
  const symbolAt = (idx) => {
    const r = rolls[idx];

    if (r === undefined) return "";

    // Frames 1..9
    if (frameIndex < 9) {
      if (idx === 0 && r === 10) return <strong className="strike">X</strong>;
      if (idx === 1) {
        const r0 = rolls[0] ?? 0;
        if (r0 !== 10 && r0 + r === 10) return <strong className="spare">/</strong>;
      }
      return r;
    }

    // 10th frame (index 9)
    if (r === 10) return <strong className="strike">X</strong>;
    if (idx > 0) {
      const prev = rolls[idx - 1] ?? 0;
      // Only show spare if previous wasn't a strike and together they make 10
      if (prev !== 10 && prev + r === 10) return <strong className="spare">/</strong>;
    }
    return r;
  };

  return (
    <div className={`frame ${isCurrent ? "current" : ""}`}>
      <div className="frame-header">{frameIndex + 1}</div>
      <div className="rolls">
        <span>{symbolAt(0)}</span>
        <span>{symbolAt(1)}</span>
        {frameIndex === 9 && <span>{symbolAt(2)}</span>}
      </div>
      <div className="cumulative">{score ?? ""}</div>
    </div>
  );
};

export default Frame;
