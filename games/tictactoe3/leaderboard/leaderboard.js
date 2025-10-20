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
// ---------- public exports ----------
// export async function renderLeaderboard(game_id = 'tictactoe') {
//   const tbody = document.getElementById('leaderboardTableBody');
//   console.log("🧩 Table body element:", tbody);

//   // const searchInput = document.getElementById('searchInput');

//   if (!tbody) {
//     console.error('renderLeaderboard: #leaderboardTableBody not found in DOM.');
//     return;
//   }


//   console.log("✅ renderLeaderboard() called");

//   const response = await fetch("https://bkhoexvgorxzgdujofar.supabase.co/rest/v1/scores?select=*", {
//     headers: {
//       apikey: SUPABASE_ANON_KEY,
//       Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
//     }
//   });
//   const data = await response.json();

//   console.log("📊 Data received:", data);

//   currentData = data;
//     displayTable(currentData);

//   // const tbody = document.getElementById("leaderboardTableBody");
//   // console.log("🧩 Table body element:", tbody);

//   // if (!tbody) {
//   //   console.error("❌ Table body not found!");
//   //   return;
//   // }

//   // tbody.innerHTML = "";

//   // data.forEach((row, index) => {
//   //   const tr = document.createElement("tr");
//   //   tr.innerHTML = `
//   //     <td>${index + 1}</td>
//   //     <td>${row.player_name || "Guest"}</td>
//   //     <td>${new Date(row.created_at).toLocaleString()}</td>
//   //     <td>${row.score}</td>
//   //   `;
//   //   tbody.appendChild(tr);
//   // });

//   // console.log("✅ Leaderboard rendered!");


//   // attach search listener once
//   // if (searchInput && !searchInput._listenerAttached) {
//   //   searchInput.addEventListener('input', (e) => {
//   //     searchQuery = (e.target.value || '').trim().toLowerCase();
//   //     _renderTable();
//   //   });
//   //   searchInput._listenerAttached = true;
//   // }

//   // const searchInput = document.getElementById("searchInput");
//   // if (searchInput) {
//   //   searchInput.addEventListener("input", e => {
//   //     const q = e.target.value.toLowerCase();
//   //     const filtered = currentData.filter(row =>
//   //       (row.player_name || "Guest").toLowerCase().includes(q)
//   //     );
//   //     displayTable(filtered);
//   //   });
//   // }

//   // fetch data from supabase
//   // tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">Loading...</td></tr>`;

//   try {
//     const { data, error } = await supabase
//       .from(TABLE_NAME)
//       .select('player_name,score,created_at,game_id')
//       .eq('game_id', game_id)
//       .order('score', { ascending: false });

//     if (error) {
//       console.error('Supabase fetch error:', error);
//       tbody.innerHTML = `<tr><td colspan="4" style="color:crimson;text-align:center">Error loading leaderboard</td></tr>`;
//       return;
//     }

//     allScores = Array.isArray(data) ? data : [];
//     _renderTable();
//   } catch (err) {
//     console.error('Fetch exception:', err);
//     tbody.innerHTML = `<tr><td colspan="4" style="color:crimson;text-align:center">Error loading leaderboard</td></tr>`;
//   }
// }

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
      case 1:
        valA = (a.player_name || "Guest").toLowerCase();
        valB = (b.player_name || "Guest").toLowerCase();
        break;
      case 2:
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
        break;
      case 3:
        valA = a.score || 0;
        valB = b.score || 0;
        break;
      default:
        valA = a.id || 0;
        valB = b.id || 0;
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

    if (i === activeCol) {
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
// function displayTable(data) {
//   const tbody = document.getElementById("leaderboardTableBody");
//   if (!tbody) return;
//   tbody.innerHTML = "";

//   data.forEach((row, i) => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td>${i + 1}</td>
//       <td>${row.player_name || "Guest"}</td>
//       <td>${new Date(row.created_at).toLocaleString()}</td>
//       <td>${row.score}</td>
//     `;
//     tbody.appendChild(tr);
//   });
// }

// 📋 टेबल रेंडर करें
// function displayTable(data) {
//   const tbody = document.getElementById("leaderboardTableBody");
//   if (!tbody) return;
//   tbody.innerHTML = "";

//   if (!data || data.length === 0) {
//     tbody.innerHTML = `<tr><td colspan="4" style="text-align:center">No records found</td></tr>`;
//     return;
//   }

//   data.forEach((row, i) => {
//     const tr = document.createElement("tr");
//     tr.innerHTML = `
//       <td>${i + 1}</td>
//       <td>${row.player_name || "Guest"}</td>
//       <td>${new Date(row.created_at).toLocaleString()}</td>
//       <td>${row.score}</td>
//     `;
//     tbody.appendChild(tr);
//   });
// }

// window.sortTable = function (colIndex) {
//   sortDirections[colIndex] = !sortDirections[colIndex];
//   const asc = sortDirections[colIndex];

//   currentData.sort((a, b) => {
//     const keys = ["id", "player_name", "created_at", "score"];
//     let valA = a[keys[colIndex]];
//     let valB = b[keys[colIndex]];

//     if (keys[colIndex] === "created_at") {
//       valA = new Date(valA);
//       valB = new Date(valB);
//     }

//     return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
//   });

//   displayTable(currentData);
// };

// // 🔼🔽 Sorting function (column click पर)
// // export function sortTable(colIndex) {
// window.sortTable = function (colIndex) {
//   if (!currentData || currentData.length === 0) return;

//   sortDirections[colIndex] = !sortDirections[colIndex];
//   const asc = sortDirections[colIndex];

//   currentData.sort((a, b) => {
//     let valA, valB;

//     switch (colIndex) {
//       case 0:
//         valA = a.id || 0;
//         valB = b.id || 0;
//         break;
//       case 1:
//         valA = (a.player_name || "Guest").toLowerCase();
//         valB = (b.player_name || "Guest").toLowerCase();
//         break;
//       case 2:
//         valA = new Date(a.created_at);
//         valB = new Date(b.created_at);
//         break;
//       case 3:
//         valA = a.score || 0;
//         valB = b.score || 0;
//         break;
//       default:
//         return 0;
//     }

//     if (valA < valB) return asc ? -1 : 1;
//     if (valA > valB) return asc ? 1 : -1;
//     return 0;
//   });

//   displayTable(currentData);
// };

// 🔼🔽 Sort function
// export function sortTable(colIndex) {
//   if (!currentData || currentData.length === 0) return;

//   // toggle direction if same column clicked again
//   if (currentSortColumn === colIndex) {
//     sortDirections[colIndex] = !sortDirections[colIndex];
//   } else {
//     currentSortColumn = colIndex;
//   }

//   const asc = sortDirections[colIndex];

//   currentData.sort((a, b) => {
//     let valA, valB;
//     switch (colIndex) {
//       case 1: // player name
//         valA = (a.player_name || "Guest").toLowerCase();
//         valB = (b.player_name || "Guest").toLowerCase();
//         break;
//       case 2: // date
//         valA = new Date(a.created_at);
//         valB = new Date(b.created_at);
//         break;
//       case 3: // score
//         valA = a.score || 0;
//         valB = b.score || 0;
//         break;
//       default:
//         valA = a.id || 0;
//         valB = b.id || 0;
//     }
//     if (valA < valB) return asc ? -1 : 1;
//     if (valA > valB) return asc ? 1 : -1;
//     return 0;
//   });

//   updateSortIndicators(colIndex, asc);
//   displayTable(currentData);
// }

// // 🔰 Sort arrow update
// function updateSortIndicators(colIndex, asc) {
//   const headers = document.querySelectorAll("#leaderboardTable thead th");
//   headers.forEach((th, i) => {
//     th.textContent = th.dataset.title;
//     if (i === colIndex) {
//       th.textContent += asc ? " 🔼" : " 🔽";
//     }
//   });
// }

// // 🔍 Search filter
// const searchInput = document.getElementById("searchInput");
// if (searchInput) {
//   searchInput.addEventListener("input", e => {
//     const q = e.target.value.toLowerCase();
//     const filtered = currentData.filter(row =>
//       (row.player_name || "Guest").toLowerCase().includes(q)
//     );
//     displayTable(filtered);
//   });
// }

// // 🧩 Header click binding (for modules)
// document.addEventListener("DOMContentLoaded", () => {
//   const headers = document.querySelectorAll("#leaderboardTable thead th");
//   headers.forEach((th, i) => {
//     th.dataset.title = th.textContent; // store original
//     th.style.cursor = "pointer";
//     th.addEventListener("click", () => sortTable(i));
//   });
// });

// const searchInput = document.getElementById("searchInput");
// if (searchInput) {
//   searchInput.addEventListener("input", e => {
//     const q = e.target.value.toLowerCase();
//     const filtered = currentData.filter(row =>
//       (row.player_name || "Guest").toLowerCase().includes(q)
//     );
//     displayTable(filtered);
//   });
// }

export async function saveScore(game_id, score) {
  // saves via Edge Function endpoint (recommended) OR direct insert via supabase
  // Here we'll use Edge Function if exists, else fallback to direct insert.
  const player_name = localStorage.getItem('player_name') || 'Guest';
  const email = localStorage.getItem('email') || '';

  // If you have an Edge Function URL, prefer it (replace below)
  const EDGE_FUNCTION_URL = ""; // e.g. "https://<ref>.supabase.co/functions/v1/submit-score"
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

// export function sortTable(column) {
//   // allowed columns: 'score', 'player_name', 'created_at'
//   if (currentSort.column === column) currentSort.asc = !currentSort.asc;
//   else { currentSort.column = column; currentSort.asc = true; }
//   _renderTable();
// }

// // ---------- internal helpers ----------
// function _renderTable() {
//   const tbody = document.getElementById('leaderboardTableBody');
//   if (!tbody) return;

//   let list = allScores.slice(); // clone

//   // apply search
//   if (searchQuery) {
//     list = list.filter(r => (r.player_name || '').toLowerCase().includes(searchQuery));
//   }

//   // sort
//   list.sort((a, b) => {
//     const col = currentSort.column;
//     let av = a[col], bv = b[col];

//     // normalize for undefined
//     if (av === undefined) av = ''; if (bv === undefined) bv = '';

//     // if date column
//     if (col === 'created_at') {
//       av = new Date(av).getTime();
//       bv = new Date(bv).getTime();
//     }

//     if (typeof av === 'string') av = av.toLowerCase();
//     if (typeof bv === 'string') bv = bv.toLowerCase();

//     if (av < bv) return currentSort.asc ? -1 : 1;
//     if (av > bv) return currentSort.asc ? 1 : -1;
//     return 0;
//   });

//   if (list.length === 0) {
//     tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">No results</td></tr>`;
//     return;
//   }

//   tbody.innerHTML = list.slice(0, 100).map((r, i) => `
//     <tr>
//       <td>${i + 1}</td>
//       <td>${escapeHtml(r.player_name || 'Guest')}</td>
//       <td>${r.score}</td>
//       <td>${new Date(r.created_at).toLocaleString()}</td>
//     </tr>
//   `).join('');
// }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]));
}




