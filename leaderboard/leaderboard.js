import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

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
let gameId = document.getElementById("gameFilter").value || "tictactoe";

let leaderboardData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 10;

// ------display leaderboard without table and without sort---
// window.addEventListener("DOMContentLoaded", async () => {
//   const gameFilter = document.getElementById("gameFilter");
//   const listEl = document.getElementById("leaderboardList");

//   if (!gameFilter || !listEl) {
//     console.error("❌ Missing #gameFilter or #leaderboardList element in HTML.");
//     return;
//   }

//   // Default game
//   let gameId = gameFilter.value || "tictactoe";

//   // Load initial leaderboard
//   await loadTop(gameId);

//   // On game selection change
//   gameFilter.addEventListener("change", async (event) => {
//     gameId = event.target.value;
//     await loadTop(gameId);
//   });

//   // 🧩 Load top scores
//   async function loadTop(gameId) {
//     listEl.innerHTML = '<div style="color:var(--muted)">⏳ Loading...</div>';
//     try {
//       const { data, error } = await supabase
//         .from("scores")
//         .select("*")
//         .eq("game_id", gameId)
//         .order("score", { ascending: false })
//         .limit(10);

//       if (error) throw error;

//       if (!data || data.length === 0) {
//         listEl.innerHTML = '<div style="color:var(--muted)">No scores yet.</div>';
//         return;
//       }

//       renderRows(data);
//     } catch (err) {
//       listEl.innerHTML = '<div style="color:crimson">⚠️ Error loading scores</div>';
//       console.error(err);
//     }
//   }

//   // 🎨 Render leaderboard rows
//   function renderRows(rows) {
//     listEl.innerHTML = rows
//       .map(
//         (r, i) => `
//         <div class="score-row">
//           <div>
//             <strong>${i + 1}. ${escapeHtml(r.player_name || "Anonymous")}</strong>
//             <div class="muted">${new Date(r.created_at).toLocaleString()}</div>
//           </div>
//           <div class="score">${r.score}</div>
//         </div>`
//       )
//       .join("");
//   }

//   function escapeHtml(s) {
//     return String(s).replace(/[&<>"']/g, (c) => ({
//       "&": "&amp;",
//       "<": "&lt;",
//       ">": "&gt;",
//       '"': "&quot;",
//       "'": "&#39;"
//     }[c]));
//   }
// });
// ------display leaderboard without table and without sort---

document.getElementById("searchInput").addEventListener("input", handleSearch);
document.getElementById("topSelect").addEventListener("change", handleTopSelect);
document.getElementById("prevPage").addEventListener("click", prevPage);
document.getElementById("nextPage").addEventListener("click", nextPage);

document.querySelectorAll("#leaderboardTable th").forEach(th => {
  th.addEventListener("click", () => handleSort(th.dataset.column));
});

// await loadLeaderboard();

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
      console.error("Leaderboard fetch error:", res.status, errText);
      return;
    }


    const data = await res.json();

    if (!Array.isArray(data)) {
      console.log("⚠️ Unexpected response");
      return;
    }

    if (data.length === 0) {
      console.log("No scores yet.");
      return;
    }

      leaderboardData = data;
      filteredData = [...data];
      currentPage = 1;
      renderTable();

  } catch (err) {
    console.error("❌ Error loading leaderboard:", err);
  }
}

function renderTable() {
  const tbody = document.getElementById("leaderboardTableBody");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredData.slice(start, end);
  console.log("currentItems",currentItems);
  console.log("start",start, end);

  if (currentItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    document.getElementById("pageInfo").textContent = "";
    return;
  }

  let i = 1;
  tbody.innerHTML = currentItems
    .map(
      row => `
      <tr>
        <td>${i++}</td>
        <td>${row.player_name}</td>
        <td>${row.game_id}</td>
        <td>${row.score}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
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
        valA = (a.game_id).toLowerCase();
        valB = (b.game_id).toLowerCase();
        break;
      case 2:
        valA = a.score || 0;
        valB = b.score || 0;
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