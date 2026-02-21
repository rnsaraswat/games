// let tubes = [];
// let history = [];
// let selectedTube = null;

// const COLORS = ["red", "blue", "green", "yellow", "purple", "cyan"];

// initGame();

// /* ---------- INIT GAME ---------- */
// function initGame() {
//   const total = parseInt(document.getElementById("tubeSelect").value);
//   const empty = 2;
//   const filled = total - empty;

//   // Generate colors
//   let pool = [];
//   for (let i = 0; i < filled; i++) {
//     const color = COLORS[i % COLORS.length];
//     for (let j = 0; j < 4; j++) pool.push(color);
//   }

//   shuffle(pool);

//   tubes = [];
//   for (let i = 0; i < total; i++) {
//     if (i < filled) {
//       tubes.push(pool.splice(0, 4));
//     } else {
//       tubes.push([]);
//     }
//   }

//   history = [];
//   renderGame();
// }

// /* ---------- RENDER ---------- */
// function renderGame() {
//   const allTubes = document.querySelectorAll(".tube");

//   allTubes.forEach((tubeEl, i) => {
//     tubeEl.innerHTML = "";
//     tubeEl.onclick = () => handleTubeClick(i);

//     tubes[i].forEach(color => {
//       const layer = document.createElement("div");
//       layer.style.background = color;
//       layer.style.height = "25%";
//       tubeEl.appendChild(layer);
//     });
//   });
// }

// /* ---------- CLICK ---------- */
// function handleTubeClick(index) {
//   if (selectedTube === null) {
//     if (tubes[index].length === 0) return;
//     selectedTube = index;
//     highlight(index);
//   } else {
//     if (index !== selectedTube) tryPour(selectedTube, index);
//     clearHighlight();
//     selectedTube = null;
//   }
// }

// /* ---------- POUR LOGIC ---------- */
// function tryPour(from, to) {
//   if (!canPour(from, to)) return;

//   saveHistory();

//   const color = tubes[from][tubes[from].length - 1];
//   while (
//     tubes[from].length &&
//     tubes[from][tubes[from].length - 1] === color &&
//     tubes[to].length < 4
//   ) {
//     tubes[to].push(tubes[from].pop());
//   }

//   renderGame();
//   checkWin();
// }

// function canPour(from, to) {
//   if (tubes[from].length === 0) return false;
//   if (tubes[to].length === 4) return false;
//   if (tubes[to].length === 0) return true;

//   return (
//     tubes[from][tubes[from].length - 1] ===
//     tubes[to][tubes[to].length - 1]
//   );
// }

// /* ---------- UNDO ---------- */
// document.getElementById("undoBtn").onclick = undo;

// function saveHistory() {
//   history.push(JSON.stringify(tubes));
// }

// function undo() {
//   if (!history.length) return;
//   tubes = JSON.parse(history.pop());
//   renderGame();
// }

// /* ---------- RESTART ---------- */
// document.getElementById("restartBtn").onclick = initGame;

// /* ---------- WIN CHECK ---------- */
// function checkWin() {
//   const win = tubes.every(
//     tube =>
//       tube.length === 0 ||
//       (tube.length === 4 && tube.every(c => c === tube[0]))
//   );

//   if (win) {
//     setTimeout(() => alert("🎉 YOU WIN!"), 100);
//   }
// }

// /* ---------- HELPERS ---------- */
// function shuffle(arr) {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
// }

// function highlight(i) {
//   document.querySelectorAll(".tube")[i].style.outline = "3px solid yellow";
// }

// function clearHighlight() {
//   document.querySelectorAll(".tube").forEach(
//     t => (t.style.outline = "")
//   );
// }


let tubes = [];
let history = [];
let selectedTube = null;

const tubeSize = 4;

/* ---------- INIT ---------- */
// function initGame() {
//   const totalTubes = parseInt(document.getElementById("tubeSelect").value);
//   const colorCount = totalTubes - 2;

//   tubes = [];
//   history = [];
//   selectedTube = null;

//   /* ---------- COLOR POOL ---------- */
//   let colors = [];
//   for (let i = 0; i < colorCount; i++) {
//     const color = `hsl(${(i * 360) / colorCount}, 70%, 50%)`;
//     for (let j = 0; j < tubeSize; j++) {
//       colors.push(color);
//     }
//   }

//   shuffle(colors);

//   /* ---------- TUBES ---------- */
//   for (let i = 0; i < totalTubes; i++) {
//     if (i < colorCount) {
//       tubes.push(colors.splice(0, tubeSize));
//     } else {
//       tubes.push([]);
//     }
//   }

//   renderGame();
// }

function initGame() {
    const totalTubes = parseInt(document.getElementById("tubeSelect").value) || 14;
    const colorCount = totalTubes - 2;
    const tubeSize = 4;
  
    tubes = [];
    history = [];
    selectedTube = null;
  
    /* ---------- CREATE COLORS ---------- */
    let pool = [];
    for (let i = 0; i < colorCount; i++) {
      const color = `hsl(${(i * 360) / colorCount}, 70%, 50%)`;
      for (let j = 0; j < tubeSize; j++) {
        pool.push(color);
      }
    }
  
    /* ---------- SHUFFLE ---------- */
    shuffle(pool);
  
    /* ---------- INIT EMPTY TUBES ---------- */
    for (let i = 0; i < totalTubes; i++) {
      tubes.push([]);
    }
  
    /* ---------- ROUND-ROBIN DISTRIBUTION ---------- */
    let index = 0;
    pool.forEach(color => {
      while (tubes[index].length === tubeSize) {
        index = (index + 1) % colorCount;
      }
      tubes[index].push(color);
      index = (index + 1) % colorCount;
    });
  
    renderGame();
  }

  
/* ---------- RENDER ---------- */
function renderGame() {
  const tubeEls = document.querySelectorAll(".tube");

  tubeEls.forEach((tubeEl, i) => {
    tubeEl.innerHTML = "";
    tubeEl.onclick = () => handleClick(i);

    tubes[i].forEach(color => {
      const layer = document.createElement("div");
      layer.className = "layer";
      layer.style.background = color;
      tubeEl.appendChild(layer);
    });
  });
}

/* ---------- CLICK ---------- */
function handleClick(index) {
  if (selectedTube === null) {
    if (!tubes[index].length) return;
    selectedTube = index;
    highlight(index);
  } else {
    if (index !== selectedTube) pour(selectedTube, index);
    clearHighlight();
    selectedTube = null;
  }
}

/* ---------- POUR ---------- */
// function pour(from, to) {
//   if (!canPour(from, to)) return;

//   saveHistory();

//   const topColor = tubes[from][tubes[from].length - 1];

//   while (
//     tubes[from].length &&
//     tubes[from][tubes[from].length - 1] === topColor &&
//     tubes[to].length < tubeSize
//   ) {
//     tubes[to].push(tubes[from].pop());
//   }

//   renderGame();
//   checkWin();
// }

function finalizePour(from, to, color) {
    while (
      tubes[from].length &&
      tubes[from][tubes[from].length - 1] === color &&
      tubes[to].length < tubeSize
    ) {
      tubes[to].push(tubes[from].pop());
    }
  
    renderGame();
    applyWobble(to);
    checkWin();
  }

  
// function pour(from, to) {
//     if (!canPour(from, to)) return;
  
//     const sourceTube = document.querySelectorAll(".tube")[from];
//     const targetTube = document.querySelectorAll(".tube")[to];
  
//     const color = tubes[from][tubes[from].length - 1];
  
//     const sourceRect = sourceTube.getBoundingClientRect();
//     const targetRect = targetTube.getBoundingClientRect();
  
//     /* ---------- CREATE FLYING LIQUID ---------- */
//     const flying = document.createElement("div");
//     flying.className = "flying-liquid";
//     flying.style.background = color;
  
//     document.body.appendChild(flying);
  
//     const startX = sourceRect.left;
//     const startY = sourceRect.top;
//     const endX = targetRect.left;
//     const endY = targetRect.top;
  
//     let t = 0;
//     const duration = 400;
  
//     saveHistory();
  
//     function animate() {
//       t += 16 / duration;
//       if (t > 1) t = 1;
  
//       // Quadratic curve
//       const cx = (startX + endX) / 2;
//       const cy = Math.min(startY, endY) - 120;
  
//       const x =
//         (1 - t) * (1 - t) * startX +
//         2 * (1 - t) * t * cx +
//         t * t * endX;
  
//       const y =
//         (1 - t) * (1 - t) * startY +
//         2 * (1 - t) * t * cy +
//         t * t * endY;
  
//       flying.style.transform = `translate(${x}px, ${y}px)`;
  
//       if (t < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         document.body.removeChild(flying);
//         finalizePour(from, to, color);
//       }
//     }
  
//     animate();
//   }

// function pour(from, to) {
//     if (!canPour(from, to)) return;
  
//     saveHistory();
  
//     const topColor = tubes[from][tubes[from].length - 1];
//     let count = 0;
  
//     for (let i = tubes[from].length - 1; i >= 0; i--) {
//       if (tubes[from][i] === topColor && tubes[to].length + count < tubeSize) {
//         count++;
//       } else break;
//     }
  
//     animatePour(from, to, topColor, count, () => {
//       for (let i = 0; i < count; i++) {
//         tubes[to].push(tubes[from].pop());
//       }
  
//       renderGame();
//       checkWin();
//     });
//   }
  
  
// function canPour(from, to) {
//   if (!tubes[from].length) return false;
//   if (tubes[to].length === tubeSize) return false;
//   if (!tubes[to].length) return true;

//   return (
//     tubes[from][tubes[from].length - 1] ===
//     tubes[to][tubes[to].length - 1]
//   );
// }

function pour(from, to) {
  const src = gameState[from];
  const tgt = gameState[to];
  if (!src.length || tgt.length === TUBE_SIZE) return;

  const color = src[src.length - 1];
  if (tgt.length && tgt[tgt.length - 1] !== color) return;

  history.push(JSON.parse(JSON.stringify(gameState)));

  playSound("pour");

  animateArcLiquid(from, to, color, () => {
    while (
      src.length &&
      src[src.length - 1] === color &&
      tgt.length < TUBE_SIZE
    ) {
      tgt.push(src.pop());
    }
    render();
    checkTubeFilled(to);
    checkWin();
  });
}


/* ---------- UNDO ---------- */
function saveHistory() {
  history.push(JSON.stringify(tubes));
}

document.getElementById("undoBtn").onclick = () => {
  if (!history.length) return;
  tubes = JSON.parse(history.pop());
  renderGame();
};

/* ---------- RESTART ---------- */
document.getElementById("restartBtn").onclick = initGame;

/* ---------- WIN ---------- */
function checkWin() {
  const win = tubes.every(
    t =>
      t.length === 0 ||
      (t.length === tubeSize && t.every(c => c === t[0]))
  );

  if (win) {
    setTimeout(() => alert("🎉 YOU WIN!"), 100);
  }
}

/* ---------- HELPERS ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function highlight(i) {
  document.querySelectorAll(".tube")[i].style.outline = "3px solid yellow";
}

function clearHighlight() {
  document.querySelectorAll(".tube").forEach(
    t => (t.style.outline = "")
  );
}

function animatePour(fromIndex, toIndex, color, count, callback) {
    const tubesEls = document.querySelectorAll(".tube");
    const fromTube = tubesEls[fromIndex];
    const toTube = tubesEls[toIndex];
  
    const fromRect = fromTube.getBoundingClientRect();
    const toRect = toTube.getBoundingClientRect();
  
    let poured = 0;
  
    function pourOne() {
      if (poured >= count) {
        callback();
        return;
      }
  
      const liquid = document.createElement("div");
      liquid.className = "flying-liquid";
      liquid.style.background = color;
  
      document.body.appendChild(liquid);
  
      const startX = fromRect.left + fromRect.width / 2;
      const startY = fromRect.top + 10;
      const endX = toRect.left + toRect.width / 2;
      const endY = toRect.bottom - 10;
  
      liquid.animate([
        {
          transform: `translate(${startX}px, ${startY}px)`
        },
        {
          transform: `translate(${(startX + endX) / 2}px, ${Math.min(startY, endY) - 120}px)`
        },
        {
          transform: `translate(${endX}px, ${endY}px)`
        }
      ], {
        duration: 500,
        easing: "ease-in-out"
      });
  
      setTimeout(() => {
        liquid.remove();
        poured++;
        pourOne();
      }, 500);
    }
  
    pourOne();
  }


/* ---------- START ---------- */
initGame();

function applyWobble(index) {
    const tube = document.querySelectorAll(".tube")[index];
    tube.classList.add("wobble");
    setTimeout(() => tube.classList.remove("wobble"), 400);
  }
  
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

  
  