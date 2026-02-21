export function addExtraTube(gameState) {
    gameState.push([]);
  }
  


//   4️⃣ 🎮 POWER-UPS SYSTEM
// 🎯 Power-Ups State
const powerUps = {
  extraTubeUsed: false,
  undoPlus: progress.undoPlus || 0
};

// ➕ Extra Empty Tube (1 time per level)
// 🔹 Button
<button onclick="useExtraTube()">➕ Extra Tube</button>

// 🔹 Logic
function useExtraTube() {
  if (powerUps.extraTubeUsed) return;

  gameState.push([]);
  powerUps.extraTubeUsed = true;
  render();
}