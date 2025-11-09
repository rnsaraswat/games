export const leaderboardEl = document.getElementById('leaderboard');
import { sec, min, hrs } from './timer.js';
import { modeEl, difficultyEl } from './script.js';

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
  if (leaderboardEl.style.display === 'block') {
    document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
    leaderboardEl.style.display = 'none';
    return;
  }
  const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
  if (data.length === 0) {
    leaderboardEl.innerHTML = '<h3>🏆 Leaderboard</h3><p>No entries yet.</p>';
  } else {
    leaderboardEl.innerHTML = `<h3>🏆 Leaderboard</h3><table><thead><tr><th>Winner</th><th>Mode</th><th>Difficulty</th><th>Time</th><th>Elapsed</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.winner}</td><td>${entry.mode}</td><td>${entry.difficulty}</td><td>${entry.time}</td><td>${entry.elapsed}</td></tr>`).join('')}</tbody></table>`;
  }
  leaderboardEl.style.display = 'block';
}

// clear leaderboard data
export function clearLeaderboard() {
  if (confirm("Do you realy Want to Remove Leaderboard data?")) {
    localStorage.removeItem('leaderboard');
    alert("Leaderboard Data is Cleared");
  }
}