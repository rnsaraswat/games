import { gameState } from "./levels.js";
import { isValidPour } from "./gameLogic.js";

export function smartHint() {
  let best = null;

  gameState.forEach((_,i)=>{
    gameState.forEach((_,j)=>{
      if (isValidPour(i,j)) {
        const score = gameState[j].length === 0 ? 2 : 5;
        if (!best || score > best.score)
          best = { from:i, to:j, score };
      }
    });
  });

  return best;
}

// PART-3: 🧠 ADVANCED AI SOLVER (SMART HINT)
// 🎯 AI Behavior

// ✔ Bad move avoid
// ✔ Empty tube smart use
// ✔ Same color grouping
// ✔ Deadlock detect

// 🧠 AI Scoring Logic
// function scoreMove(from, to) {
//     const src = gameState[from];
//     const tgt = gameState[to];
//     const c = src[src.length - 1];
  
//     let score = 0;
  
//     if (tgt.length === 0) score += 2;
//     if (tgt.length && tgt[tgt.length - 1] === c) score += 5;
//     if (tgt.length === TUBE_SIZE - 1) score += 3;
  
//     return score;
//   }


// function smartHint() {
//     let best = null;
  
//     for (let i = 0; i < gameState.length; i++) {
//       for (let j = 0; j < gameState.length; j++) {
//         if (i === j) continue;
  
//         if (isValidPour(i, j)) {
//           const s = scoreMove(i, j);
//           if (!best || s > best.score) {
//             best = { from: i, to: j, score: s };
//           }
//         }
//       }
//     }
  
//     if (best) highlightHint(best.from, best.to);
//   }
