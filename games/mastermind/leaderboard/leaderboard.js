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
    // const listEl = document.getElementById("leaderboardList");
    // if (!listEl) return;

    // listEl.innerHTML = "⏳ Loading...";

    try {
        const game = "mastermind"; 
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
            // listEl.innerHTML = `<div style="color:crimson">⚠️ Unable to load leaderboard (${res.status})</div>`;
            // return;
        }


        const data = await res.json();

        if (!Array.isArray(data)) {
          console.log("⚠️ Unexpected response");
            // listEl.innerHTML = `<div style="color:crimson">⚠️ Unexpected response</div>`;
            return;
        }

        if (data.length === 0) {
          console.log("No scores yet.");
          // listEl.innerHTML = "<div style='color:var(--muted)'>No scores yet.</div>";
            return;
        }

        currentData = data;
        displayTable(currentData);

    } catch (err) {
      console.error("❌ Error loading leaderboard:", err);
      // listEl.innerHTML = `<div style="color:crimson">❌ Error loading leaderboard</div>`;
    }
}

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
      <td>${row.game_id}</td>
      <td>${row.score}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
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
        valA = (a.game_id).toLowerCase();
        valB = (b.game_id).toLowerCase();
        break;
      case 2:
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

// function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c])); }


export async function saveScore(game_id, score) {
    const player_name = localStorage.getItem("player_name") || "Guest";
    const email = localStorage.getItem("email") || "";
  
    try {
      const res = await fetch("https://bkhoexvgorxzgdujofar.supabase.co/functions/v1/submit-score", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          player_name,
          email,
          game_id,
          score
        })
      });
  
      const data = await res.json();
      console.log("✅ Score saved:", data);
      return data;
    } catch (err) {
      console.error("❌ Error saving score:", err);
      throw err;
    }
  }

  
  