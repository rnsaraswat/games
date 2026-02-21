// game.js

// game info (har game me change kar sakte ho)
window.siteName = "Ravindra Games Hub";
window.gameName = "Memory Game";

function winGame() {

  const score = 250; // example
  window.finalScore = score;

  // 👇 VERY IMPORTANT FLOW
  handleWin();
}

async function handleWin() {

  // 1️⃣ confetti poora dikhao
  await launchConfetti();

  // 2️⃣ uske baad share kholo
  shareMobile();
}
