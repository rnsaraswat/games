export function tubeConfetti() {
    confetti({ particleCount: 60, spread: 50 });
  }
  
  export function winFireworks() {
    const end = Date.now() + 2000;
    const i = setInterval(()=>{
      confetti({
        particleCount: 80,
        spread: 360,
        origin: { x: Math.random(), y: Math.random()*0.5 }
      });
      if (Date.now() > end) clearInterval(i);
    }, 300);
  }


//   4️⃣ 🎆 CONFETTI & FIREWORKS
// 🔹 When ONE TUBE FULL
function checkTubeFilled(index) {
  const t = gameState[index];
  if (
    t.length === TUBE_SIZE &&
    t.every(c => c === t[0])
  ) {
    launchConfetti();
  }
}

// 🔹 When FULL GAME COMPLETE
function checkWin() {
  const win = gameState.every(t => {
    if (!t.length) return true;
    if (t.length < TUBE_SIZE) return false;
    return t.every(c => c === t[0]);
  });

  if (win) {
    playSound("win");
    launchFireworks();
    setTimeout(() => showLevelScreen(), 2000);
  }
}

// 🔹 Confetti / Fireworks (Simple)
function launchConfetti() {
  confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
}

function launchFireworks() {
  const end = Date.now() + 2000;
  const interval = setInterval(() => {
    confetti({
      particleCount: 60,
      spread: 360,
      startVelocity: 45,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.5
      }
    });
    if (Date.now() > end) clearInterval(interval);
  }, 300);
}


// (👉 canvas-confetti CDN use करें)

  