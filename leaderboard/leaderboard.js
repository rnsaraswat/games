import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { supabase } from '../supabaseClient.js';
import { textToSpeechEng } from './speak.js';

// const SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ"; 

const TABLE_NAME = "scores";

let currentData = [];
let currentSortColumn = null;
let currentSortOrder = 'asc';
let gameId = document.getElementById("gameFilter").value || "tictactoe";

let leaderboardData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 10;
let sNo = 1;

// window.sortTable = sortTable;

// const gameid = document.getElementById("gameFilter").value;

// window.addEventListener("DOMContentLoaded", () => {
//     renderLeaderboard();
// });

//code for toggle leaderbaord in popup box
//toggle Global leaderboard Listener
document.getElementById("toggle-leaderboard").addEventListener("click", () => {
  if (document.getElementById("toggle-leaderboard").textContent === "Global Leaderboard") {
    document.getElementById("toggle-leaderboard").textContent = "Hide Global Leaderboard";
    textToSpeechEng('Open Global Leaderboard');
    toggleLeaderboard();
    // renderLeaderboard();
  } else {
    document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard"
    textToSpeechEng('Close Global Leaderboard');
    document.getElementById("leaderboardPopup").style.display = "none";
  }
});

// save score to leaderboard
// export function saveToLeaderboard(game, winner) {
//   if (winner === 'draw') return;
//   // let name = winner.toUpperCase();
//   let elapsed = `${hrs}:${min}:${sec}`;
//   const mode = modeEl.value;
//   const difficulty = difficultyEl.value;
//   const time = new Date().toLocaleString();

//   const entry = { winner, game, mode, difficulty, time, elapsed };
//   console.log(entry);
//   const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
//   boardData.push(entry);
//   localStorage.setItem("leaderboard", JSON.stringify(boardData));
// }

// toggle leaderboard
export function toggleLeaderboard() {
  // let list = document.getElementById("leaderboardList");
  if (document.getElementById("leaderboardPopup").style.display === 'block') {
    document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
    document.getElementById("leaderboardPopup").style.display = 'none';
    return;
  }
  // const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  document.getElementById("toggle-leaderboard").textContent = "Hide  Leaderboard";
  // if (data.length === 0) {
  //   list.innerHTML = '<p>No entries yet.</p>';
  // } else {
  //   list.innerHTML = `<table><thead><tr><th>Winner</th><th>Mode</th><th>Difficulty</th><th>Time</th><th>Elapsed</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.winner}</td><td>${entry.mode}</td><td>${entry.difficulty}</td><td>${entry.time}</td><td>${entry.elapsed}</td></tr>`).join('')}</tbody></table>`;
  // }
  document.getElementById("leaderboardPopup").style.display = 'block';
    renderLeaderboard();
}

//hide leaderbaord
document.getElementById("hide-leaderboard").addEventListener("click", () => {
  textToSpeechEng('Close Leaderboard');
  document.getElementById("leaderboardPopup").style.display = "none";
  document.getElementById("hide-leaderboard").textContent = "Hide Leaderboard";
  document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
})
// code for popupleaderboard


document.getElementById("searchInput").addEventListener("input", handleSearch);
document.getElementById("topSelect").addEventListener("change", handleTopSelect);
document.getElementById("prevPage").addEventListener("click", prevPage);
document.getElementById("nextPage").addEventListener("click", nextPage);

document.querySelectorAll("#leaderboardTable th").forEach(th => {
  th.addEventListener("click", () => handleSort(th.dataset.column));
});

function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  filteredData = leaderboardData.filter(row =>
    row.player_name?.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderTable();
}

function handleTopSelect(e) {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    // sNo = currentPage * itemsPerPage;
    renderTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    // sNo = currentPage * itemsPerPage;
    currentPage++;
    renderTable();
  }
}

gameFilter.addEventListener("change", async (event) => {
  const q = event.target.value.toLowerCase();
  if (q == "all") {
    filteredData = leaderboardData;

  } else {
    filteredData = leaderboardData.filter(row =>
      (row.game_id).toLowerCase().includes(q)
    );
  }
  currentPage = 1;
  renderTable();
});

export async function renderLeaderboard() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/scores?select=*`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (!res.ok) {
      let errText;
      try { errText = await res.json(); } catch (e) { errText = await res.text(); }
      document.getElementById("leaderboardTableBody").textContent = "Leaderboard fetch error: " + res.status + errText;
      // console.error("Leaderboard fetch error:", res.status, errText);
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      // console.log("⚠️ Unexpected response");
      document.getElementById("leaderboardTableBody").textContent = "⚠️ Unexpected response";
      return;
    }

    if (data.length === 0) {
      // console.log("No scores yet.");
      document.getElementById("leaderboardTableBody").textContent = "No scores yet.";
      return;
    }

    leaderboardData = data;
    filteredData = [...data];
    currentPage = 1;
    renderTable();

  } catch (err) {
    // console.error("❌ Error loading leaderboard:", err);
    document.getElementById("leaderboardTableBody").textContent = "❌ Error loading leaderboard: " + err;
  }
}

function renderTable() {
  const tbody = document.getElementById("leaderboardTableBody");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredData.slice(start, end);
  // console.log("start", start, end);

  if (currentItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    document.getElementById("pageInfo").textContent = "";
    return;
  }

  // sNo = 1;
  tbody.innerHTML = currentItems
    .map(
      row => `
      <tr>
        <td>${localsNo++}</td>
        <td>${row.name}</td>
        <td>${row.opponent}</td>
        <td>${row.email}</td>
        <td>${row.size}</td>
        <td>${row.difficulty}</td>
        <td>${row.game}</td>
        <td>${row.score}</td>
        <td>${row.elapsed}</td>
        <td>${row.moves}</td>
        <td>${row.field1}</td>
        <td>${row.field2}</td>
        <td>${row.field3}</td>
        <td>${row.field4}</td>
        <td>${new Date(row.time).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
}

// 🔼🔽 Sorting logic
export function sortTable(colIndex, order) {
  if (!filteredData || filteredData.length === 0) return;
  currentSortColumn = colIndex;
  currentSortOrder = order;

  filteredData.sort((a, b) => {
    let valA, valB;
    switch (colIndex) {
      case 0:
        valA = (a.player_name || "Guest").toLowerCase();
        valB = (b.player_name || "Guest").toLowerCase();
        break;
      case 1:
        valA = (a.player_opponent || "Guest").toLowerCase();
        valB = (b.player_opponent || "Guest").toLowerCase();
        break;
      case 2:
        valA = (a.game_id).toLowerCase();
        valB = (b.game_id).toLowerCase();
        break;
      case 3:
        valA = (a.email).toLowerCase();
        valB = (b.email).toLowerCase();
        break;
      case 4:
        valA = (a.size).toLowerCase();
        valB = (b.size).toLowerCase();
        break;
      case 5:
        valA = (a.difficulty).toLowerCase();
        valB = (b.difficulty).toLowerCase();
        break;
      case 6:
        valA = a.moves || 0;
        valB = b.moves || 0;
        break;
      case 7:
        valA = a.score || 0;
        valB = b.score || 0;
        break;
      case 8:
        valA = a.elapsed || 0;
        valB = b.elapsed || 0;
        break;
      case 9:
        valA = (a.field1) || 0;
        valB = (b.field1) || 0;
        break;
      case 10:
        valA = (a.field2) || 0;
        valB = (b.field2) || 0;
        break;
      case 11:
        valA = (a.field3).toLowerCase();
        valB = (b.field3).toLowerCase();
        break;
      case 12:
        valA = (a.field4).toLowerCase();
        valB = (b.field4).toLowerCase();
        break;
      default:
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  updateIndicators(colIndex, order);
  renderTable();
}

function updateIndicators(activeCol, order) {
  const headers = document.querySelectorAll("#leaderboardTable thead th");
  headers.forEach((th, i) => {
    const arrows = th.querySelectorAll(".arrow");
    arrows.forEach(arrow => {
      arrow.style.opacity = "1";
    });

    if (i === activeCol + 1) {
      const arrow = th.querySelector(`.arrow.${order}`);
      if (arrow) arrow.style.opacity = "0.3";
    }
  });
}

// 🔍 Search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = currentData.filter(row =>
      (row.player_name || "Guest").toLowerCase().includes(q)
    );
    renderTable(filtered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("#leaderboardTable thead th.sortable");
  headers.forEach((th, i) => {
    const up = th.querySelector(".arrow.asc");
    const down = th.querySelector(".arrow.desc");
    up.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'asc'); });
    down.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'desc'); });
  });
});
export async function saveScore(player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, field1, field2, field3, field4, time) {
  player_name = localStorage.getItem('player_name') || 'Guest';
  email = localStorage.getItem('email') || '';

  const EDGE_FUNCTION_URL = ""; 
  try {
    if (EDGE_FUNCTION_URL) {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, field1, field2, field3, field4, time })
      });
      const json = await res.json();
      // after save, refresh
      await renderLeaderboard(game_id);
      return json;
    } else {
      // direct insert (uses anon key, ensure policies allow insert if doing client-side)
      const { data, error } = await supabase.from(TABLE_NAME).insert([{ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, field1, field2, field3, field4, moves  }]);
      if (error) throw error;
      await renderLeaderboard(game_id);
      return data;
    }
  } catch (err) {
    console.error('saveScore error:', err);
    throw err;
  }
}