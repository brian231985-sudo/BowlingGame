import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rolls: [],        // flat list of rolls (0..10)
  frames: [],       // [[r1,r2], ..., [r1,r2,(r3)]] up to 10 frames (last can have 3)
  scores: [],       // cumulative per-frame; blank until score resolvable
  gameOver: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    roll: (state, action) => {
      if (state.gameOver) return;
      const pins = Number(action.payload);

      // Validate against allowed pins
      const allowed = getAllowedPins(state.rolls);
      if (!allowed.includes(pins)) return;

      state.rolls.push(pins);

      // Rebuild derived state
      state.frames = buildFrames(state.rolls);
      state.scores = calculateCumulativeScores(state.rolls);
      state.gameOver = isGameOver(state.rolls);
    },
    resetGame: () => initialState,
  },
});

export const { roll, resetGame } = gameSlice.actions;
export default gameSlice.reducer;

/* =========================
   Helpers (pure functions)
   ========================= */

// Build frames from rolls (max 10 frames; 10th can have 3 rolls).
export function buildFrames(rolls) {
  const frames = [];
  let i = 0;

  // Frames 1..9
  for (let f = 0; f < 9; f++) {
    if (i >= rolls.length) break;

    if (rolls[i] === 10) {
      frames.push([10]);       // strike
      i += 1;
    } else {
      const r1 = rolls[i];
      const r2 = rolls[i + 1];
      frames.push([r1, r2].filter(v => v !== undefined));
      i += (r2 === undefined ? 1 : 2);
    }
  }

  // 10th frame (up to 3 rolls)
  if (i < rolls.length) {
    frames.push(rolls.slice(i, Math.min(i + 3, rolls.length)));
  }

  return frames;
}

// Determine if game is over given rolls.
export function isGameOver(rolls) {
  let i = 0;

  // First 9 frames
  for (let f = 0; f < 9; f++) {
    if (i >= rolls.length) return false;
    if (rolls[i] === 10) {
      i += 1;
    } else {
      if (i + 1 >= rolls.length) return false;
      i += 2;
    }
  }

  // 10th frame rules
  if (i >= rolls.length) return false;
  const r1 = rolls[i];
  const r2 = rolls[i + 1];
  const r3 = rolls[i + 2];

  if (r1 === 10) {
    // need 2 more rolls
    return r2 !== undefined && r3 !== undefined;
  } else if (r2 === undefined) {
    return false;
  } else if (r1 + r2 === 10) {
    // spare -> needs 1 bonus
    return r3 !== undefined;
  } else {
    // open
    return true;
  }
}

// Compute cumulative scores, only when resolvable (respect bonuses).
export function calculateCumulativeScores(rolls) {
  const scores = [];
  let total = 0;
  let i = 0;

  for (let frame = 0; frame < 10; frame++) {
    if (i >= rolls.length) break;

    // 10th frame special
    if (frame === 9) {
      const r1 = rolls[i];
      const r2 = rolls[i + 1];
      if (r1 === undefined || r2 === undefined) { scores.push(""); break; }
      if (r1 === 10) {
        const r3 = rolls[i + 2];
        if (r3 === undefined) { scores.push(""); break; }
        total += (r1 + r2 + r3);
        scores.push(total);
        break;
      } else if (r1 + r2 === 10) {
        const r3 = rolls[i + 2];
        if (r3 === undefined) { scores.push(""); break; }
        total += (10 + r3);
        scores.push(total);
        break;
      } else {
        total += (r1 + r2);
        scores.push(total);
        break;
      }
    }

    // Frames 1..9
    if (rolls[i] === 10) { // strike
      const a = rolls[i + 1];
      const b = rolls[i + 2];
      if (a === undefined || b === undefined) { scores.push(""); break; }
      total += 10 + a + b;
      scores.push(total);
      i += 1;
    } else {
      const r1 = rolls[i];
      const r2 = rolls[i + 1];
      if (r2 === undefined) { scores.push(""); break; }

      if (r1 + r2 === 10) { // spare
        const bonus = rolls[i + 2];
        if (bonus === undefined) { scores.push(""); break; }
        total += 10 + bonus;
      } else {
        total += r1 + r2;
      }
      scores.push(total);
      i += 2;
    }
  }

  return scores;
}

// Return allowed pins for the *next* roll (prevents illegal inputs).
export function getAllowedPins(rolls) {
  // If game is over, nothing allowed
  if (isGameOver(rolls)) return [];

  let i = 0;
  const n = rolls.length;

  // Walk frames 1..9 to locate current position
  for (let f = 0; f < 9; f++) {
    if (i >= n) {
      // first roll of frame f
      return range(0, 10);
    }
    if (rolls[i] === 10) {
      // this frame done (strike)
      i += 1;
      continue;
    }
    // first roll present, are we on second?
    if (i + 1 >= n) {
      const max = 10 - rolls[i];
      return range(0, max);
    }
    // frame complete
    i += 2;
  }

  // 10th frame
  if (i >= n) {
    return range(0, 10);
  }
  const r1 = rolls[i];
  const r2 = rolls[i + 1];

  // 10th, first present?
  if (r1 === 10) {
    // strike: second can be 0..10
    if (r2 === undefined) return range(0, 10);
    // third depends on second
    const r3 = rolls[i + 2];
    if (r3 === undefined) {
      const max = (r2 === 10) ? 10 : (10 - r2);
      return range(0, max);
    }
    return []; // already complete
  } else {
    // first < 10
    if (r2 === undefined) {
      const max = 10 - r1;
      return range(0, max);
    }
    // if spare, third is 0..10; else game over
    if (r1 + r2 === 10) {
      const r3 = rolls[i + 2];
      return (r3 === undefined) ? range(0, 10) : [];
    } else {
      return []; // open frame finished
    }
  }
}

function range(min, maxInclusive) {
  const out = [];
  for (let v = min; v <= maxInclusive; v++) out.push(v);
  return out;
}
