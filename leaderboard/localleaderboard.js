// export cotoggle-leaderboardnst leaderboardEl = document.getElementById('leaderboard');
// import { sec, min, hrs } from './timer.js';
// import { modeEl, difficultyEl } from './script.js';
import { textToSpeechEng } from './speak.js';

let currentData = [];
let gameId = "tictactoe";
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


//toggle local leaderboard Listener
document.getElementById("local-toggle-leaderboard").addEventListener("click", () => {
  if (document.getElementById("local-toggle-leaderboard").textContent === "Local Leaderboard") {
    document.getElementById("local-toggle-leaderboard").textContent = "Hide Local Leaderboard";
    textToSpeechEng('Open Local Leaderboard');
    toggleLeaderboard();
  } else {
    document.getElementById("local-toggle-leaderboard").textContent = "Local Leaderboard"
    textToSpeechEng('Close Local Leaderboard');
    document.getElementById("localleaderboardPopup").style.display = "none";
  }
});

// //toggle leaderboard Listener
// document.getElementById("global-toggle-leaderboard").addEventListener("click", () => {
//   if (document.getElementById("global-toggle-leaderboard").textContent === "Global Leaderboard") {
//     document.getElementById("global-toggle-leaderboard").textContent = "Hide Global Leaderboard";
//     textToSpeechEng('Open Global Leaderboard');
//     toggleLeaderboard();
//   } else {
//     document.getElementById("global-toggle-leaderboard").textContent = "Hide Global Leaderboard";
//     textToSpeechEng('Close Global Leaderboard');
//     document.getElementById("leaderboardPopup").style.display = "none";
//   }
// });

// save score to leaderboard
export function saveToLeaderboard(game, winner) {
  if (winner === 'draw') return;
  // let name = winner.toUpperCase();
  let elapsed = `${hrs}:${min}:${sec}`;
  const mode = modeEl.value;
  const difficulty = difficultyEl.value;
  const time = new Date().toLocaleString();

  const entry = { winner, game, mode, difficulty, time, elapsed };
  console.log(entry);
  const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  boardData.push(entry);
  localStorage.setItem("leaderboard", JSON.stringify(boardData));
}

// toggle leaderboard
export function toggleLeaderboard() {
  // let list = document.getElementById("localleaderboardPopup");
  if (document.getElementById("localleaderboardPopup").style.display === 'block') {
    document.getElementById("local-toggle-leaderboard").textContent = "Local Leaderboard";
    document.getElementById("localleaderboardPopup").style.display = 'none';
    return;
  }
  // const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');

  // if (!Array.isArray(data)) {
  //   console.log("⚠️ Unexpected response");
  //   return;
  // }

  // if (data.length === 0) {
  //   console.log("No scores yet.");
  //   return;
  // }

  // console.log(data);
  // leaderboardData = data;
  // filteredData = [...data];
  // currentPage = 1;

  document.getElementById("local-toggle-leaderboard").textContent = "Hide Leaderboard";
  // if (data.length === 0) {
  //   list.innerHTML = '<p>No entries yet.</p>';
  // } else {
  //   list.innerHTML = `<table><thead><tr><th>Winner</th><th>Mode</th><th>Difficulty</th><th>Time</th><th>Elapsed</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.winner}</td><td>${entry.mode}</td><td>${entry.difficulty}</td><td>${entry.time}</td><td>${entry.elapsed}</td></tr>`).join('')}</tbody></table>`;
  // }
  document.getElementById("localleaderboardPopup").style.display = 'block';
  // renderTable();
  renderLeaderboard();
}




//hide leaderbaord
document.getElementById("local-hide-leaderboard").addEventListener("click", () => {
  textToSpeechEng('Close Leaderboard');
  document.getElementById("localleaderboardPopup").style.display = "none";
  document.getElementById("local-toggle-leaderboard").textContent = "Local Leaderboard";
})

// clear leaderboard data
// export function clearLeaderboard() {
document.getElementById("clear-leaderboard").addEventListener("click", () => {
  if (confirm("Do you realy Want to Remove all games local Leaderboard data?")) {
    localStorage.removeItem('leaderboard');
    alert("All games Local Leaderboard Data is Cleared");
    textToSpeechEng('Local Leaderboard data cleared');
  }
})




document.getElementById("localsearchInput").addEventListener("input", handleSearch);
document.getElementById("localtopSelect").addEventListener("change", handleTopSelect);
document.getElementById("localprevPage").addEventListener("click", localprevPage);
document.getElementById("localnextPage").addEventListener("click", localnextPage);

document.querySelectorAll("#localleaderboardTable th").forEach(th => {
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

function localprevPage() {
  if (currentPage > 1) {
    currentPage--;
    // sNo = currentPage * itemsPerPage;
    renderTable();
  }
}

function localnextPage() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < totalPages) {
    // sNo = currentPage * itemsPerPage;
    currentPage++;
    renderTable();
  }
}

localgameFilter.addEventListener("change", async (event) => {
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
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    // const data = await res.json();

    if (!Array.isArray(data)) {
      console.log("⚠️ Unexpected response");
      return;
    }

    if (data.length === 0) {
      console.log("No scores yet.");
      return;
    }

    console.log(data);
    leaderboardData = data;
    filteredData = [...data];
    currentPage = 1;
    renderTable();
}

function renderTable() {
  const tbody = document.getElementById("localleaderboardTableBody");
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = filteredData.slice(start, end);
  console.log("currentItems", currentItems);
  console.log("start", start, end);

  if (currentItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    document.getElementById("localpageInfo").textContent = "";
    return;
  }

  // sNo = 1;
  tbody.innerHTML = currentItems
    .map(
      row => `
      <tr>
        <td>${sNo++}</td>
        <td>${row.player_name}</td>
        <td>${row.player_looser}</td>
        <td>${row.game_id}</td>
        <td>${row.size}</td>
        <td>${row.difficulty}</td>
        <td>${row.moves}</td>
        <td>${row.score}</td>
        <td>${row.elapsed}</td>
        <td>${new Date(row.created_at).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  document.getElementById("localpageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
}

// function renderTable() {
//   const tbody = document.getElementById("leaderboardTableBody");
//   const start = (currentPage - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const currentItems = filteredData.slice(start, end);
//   console.log("currentItems", currentItems);
//   console.log("start", start, end);

//   if (currentItems.length === 0) {
//     tbody.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
//     document.getElementById("pageInfo").textContent = "";
//     return;
//   }

//   // sNo = 1;
//   tbody.innerHTML = currentItems
//     .map(
//       row => `
//       <tr>
//         <td>${sNo++}</td>
//         <td>${row.player_name}</td>
//         <td>${row.game_id}</td>
//         <td>${row.score}</td>
//         <td>${new Date(row.created_at).toLocaleString()}</td>
//       </tr>
//     `
//     )
//     .join("");

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
// }

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
        valA = (a.player_looser || "Guest").toLowerCase();
        valB = (b.player_looser || "Guest").toLowerCase();
        break;
      case 2:
        valA = (a.game_id).toLowerCase();
        valB = (b.game_id).toLowerCase();
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
        valA = a.moves || 0;
        valB = b.moves || 0;
        break;
      case 6:
        valA = a.score || 0;
        valB = b.score || 0;
        break;
      case 7:
        valA = a.elapsed || 0;
        valB = b.elapsed || 0;
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
  const headers = document.querySelectorAll("#localleaderboardTable thead th");
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
const localsearchInput = document.getElementById("localsearchInput");
if (localsearchInput) {
  localsearchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = currentData.filter(row =>
      (row.player_name || "Guest").toLowerCase().includes(q)
    );
    renderTable(filtered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll("#localleaderboardTable thead th.sortable");
  headers.forEach((th, i) => {
    const up = th.querySelector(".arrow.asc");
    const down = th.querySelector(".arrow.desc");
    up.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'asc'); });
    down.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'desc'); });
  });
});
