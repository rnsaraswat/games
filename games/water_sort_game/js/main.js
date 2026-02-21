// import { initLevel, gameState } from "./levels.js";
import { render } from "./renderer.js";
import { isValidPour, doPour } from "./gameLogic.js";
import { playSound } from "./sound.js";
import { arcPour } from "./animation.js";
import { showHint } from "./hint.js";

const COLORS = ["red","blue","green","yellow","purple","cyan"];
const TUBE_SIZE = 4;
const TOTAL_TUBES = 14;

// let gameState = [];
export let history = [];
export let selected = null;

const tubesArea = document.getElementById("tubesArea");
const statusEl = document.getElementById("status");

/* 🎲 Init Game */
function initGame() {
  history = [];
  selected = null;
  statusEl.textContent = "";

  let balls = [];
  COLORS.forEach(c => {
    for (let i = 0; i < TUBE_SIZE; i++) balls.push(c);
  });

  balls.sort(() => Math.random() - 0.5);

  gameState = [];

  for (let i = 0; i < 12; i++) {
    gameState.push(balls.splice(0, TUBE_SIZE));
  }

  gameState.push([]);
  gameState.push([]);

  render();
}



/* 🧪 Tube DOM */
function createTube(data,index) {
  const tube = document.createElement("div");
  tube.className = "tube";
  tube.dataset.index = index;

  if (selected === index) tube.classList.add("selected");

  data.forEach(color=>{
    const layer = document.createElement("div");
    layer.className = `layer ${color}`;
    tube.appendChild(layer);
  });

  tube.onclick = ()=>onTubeClick(index);
  return tube;
}



/* 💧 Smooth Pour */
function pour(from,to) {
  const src = gameState[from];
  const tgt = gameState[to];

  if (!src.length || tgt.length === TUBE_SIZE) return;

  const color = src[src.length-1];
  if (tgt.length && tgt[tgt.length-1] !== color) return;

  history.push(JSON.parse(JSON.stringify(gameState)));

  let count = 0;
  for (let i=src.length-1;i>=0;i--) {
    if (src[i] === color) count++;
    else break;
  }

  count = Math.min(count, TUBE_SIZE - tgt.length);

  setTimeout(()=>{
    for (let i=0;i<count;i++) tgt.push(src.pop());
    render();
    checkWin();
  },200);
}

/* 🏆 Win Detection */
// function checkWin() {
//   const won = gameState.every(tube=>{
//     if (tube.length === 0) return true;
//     if (tube.length < TUBE_SIZE) return false;
//     return tube.every(c=>c===tube[0]);
//   });

//   if (won) statusEl.textContent = "🎉 YOU WIN!";
// }

// FULL WIN FLOW (Updated)
function checkWin() {
    const win = gameState.every(t => {
      if (!t.length) return true;
      if (t.length < TUBE_SIZE) return false;
      return t.every(c => c === t[0]);
    });
  
    if (win) {
      playSound("win");
      launchFireworks();
      statusEl.textContent = "🎉 YOU WIN!";
      onLevelComplete();
      setTimeout(showLevelScreen, 2000);
    }
  }


/* ↩ Undo */
function undo() {
  if (!history.length) return;
  gameState = history.pop();
  render();
}

// Undo+ (Extra Undos)
// 🔹 Button
/* <button onclick="useUndoPlus()">⏪ Undo+</button> */

// 🔹 Logic
function useUndoPlus() {
  if (powerUps.undoPlus <= 0) return;

  if (history.length) {
    gameState = history.pop();
    powerUps.undoPlus--;
    saveProgress({ ...progress, undoPlus: powerUps.undoPlus });
    render();
  }
}

/* 🔄 Restart */
function restart() {
  initGame();
}

initGame();


// let selected = null;

function onTubeClick(i) {
  if (selected === null) {
    if (!gameState[i].length) return;
    selected = i;
  } else {
    if (isValidPour(selected,i)) {
      const fromEl = document.querySelector(`[data-index='${selected}']`);
      const toEl = document.querySelector(`[data-index='${i}']`);
      const color = gameState[selected].at(-1);

      playSound("pour");
      arcPour(fromEl,toEl,color,()=>{
        doPour(selected,i);
        render(onTubeClick);
      });
    }
    selected = null;
  }
}

// initLevel(0);
render(onTubeClick);

/* 👆 Click Logic */
// function onTubeClick(index) {
//     if (selected === null) {
//       if (gameState[index].length === 0) return;
//       selected = index;
//     } else {
//       if (selected !== index) pour(selected,index);
//       selected = null;
//     }
//     render();
//   }

window.showHint = showHint;

const tubes = [
    ["red","blue","blue","red"],
    ["green","green","yellow","yellow"],
    [],
    []
  ];
  
  const tubeEls = document.querySelectorAll(".tube");
  let selectedTube = null;
  
  /* Render tubes */
//   function render() {
//     tubeEls.forEach((tubeEl, i) => {
//       tubeEl.innerHTML = "";
//       tubes[i].forEach(color => {
//         const layer = document.createElement("div");
//         layer.className = `layer ${color}`;
//         tubeEl.appendChild(layer);
//       });
//     });
//   }
  
//   render();
  
  /* Click logic */
  tubeEls.forEach((tubeEl, index) => {
    tubeEl.addEventListener("click", () => handleClick(index));
  });
  
  function handleClick(index) {
    if (selectedTube === null) {
      if (tubes[index].length === 0) return;
      selectedTube = index;
      tubeEls[index].classList.add("selected");
    } else {
      pour(selectedTube, index);
      tubeEls[selectedTube].classList.remove("selected");
      selectedTube = null;
    }
  }
  




//   JavaScript (Arc Motion)
function animateArcLiquid(from, to, color, onComplete) {
  const srcEl = document.querySelector(`.tube[data-index='${from}']`);
  const tgtEl = document.querySelector(`.tube[data-index='${to}']`);

  const s = srcEl.getBoundingClientRect();
  const t = tgtEl.getBoundingClientRect();

  const fly = document.createElement("div");
  fly.className = `fly-liquid ${color}`;
  document.body.appendChild(fly);

  const x0 = s.left + s.width / 2;
  const y0 = s.top;
  const x1 = t.left + t.width / 2;
  const y1 = t.top;

  let progress = 0;

  function animate() {
    progress += 0.03;
    const cx = (x0 + x1) / 2;
    const cy = Math.min(y0, y1) - 150;

    const x =
      (1 - progress) * (1 - progress) * x0 +
      2 * (1 - progress) * progress * cx +
      progress * progress * x1;

    const y =
      (1 - progress) * (1 - progress) * y0 +
      2 * (1 - progress) * progress * cy +
      progress * progress * y1;

    fly.style.left = x - 30 + "px";
    fly.style.top = y + "px";

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(fly);
      onComplete();
    }
  }

  animate();
}

// 🔹 Pour Function Update
// function pour(from, to) {
//   const src = gameState[from];
//   const tgt = gameState[to];
//   if (!src.length || tgt.length === TUBE_SIZE) return;

//   const color = src[src.length - 1];
//   if (tgt.length && tgt[tgt.length - 1] !== color) return;

//   history.push(JSON.parse(JSON.stringify(gameState)));

//   playSound("pour");

//   animateArcLiquid(from, to, color, () => {
//     while (
//       src.length &&
//       src[src.length - 1] === color &&
//       tgt.length < TUBE_SIZE
//     ) {
//       tgt.push(src.pop());
//     }
//     render();
//     checkTubeFilled(to);
//     checkWin();
//   });
// }



  /* REAL LIQUID WOBBLE EFFECT
🔹 CSS Wobble Animation */
// 🔹 Activate on Pour
function applyWobble(index) {
  const tube = document.querySelector(`.tube[data-index='${index}']`);
  tube.querySelectorAll(".layer").forEach(l => {
    l.style.animation = "none";
    l.offsetHeight;
    l.style.animation = "wobble 0.6s ease-in-out";
  });
}


// 📌 Call this after pour:

applyWobble(to);








