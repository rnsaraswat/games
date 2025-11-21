export const leaderboardEl = document.getElementById('leaderboard');
import { seconds, minutes, hours } from './timer.js';
import { maxAttempts, attemptsLeft, player1, slotCount, colorCount, allowDuplicates } from './script.js';

// save score to leaderboard
export function saveToLeaderboard() {
    let round = maxAttempts - attemptsLeft;
    let elapsed = `${hours}:${minutes}:${seconds}`;
    const time = new Date().toLocaleString();
    const entry = { player1, slotCount, colorCount, allowDuplicates, round, time, elapsed };
    const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    boardData.push(entry);
    localStorage.setItem("leaderboard", JSON.stringify(boardData));
}

// toggle leaderboard
export function toggleLeaderboard() {
    if (document.getElementById("leaderboard").style.display === 'block') {
        document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
        document.getElementById("leaderboard").style.display = 'none';
        document.getElementById("clearleaderboard").style.display = 'none';
        return;
    }
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    document.getElementById("clearleaderboard").style.display = 'block';
    document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
    if (data.length === 0) {
        document.getElementById("leaderboard").innerHTML = '<h3>🏆 Leaderboard</h3><p>No entries yet.</p>';
    } else {
        document.getElementById("leaderboard").innerHTML = `<h3>🏆 Leaderboard</h3><table><thead><tr><th>Winner</th><th>Slots</th><th>Colors</th><th>Duplicate Colors</th><th>Attempts</th><th>Time</th><th>Elapsed</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.player1}</td><td>${entry.slotCount}</td><td>${entry.colorCount}</td><td>${entry.allowDuplicates}</td><td>${entry.round}</td><td>${entry.time}</td><td>${entry.elapsed}</td></tr>`).join('')}</tbody></table>`;
    }
    document.getElementById("leaderboard").style.display = 'block';
}

document.getElementById("clearleaderboard").onclick = clearLeaderboard;

// clear leaderboard data
export function clearLeaderboard() {
    if (confirm("Do you realy Want to Remove Leaderboard data?")) {
        localStorage.removeItem('leaderboard');
        alert("Leaderboard Data is Cleared");
    }
}