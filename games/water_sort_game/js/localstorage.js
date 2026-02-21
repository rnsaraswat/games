// SAVE LEVEL PROGRESS
// 🔹 localStorage Structure
const SAVE_KEY = "waterSortProgress";

function loadProgress() {
  return JSON.parse(localStorage.getItem(SAVE_KEY)) || {
    unlocked: 1,
    current: 0,
    undoPlus: 0
  };
}

function saveProgress(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

let progress = loadProgress();

// 🔹 On Level Complete → Save
function onLevelComplete() {
  if (progress.unlocked < currentLevel + 2) {
    progress.unlocked = currentLevel + 2;
  }
  progress.current = currentLevel + 1;
  saveProgress(progress);
}

// 2️⃣ 🔒 LOCKED LEVELS (Level Select Upgrade)
// 🔹 Level Screen Button Logic
function showLevelScreen() {
  const box = document.getElementById("levelButtons");
  box.innerHTML = "";

  LEVELS.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = "Level " + (i + 1);

    if (i + 1 > progress.unlocked) {
      btn.disabled = true;
      btn.textContent += " 🔒";
    } else {
      btn.onclick = () => {
        currentLevel = i;
        document.getElementById("levelScreen").style.display = "none";
        initLevel();
      };
    }

    box.appendChild(btn);
  });
}