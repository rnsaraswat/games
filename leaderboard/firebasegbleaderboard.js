import { db } from "./firebase-config.js";
// import { formatTime } from "./leaderboard-popup.js";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { textToSpeechEng } from './speak.js';

// // const TABLE_NAME = "scores";

let currentData = [];
let currentSortColumn = 7;
let currentSortOrder = 'desc';
let leaderboardData = [];
let filteredData = [];
// let currentPage = 1;
let itemsPerPage = 10;
let rank = 1;

const modal = document.getElementById('firebaseLeaderboardModal');
const openBtn = document.getElementById('toggle-firebase-leaderboard');
const closeBtn = document.getElementById('firebaseCloseBtn');

// document.getElementById("firebasesearchInput").addEventListener("input", firebasehandleSearch);
// document.getElementById("searchInput").addEventListener("input", () => {
//   currentPage = 1;
//   renderTable();
// });

// document.getElementById("firebasetopSelect").addEventListener("change", firebasehandleTopSelect);
// document.getElementById("firebaseprevPage").addEventListener("click", firebaseprevPage);
// document.getElementById("firebasenextPage").addEventListener("click", firebasebnextPage);

// document.querySelectorAll("#leaderboardTable thead th").forEach(th => {
//   th.addEventListener("click", () => handleSort(th.dataset.column));
// });

// function firebasehandleSearch(e) {
//   const searchTerm = e.target.value.toLowerCase();
//   filteredData = leaderboardData.filter(row =>
//     row.player_name?.toLowerCase().includes(searchTerm)
//   );
//   currentPage = 1;
//   renderTable();
// }

// function firebasehandleTopSelect(e) {
//   itemsPerPage = parseInt(e.target.value);
//   currentPage = 1;
//   renderTable();
// }

// function firebaseprevPage() {
//   if (currentPage > 1) {
//     currentPage--;
//     renderTable();
//   }
// }

// function firebasenextPage() {
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   if (currentPage < totalPages) {
//     currentPage++;
//     renderTable();
//   }
// }

// firebasegameFilter.addEventListener("change", async (event) => {
//   const q = event.target.value.toLowerCase();
//   if (q == "all") {
//     filteredData = leaderboardData;

//   } else {
//     filteredData = leaderboardData.filter(row =>
//       (row.game_id).toLowerCase().includes(q)
//     );
//   }

//   currentPage = 1;
//   renderTable();
// });

// export async function renderLeaderboard() {
//   try {
//     const url = `${SUPABASE_URL}/rest/v1/scores?select=*`;

//     const res = await fetch(url, {
//       headers: {
//         apikey: SUPABASE_ANON_KEY,
//         Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
//       }
//     });

//     if (!res.ok) {
//       let errText;
//       try { errText = await res.json(); } catch (e) { errText = await res.text(); }
//       document.getElementById("firebase-table-body").textContent = "Global Leaderboard fetch error: " + res.status + errText;
//       return;
//     }

//     const data = await res.json();

//     if (!Array.isArray(data)) {
//       document.getElementById("firebase-table-body").textContent = "⚠️ Unexpected response";
//       return;
//     }

//     if (data.length === 0) {
//       document.getElementById("firebase-table-body").textContent = "No global scores yet.";
//       return;
//     }

//     // leaderboardData = data;
//     leaderboardData = data.map((item, index) => ({
//       serialNo: index + 1, 
//       ...item
//     }));
//     filteredData = [...leaderboardData];
//     currentPage = 1;
//     sortTable(currentSortColumn, currentSortOrder)
//     renderTable();

//   } catch (err) {
//     document.getElementById("firebase-table-body").textContent = "❌ Error loading global leaderboard: " + err;
//   }
// }

// function renderTable() {
//   const tbody = document.getElementById("firebase-table-body");
//   const start = (currentPage - 1) * itemsPerPage;
//   const end = start + itemsPerPage;
//   const currentItems = filteredData.slice(start, end);

//   if (!tbody) return;

//   tbody.innerHTML = "";
//   if (currentItems.length === 0) {
//     tbody.innerHTML = `<tr><td class="firebase-td" colspan="6">No records found.</td></tr>`;
//     document.getElementById("firebasepageInfo").textContent = "";
//     return;
//   }

//   tbody.innerHTML = currentItems
//     .map(
//       row => `
//       <tr>
//         <td class="firebase-td">${row.serialNo}</td>
//         <td class="firebase-td">${row.game_id}</td>
//         <td class="firebase-td">${row.player_name}</td>
//         <td class="firebase-td">${!row.player_opponent ? "-" : row.player_opponent}</td>
//         <td class="firebase-td">${!row.size ? "-" : row.size}</td>
//         <td class="firebase-td">${!row.difficulty ? "-" : row.difficulty}</td>
//         <td class="firebase-td">${!row.score ? 0 : row.score}</td>
//         <td class="firebase-td">${Math.floor(row.elapsed / 3600)}:${Math.floor((row.elapsed % 3600) / 60)}:${row.elapsed % 60}</td>
//         <td class="firebase-td">${new Date(row.created_at).toLocaleString()}</td>
//         <td class="firebase-td">${!row.moves ? "-" : row.moves}</td>
//         <td class="firebase-td">${!row.email ? "-" : "--"}</td>
//         <td class="firebase-td">${!row.filed1 ? "-" : row.filed1}</td>
//         <td class="firebase-td">${!row.filed2 ? "-" : row.filed2}</td>
//         <td class="firebase-td">${!row.filed3 ? "-" : row.filed3}</td>
//         <td class="firebase-td">${!row.filed4 ? "-" : row.filed4}</td>
//       </tr>
//     `
//     )
//     .join("");

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   document.getElementById("firebasepageInfo").textContent = `Page ${currentPage} of ${totalPages}`;
// }

// export function sortTable(colIndex, order) {
//   if (!filteredData || filteredData.length === 0) return;
//   currentSortColumn = colIndex;
//   currentSortOrder = order;

//   filteredData.sort((a, b) => {
//     let valA, valB;
//     switch (colIndex) {
//       case 0:
//         valA = (a.game_id).toLowerCase();
//         valB = (b.game_id).toLowerCase();
//         break;
//       case 1:
//         valA = (a.player_name || "Guest").toLowerCase();
//         valB = (b.player_name || "Guest").toLowerCase();
//         break;
//       case 2:
//         valA = (a.player_opponent || "Guest").toLowerCase();
//         valB = (b.player_opponent || "Guest").toLowerCase();
//         break;
//       case 3:
//         valA = (a.size || "Nil").toLowerCase();
//         valB = (b.size || "Nil").toLowerCase();
//         break;
//       case 4:
//         valA = (a.difficulty || "Nil").toLowerCase();
//         valB = (b.difficulty || "Nil").toLowerCase();
//         break;
//       case 5:
//         valA = a.score || 0;
//         valB = b.score || 0;
//         break;
//       case 6:
//         valA = a.elapsed || 0;
//         valB = b.elapsed || 0;
//         break;
//       case 7:
//         valA = new Date(a.created_at);
//         valB = new Date(b.created_at);
//         break;
//       case 8:
//         valA = a.moves || 0;
//         valB = b.moves || 0;
//         break;
//       case 9:
//         valA = (a.email || "Nil").toLowerCase();
//         valB = (b.email || "Nil").toLowerCase();
//         break;
//       case 10:
//         valA = (a.filed1) || 0;
//         valB = (b.filed1) || 0;
//         break;
//       case 11:
//         valA = (a.filed2) || 0;
//         valB = (b.filed2) || 0;
//         break;
//       case 12:
//         valA = (a.filed3 || "Nil").toLowerCase();
//         valB = (b.filed3 || "Nil").toLowerCase();
//         break;
//       case 13:
//         valA = (a.field4 || "Nil").toLowerCase();
//         valB = (b.filed4 || "Nil").toLowerCase();
//         break;
//       default:
//         valA = new Date(a.created_at);
//         valB = new Date(b.created_at);
//     }

//     if (valA < valB) return order === 'asc' ? -1 : 1;
//     if (valA > valB) return order === 'asc' ? 1 : -1;
//     return 0;
//   });

//   updateIndicators(colIndex, order);
//   renderTable();
// }

// function updateIndicators(activeCol, order) {
//   // const headers = document.querySelectorAll("#firebaseleaderboardTable .firebase-thead th");
//   const headers = document.querySelectorAll(".sortable");
//   headers.forEach((th, i) => {
//     const arrows = th.querySelectorAll(".arrow");
//     arrows.forEach(arrow => {
//       arrow.style.opacity = "1";
//     });

//     // if (i === activeCol + 1) {
//     if (i === activeCol) {
//       const arrow = th.querySelector(`.arrow.${order}`);
//       if (arrow) arrow.style.opacity = "0.3";
//     }
//   });
// }

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

// document.addEventListener("DOMContentLoaded", () => {
//   const headers = document.querySelectorAll(".sortable");
//   headers.forEach((th, i) => {
//     const up = th.querySelector(".arrow.asc");
//     const down = th.querySelector(".arrow.desc");
//     up.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'asc'); });
//     down.addEventListener("click", e => { e.stopPropagation(); sortTable(i, 'desc'); });
//   });
// });

// export async function saveScore(player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at) {
//   const EDGE_FUNCTION_URL = ""; 
//   try {
//     if (EDGE_FUNCTION_URL) {
//       const res = await fetch(EDGE_FUNCTION_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at })
//       });
//       const json = await res.json();
//       await renderLeaderboard(game_id);
//       return json;
//     } else {
//       const { data, error } = await supabase.from(TABLE_NAME).insert([{ player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at }]);
//       if (error) throw error;
//       await renderLeaderboard(game_id);
//       return data;
//     }
//   } catch (err) {
//     document.getElementById("firebase-table-body").textContent = "Score save error in global leaderboard" + err;
//     throw err;
//   }
// }


let fullData = [];
let currentPage = 1;
let rowsPerPage = 20;
let currentSortField = "score";
let currentSortDirection = "desc";

async function loadLeaderboard() {

    const q = query(
        collection(db, "leaderboard"),
        orderBy("score", "desc")
    );

    const snapshot = await getDocs(q);

    fullData = [];
    snapshot.forEach(doc => {
        fullData.push(doc.data());
    });
    console.log(fullData);

    renderTable();
}

function renderTable() {

    let filtered = filterData();
    let sorted = sortData(filtered);
    let paginated = paginateData(sorted);

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    paginated.forEach(d => {
        tbody.innerHTML += `
            <tr>
            <td>${rank}</td>
                <td>${d.game}</td>
                <td>${d.game_id}</td>
                <td>${d.level}</td>
                <td>${d.name}</td>
                <td>${d.mode}</td>
                <td>${d.opponent}</td>
                <td>${d.score}</td>
                <td>${d.size}</td>
                <td>${d.moves}</td>
                <td>${d.text}</td>
                <td>${formatTime(d.elapsed)}</td>
                <td>${new Date(d.date).toLocaleString()}</td>
            </tr>
        `;
    });

    updatePaginationInfo(filtered.length);
}

function filterData() {
  const search = document.getElementById("searchInput").value.toLowerCase();

  return fullData.filter(d =>
      d.name.toLowerCase().includes(search)
  );
}

document.querySelectorAll("th").forEach(th => {

  th.addEventListener("click", () => {

      const field = th.dataset.field;

      if (currentSortField === field) {
          currentSortDirection =
              currentSortDirection === "asc" ? "desc" : "asc";
      } else {
          currentSortField = field;
          currentSortDirection = "asc";
      }

      renderTable();
  });
});

function sortData(data) {

  return data.sort((a, b) => {

      let valA = a[currentSortField];
      let valB = b[currentSortField];

      if (typeof valA === "string")
          valA = valA.toLowerCase();

      if (typeof valB === "string")
          valB = valB.toLowerCase();

      if (currentSortDirection === "asc")
          return valA > valB ? 1 : -1;
      else
          return valA < valB ? 1 : -1;
  });
}

function paginateData(data) {

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  return data.slice(start, end);
}

function updatePaginationInfo(total) {

  const totalPages = Math.ceil(total / rowsPerPage);

  document.getElementById("pageInfo").innerText =
      `Page ${currentPage} of ${totalPages}`;
}

document.getElementById("prevBtn").onclick = () => {
  if (currentPage > 1) {
      currentPage--;
      renderTable();
  }
};

document.getElementById("nextBtn").onclick = () => {
  const total = filterData().length;
  const totalPages = Math.ceil(total / rowsPerPage);

  if (currentPage < totalPages) {
      currentPage++;
      renderTable();
  }
};

document.getElementById("pageSize").addEventListener("change", e => {
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
});

document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1;
  renderTable();
});

export function formatTime(totalSeconds) {
  if (!totalSeconds) return "-";

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h.toString().padStart(2, '0')}:` +
      `${m.toString().padStart(2, '0')}:` +
      `${s.toString().padStart(2, '0')}`;
}

loadLeaderboard();
