import { textToSpeechEng } from './speak.js';

let localcurrentData = [];
let currentSortColumn = null;
let currentSortOrder = 'asc';
let localleaderboardData = [];
let localfilteredData = [];
let localcurrentPage = 1;
let localitemsPerPage = 10;
let sNo = 1;

export function saveToLeaderboard(player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at) {
  const entry = { player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at };
  console.log(entry);
  const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  boardData.push(entry);
  localStorage.setItem("leaderboard", JSON.stringify(boardData));
}

document.getElementById("local-hide-leaderboard").addEventListener("click", () => {
  textToSpeechEng('Close Leaderboard');
  document.getElementById("localleaderboardPopup").style.display = "none";
  document.getElementById("local-hide-leaderboard").textContent = "Hide Leaderboard";
  document.getElementById("local-toggle-leaderboard").textContent = "Local Leaderboard";
})

document.getElementById("clear-leaderboard").addEventListener("click", () => {
  if (confirm("Do you realy Want to Remove all games local Leaderboard data?")) {
    localStorage.removeItem('leaderboard');
    alert("All games Local Leaderboard Data is Cleared");
    textToSpeechEng('Local Leaderboard data cleared');
  }
})

document.getElementById("localsearchInput").addEventListener("input", localhandleSearch);
document.getElementById("localtopSelect").addEventListener("change", localhandleTopSelect);
document.getElementById("localprevPage").addEventListener("click", localprevPage);
document.getElementById("localnextPage").addEventListener("click", localnextPage);

document.querySelectorAll("#localleaderboardTable th").forEach(th => {
  th.addEventListener("click", () => handleSort(th.dataset.column));
});

export function localhandleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  localfilteredData = localleaderboardData.filter(row =>
    row.player_name?.toLowerCase().includes(searchTerm)
  );
  currentPage = 1;
  renderTable();
}

function localhandleTopSelect(e) {
  localitemsPerPage = parseInt(e.target.value);
  localcurrentPage = 1;
  localrenderTable();
}

function localprevPage() {
  if (localcurrentPage > 1) {
    localcurrentPage--;
    localrenderTable();
  }
}

function localnextPage() {
  const totalPages = Math.ceil(localfilteredData.length / localitemsPerPage);
  if (localcurrentPage < totalPages) {
    localcurrentPage++;
    localrenderTable();
  }
}

localgameFilter.addEventListener("change", async (event) => {
  const q = event.target.value.toLowerCase();
  if (q == "all") {
    localfilteredData = localleaderboardData;

  } else {
    localfilteredData = localleaderboardData.filter(row =>
      (row.game_id).toLowerCase().includes(q)
    );
  }
  localcurrentPage = 1;
  localrenderTable();
});

export async function localrenderLeaderboard() {
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    if (!Array.isArray(data)) {
      document.getElementById("localleaderboardTableBody").innerHTML = "⚠️ Unexpected response";
      return;
    }

    if (data.length === 0) {
      document.getElementById("localleaderboardTableBody").innerHTML = "No scores yet.";
      return;
    }

    console.log(data);
    localleaderboardData = data;
    localfilteredData = [...data];
    localcurrentPage = 1;
    localrenderTable();
}

function localrenderTable() {
  const tbody = document.getElementById("localleaderboardTableBody");
  const start = (localcurrentPage - 1) * localitemsPerPage;
  const end = start + localitemsPerPage;
  const currentItems = localfilteredData.slice(start, end);
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

  const totalPages = Math.ceil(localfilteredData.length / localitemsPerPage);
  document.getElementById("localpageInfo").textContent = `Page ${localcurrentPage} of ${totalPages}`;
}

export function localsortTable(colIndex, order) {
  if (!localfilteredData || localfilteredData.length === 0) return;
  currentSortColumn = colIndex;
  currentSortOrder = order;

  localfilteredData.sort((a, b) => {
      let valA, valB;
      switch (colIndex) {
        case 0:
          valA = (a.game_id).toLowerCase();
          valB = (b.game_id).toLowerCase();
          break;
        case 1:
          valA = (a.player_name || "Guest").toLowerCase();
          valB = (b.player_name || "Guest").toLowerCase();
          break;
        case 2:
          valA = (a.player_opponent || "Guest").toLowerCase();
          valB = (b.player_opponent || "Guest").toLowerCase();
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
          valA = (a.filed4).toLowerCase();
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

  localupdateIndicators(colIndex, order);
  localrenderTable();
}

function localupdateIndicators(activeCol, order) {
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

const localsearchInput = document.getElementById("localsearchInput");
if (localsearchInput) {
  localsearchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const filtered = localcurrentData.filter(row =>
      (row.player_name || "Guest").toLowerCase().includes(q)
    );
    localrenderTable(filtered);
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
