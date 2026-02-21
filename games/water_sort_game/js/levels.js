import { LEVELS, COLORS, TUBE_SIZE } from "./config.js";
import { history, selected } from "./main.js";

export let currentLevel = 0;
export let gameState = [];

// export function initLevel(levelIndex) {
//   currentLevel = levelIndex;
//   const cfg = LEVELS[levelIndex];

//   let balls = [];
//   COLORS.slice(0, cfg.colors).forEach(c => {
//     for (let i = 0; i < TUBE_SIZE; i++) balls.push(c);
//   });

//   balls.sort(() => Math.random() - 0.5);
//   gameState = [];

//   for (let i = 0; i < cfg.tubes - cfg.empty; i++) {
//     gameState.push(balls.splice(0, TUBE_SIZE));
//   }
//   for (let i = 0; i < cfg.empty; i++) gameState.push([]);
// }


// Level Init
export function initLevel() {
  history = [];
  selected = null;
  statusEl.textContent = "Level " + (currentLevel + 1);

  const cfg = LEVELS[currentLevel];
  const COLORS_USED = COLORS.slice(0, cfg.colors);

  let balls = [];
  COLORS_USED.forEach(c => {
    for (let i = 0; i < TUBE_SIZE; i++) balls.push(c);
  });

  balls.sort(() => Math.random() - 0.5);
  gameState = [];

  for (let i = 0; i < cfg.tubes - cfg.empty; i++) {
    gameState.push(balls.splice(0, TUBE_SIZE));
  }

  for (let i = 0; i < cfg.empty; i++) gameState.push([]);

  render();
}




  /* Pour logic */
//   function pour(from, to) {
//     if (from === to) return;
  
//     const src = tubes[from];
//     const tgt = tubes[to];
  
//     if (src.length === 0) return;
//     if (tgt.length === 4) return;
  
//     const color = src[src.length - 1];
  
//     if (tgt.length > 0 && tgt[tgt.length - 1] !== color) return;
  
//     while (
//       src.length &&
//       src[src.length - 1] === color &&
//       tgt.length < 4
//     ) {
//       tgt.push(src.pop());
//     }
  
//     render();
//   }

// 🔹 Win → Next Level
function checkWin() {
  const win = gameState.every(tube => {
    if (tube.length === 0) return true;
    if (tube.length < TUBE_SIZE) return false;
    return tube.every(c => c === tube[0]);
  });

  if (win) {
    statusEl.textContent = "🎉 Level Complete!";
    setTimeout(() => {
      currentLevel++;
      if (currentLevel < LEVELS.length) {
        initLevel();
      } else {
        statusEl.textContent = "🏆 ALL LEVELS COMPLETED!";
      }
    }, 1200);
  }
}

// 🔁 Replace Old Init Call
initLevel();


// level screen js
function showLevelScreen() {
    const box = document.getElementById("levelButtons");
    box.innerHTML = "";
  
    LEVELS.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.textContent = "Level " + (i + 1);
      btn.onclick = () => {
        currentLevel = i;
        document.getElementById("levelScreen").style.display = "none";
        initLevel();
      };
      box.appendChild(btn);
    });
  }
  
  showLevelScreen();
// level screen js
  
