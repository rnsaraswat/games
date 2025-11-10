import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { supabase } from '../supabaseClient.js';
import { textToSpeechEng } from './speak.js';

const TABLE_NAME = "scores";

let currentData = [];
let currentSortColumn = null;
let currentSortOrder = 'asc';
let leaderboardData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 10;
let sNo = 1;

export function toggleLeaderboard() {
  if (document.getElementById("leaderboardPopup").style.display === 'block') {
    document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
    document.getElementById("leaderboardPopup").style.display = 'none';
    return;
  }
  document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
  document.getElementById("leaderboardPopup").style.display = 'block';
    renderLeaderboard();
}

document.getElementById("hide-leaderboard").addEventListener("click", () => {
  textToSpeechEng('Close Leaderboard');
  document.getElementById("leaderboardPopup").style.display = "none";
  document.getElementById("hide-leaderboard").textContent = "Hide Leaderboard";
  document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
})

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
    renderTable();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
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
      document.getElementById("leaderboardTableBody").textContent = "Global Leaderboard fetch error: " + res.status + errText;
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      document.getElementById("leaderboardTableBody").textContent = "⚠️ Unexpected response";
      return;
    }

    if (data.length === 0) {
      document.getElementById("leaderboardTableBody").textContent = "No scores yet.";
      return;
    }

    leaderboardData = data;
    filteredData = [...data];
    currentPage = 1;
    renderTable();

  } catch (err) {
    document.getElementById("leaderboardTableBody").textContent = "❌ Error loading global leaderboard: " + err;
  }
}

function renderTable() {
  const tbody = document.getElementById("leaderboardTableBody");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredData.slice(start, end);

  if (currentItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    document.getElementById("pageInfo").textContent = "";
    return;
  }

  tbody.innerHTML = currentItems
    .map(
      row => `
      <tr>
        <td>${sNo++}</td>
        <td>${row.game_id}</td>
        <td>${row.player_name}</td>
        <td>${!row.player_opponent ? "-" : row.player_opponent}</td>
        <td>${!row.size ? "-" : row.size}</td>
        <td>${!row.difficulty ? "-" : row.difficulty}</td>
        <td>${!row.score ? 0 : row.score}</td>
        <td>${Math.floor(row.elapsed / 3600)}:${Math.floor((row.elapsed % 3600) / 60)}:${row.elapsed % 60}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
        <td>${!row.moves ? "-" : row.moves}</td>
        <td>${!row.email ? "-" : row.email}</td>
        <td>${!row.filed1 ? "-" : row.filed1}</td>
        <td>${!row.filed2 ? "-" : row.filed2}</td>
        <td>${!row.filed3 ? "-" : row.filed3}</td>
        <td>${!row.filed4 ? "-" : row.filed4}</td>
      </tr>
    `
    )
    .join("");

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
}

export function sortTable(colIndex, order) {
  if (!filteredData || filteredData.length === 0) return;
  currentSortColumn = colIndex;
  currentSortOrder = order;

  filteredData.sort((a, b) => {
    let valA, valB;
    switch (colIndex) {
      case 0:
        valA = (a.game_id).toLowerCase();
        valB = (b.game_id).toLowerCase();
        break;
      case 1:
        valA = (a.player_name).toLowerCase();
        valB = (b.player_name).toLowerCase();
        break;
      case 2:
        valA = (a.player_opponent).toLowerCase();
        valB = (b.player_opponent).toLowerCase();
        break;
      case 3:
        valA = (a.size).toLowerCase();
        valB = (b.size).toLowerCase();
        break;
      case 4:
        valA = (a.difficulty).toLowerCase();
        valB = (b.difficulty).toLowerCase();
        break;
      case 5:
        valA = a.score || 0;
        valB = b.score || 0;
        break;
      case 6:
        valA = a.elapsed || 0;
        valB = b.elapsed || 0;
        break;
      case 7:
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
        break;
      case 8:
        valA = a.moves || 0;
        valB = b.moves || 0;
        break;
      case 9:
        valA = (a.email).toLowerCase();
        valB = (b.email).toLowerCase();
        break;
      case 10:
        valA = (a.filed1) || 0;
        valB = (b.filed1) || 0;
        break;
      case 11:
        valA = (a.filed2) || 0;
        valB = (b.filed2) || 0;
        break;
      case 12:
        valA = (a.filed3).toLowerCase();
        valB = (b.filed3).toLowerCase();
        break;
      case 13:
        valA = (a.field4).toLowerCase();
        valB = (b.filed4).toLowerCase();
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

export async function saveScore(player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at) {
  const EDGE_FUNCTION_URL = ""; 
  try {
    if (EDGE_FUNCTION_URL) {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at })
      });
      const json = await res.json();
      await renderLeaderboard(game_id);
      return json;
    } else {
      const { data, error } = await supabase.from(TABLE_NAME).insert([{ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at }]);
      if (error) throw error;
      await renderLeaderboard(game_id);
      return data;
    }
  } catch (err) {
    document.getElementById("leaderboardTableBody").textContent = "Score save error in global leaderboard" + err;
    throw err;
  }
}