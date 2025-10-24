import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ";
const TABLE_NAME = "scores";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allScores = [];
let currentSort = { column: 'score', asc: false };
let searchQuery = '';
let currentData = [];
// let sortDirections = [true, true, true, true];
let currentSortColumn = null;
let currentSortOrder = 'asc';


export async function renderLeaderboard() {
  try {
    // const res = await fetch("https://bkhoexvgorxzgdujofar.supabase.co/rest/v1/leaderboard?select=*");
    const res = await fetch("https://bkhoexvgorxzgdujofar.supabase.co/rest/v1/scores?select=*", {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    const data = await res.json();
    currentData = data;
    displayTable(currentData);
  } catch (err) {
    console.error("❌ Error loading leaderboard:", err);
  }
}

// 📋 टेबल दिखाएं
function displayTable(data) {
  const tbody = document.getElementById("leaderboardTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center">No records found</td></tr>`;
    return;
  }

  data.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.player_name || "Guest"}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
      <td>${row.score}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 🔼🔽 Sorting logic
export function sortTable(colIndex, order) {
  if (!currentData || currentData.length === 0) return;
  currentSortColumn = colIndex;
  currentSortOrder = order;

  currentData.sort((a, b) => {
    let valA, valB;
    switch (colIndex) {
      case 0:
        valA = (a.player_name || "Guest").toLowerCase();
        valB = (b.player_name || "Guest").toLowerCase();
        break;
      case 1:
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
        break;
      // case 3:
      //   valA = a.score || 0;
      //   valB = b.score || 0;
      //   break;
      default:
        // valA = a.id || 0;
        // valB = b.id || 0;
          valA = a.score || 0;
          valB = b.score || 0;
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  updateIndicators(colIndex, order);
  displayTable(currentData);
}

// 🧭 Indicators अपडेट करें
function updateIndicators(activeCol, order) {
  const headers = document.querySelectorAll("#leaderboardTable thead th");
  headers.forEach((th, i) => {
    const arrows = th.querySelectorAll(".arrow");
    arrows.forEach(arrow => {
      arrow.style.opacity = "0.3"; // inactive
    });

    if (i === activeCol + 1) {
      const arrow = th.querySelector(`.arrow.${order}`);
      if (arrow) arrow.style.opacity = "1"; // highlight active
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
    displayTable(filtered);
  });
}

// 🧩 Header click event binding
document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("#leaderboardTable thead th.sortable");
  headers.forEach((th, i) => {
    const up = th.querySelector(".arrow.asc");
    const down = th.querySelector(".arrow.desc");
    up.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'asc'); });
    down.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'desc'); });
  });
});


export async function saveScore(game_id, score) {
  const player_name = localStorage.getItem('player_name') || 'Guest';
  const email = localStorage.getItem('email') || '';

  const EDGE_FUNCTION_URL = ""; 
  try {
    if (EDGE_FUNCTION_URL) {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name, email, game_id, score })
      });
      const json = await res.json();
      // after save, refresh
      await renderLeaderboard(game_id);
      return json;
    } else {
      // direct insert (uses anon key, ensure policies allow insert if doing client-side)
      const { data, error } = await supabase.from(TABLE_NAME).insert([{ player_name, email, game_id, score }]);
      if (error) throw error;
      await renderLeaderboard(game_id);
      return data;
    }
  } catch (err) {
    console.error('saveScore error:', err);
    throw err;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]));
}




