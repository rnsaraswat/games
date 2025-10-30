// export cotoggle-leaderboardnst leaderboardEl = document.getElementById('leaderboard');
// import { sec, min, hrs } from './timer.js';
// import { modeEl, difficultyEl } from './script.js';
import { textToSpeechEng } from './speak.js';

//toggle leaderboard Listener
document.getElementById("local-toggle-leaderboard").addEventListener("click", () => {
  if (document.getElementById("local-toggle-leaderboard").textContent === "Local Leaderboard") {
      document.getElementById("local-toggle-leaderboard").textContent = "Hide Local Leaderboard";
      textToSpeechEng('Open Local Leaderboard');
      toggleLeaderboard();
  } else {
      document.getElementById("local-toggle-leaderboard").textContent = "Local Leaderboard"
      textToSpeechEng('Close Local Leaderboard');
      document.getElementById("leaderboardPopup").style.display = "none";
  }
});

//toggle leaderboard Listener
document.getElementById("global-toggle-leaderboard").addEventListener("click", () => {
  if (document.getElementById("global-toggle-leaderboard").textContent === "Global Leaderboard") {
      document.getElementById("global-toggle-leaderboard").textContent = "Hide Global Leaderboard";
      textToSpeechEng('Open Global Leaderboard');
      toggleLeaderboard();
  } else {
      document.getElementById("global-toggle-leaderboard").textContent = "Hide Global Leaderboard";
      textToSpeechEng('Close Global Leaderboard');
      document.getElementById("leaderboardPopup").style.display = "none";
  }
});

// save score to leaderboard
export function saveToLeaderboard(winner) {
  if (winner === 'draw') return;
  // let name = winner.toUpperCase();
  let elapsed = `${hrs}:${min}:${sec}`;
  const mode = modeEl.value;
  const difficulty = difficultyEl.value;
  const time = new Date().toLocaleString();

  const entry = { winner, mode, difficulty, time, elapsed };
  console.log(entry);
  const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  boardData.push(entry);
  localStorage.setItem("leaderboard", JSON.stringify(boardData));
}

// toggle leaderboard
export function toggleLeaderboard() {
    let list = document.getElementById("leaderboardList");
    if (document.getElementById("leaderboardList").style.display === 'block') {
    document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
    list.style.display = 'none';
    return;
  }
  const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
  if (data.length === 0) {
    list.innerHTML = '<p>No entries yet.</p>';
  } else {
    list.innerHTML = `<table><thead><tr><th>Winner</th><th>Mode</th><th>Difficulty</th><th>Time</th><th>Elapsed</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.winner}</td><td>${entry.mode}</td><td>${entry.difficulty}</td><td>${entry.time}</td><td>${entry.elapsed}</td></tr>`).join('')}</tbody></table>`;
  }
  document.getElementById("leaderboardPopup").style.display = 'block';
}

//hide leaderbaord
document.getElementById("hide-leaderboard").addEventListener("click", () => {
  textToSpeechEng('Close Leaderboard');
  document.getElementById("leaderboardPopup").style.display = "none";
  document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
})

// clear leaderboard data
export function clearLeaderboard() {
  if (confirm("Do you realy Want to Remove Leaderboard data?")) {
    localStorage.removeItem('leaderboard');
    alert("Leaderboard Data is Cleared");
    textToSpeechEng('Leaderboard data cleared');
  }
}
