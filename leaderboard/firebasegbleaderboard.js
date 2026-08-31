import { db } from "./firebase-config.js";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { textToSpeechEng } from './speak.js';

let currentData = [];
let currentSortColumn = 7;
let currentSortOrder = 'desc';
let leaderboardData = [];
let filteredData = [];
// let currentPage = 1;
// let itemsPerPage = 10;
let rank = 1;

const modal = document.getElementById('firebaseLeaderboardModal');
const openBtn = document.getElementById('toggle-firebase-leaderboard');
const closeBtn = document.getElementById('firebaseCloseBtn');

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

let fullData = [];
let currentPage = 1;
let rowsPerPage = 20;
let currentSortField = "createdAt";
let currentSortDirection = "desc";

let leaderboardListener = null;

function loadLeaderboard() {

    if (leaderboardListener) {
        leaderboardListener();
    }

    const q = query(
        collection(db, "leaderboard"),
        orderBy("createdAt", "desc")
    );

    leaderboardListener = onSnapshot(q, (snapshot) => {

        fullData = [];
        rank = 1;

        snapshot.forEach(doc => {

            const data = doc.data();

            let formattedDate = "-";
            if (data.createdAt) {
                formattedDate = formatDateTime(data.createdAt.toDate());
            }

            fullData.push({
                ...data,
                formattedDate,
                formattedElapsed: formatElapsed(data.elapsed)
            });

        });

        renderTable();

        console.log("Leaderboard Updated");
    });
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
                <td>${d.name}</td>
                <td>${d.opponent}</td>
                <td>${d.size}</td>
                <td>${d.difficulty}</td>
                <td>${d.score}</td>
                <td>${d.moves}</td>
                <td>${d.level}</td>
                <td>${d.mode}</td>
                <td>${d.text}</td>
                <td>${d.formattedElapsed}</td>
                <td>${d.formattedDate}</td>
            </tr>
        `;
        rank++;
    });

    updatePaginationInfo(filtered.length);
}

function formatDateTime(date) {

  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();

  let hours = date.getHours();
  let minutes = String(date.getMinutes()).padStart(2, '0');
  let seconds = String(date.getSeconds()).padStart(2, '0');

  let ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
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

  // document.getElementById("pageInfo").innerText =
  //     `Page ${currentPage} of ${totalPages}`;
}


// Pagination buttons initialize
function initPagination() {

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!prevBtn) {
      console.error("❌ prevBtn not found");
      return;
  }

  if (!nextBtn) {
      console.error("❌ nextBtn not found");
      return;
  }

  prevBtn.onclick = () => {

      if (currentPage > 1) {
          currentPage--;
          renderTable();
      }

  };


  nextBtn.onclick = () => {

      const total = filterData().length;
      const totalPages = Math.ceil(total / rowsPerPage);

      if (currentPage < totalPages) {
          currentPage++;
          renderTable();
      }

  };

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

// document.getElementById("pageSize").addEventListener("change", e => {
//   rowsPerPage = parseInt(e.target.value);
//   currentPage = 1;
//   renderTable();
// });

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

function formatElapsed(totalSeconds) {

  totalSeconds = Number(totalSeconds) || 0;

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

loadLeaderboard();
