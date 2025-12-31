import { textToSpeechEng } from './speak.js';

const TABLE_NAME = "scores";

let lccurrentData = [];
let lccurrentSortColumn = null;
let lccurrentSortOrder = 'asc';
let lcleaderboardData = [];
let lcfilteredData = [];
let lccurrentPage = 1;
let lcitemsPerPage = 10;
// let lcsNo = 1;

const modal = document.getElementById('lcLeaderboardModal');
const openBtn = document.getElementById('toggle-lc-leaderboard');
const closeBtn = document.getElementById('lcCloseBtn');

modal.style.display = 'none';
// openBtn.onclick = () => modal.style.display = 'flex';
closeBtn.onclick = () => modal.style.display = 'none';

openBtn.addEventListener ( "click", () => {
    modal.style.display = 'flex';
    lcrenderLeaderboard();

})

export function toggleLeaderboard() {
  if (document.getElementById("leaderboardPopup").style.display === 'block') {
    // document.getElementById("toggle-leaderboard").textContent = "Global Leaderboard";
    document.getElementById("leaderboardPopup").style.display = 'none';
    return;
  }
  // document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
  document.getElementById("leaderboardPopup").style.display = 'block';
    lcrenderLeaderboard();
}

document.getElementById("lcsearchInput").addEventListener("input", lchandleSearch);
document.getElementById("lctopSelect").addEventListener("change", lchandleTopSelect);
document.getElementById("lcprevPage").addEventListener("click", lcprevPage);
document.getElementById("lcnextPage").addEventListener("click", lcnextPage);

document.querySelectorAll("#lcleaderboardTable thead th").forEach(th => {
  th.addEventListener("click", () => handleSort(th.dataset.column));
});

function lchandleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  lcfilteredData = lcleaderboardData.filter(row =>
    row.player_name?.toLowerCase().includes(searchTerm)
  );
  lccurrentPage = 1;
  lcrenderTable();
}

function lchandleTopSelect(e) {
  lcitemsPerPage = parseInt(e.target.value);
  lccurrentPage = 1;
  lcrenderTable();
}

function lcprevPage() {
  if (lccurrentPage > 1) {
    lccurrentPage--;
    lcrenderTable();
  }
}

function lcnextPage() {
  const totalPages = Math.ceil(lcfilteredData.length / lcitemsPerPage);
  if (lccurrentPage < totalPages) {
    lccurrentPage++;
    lcrenderTable();
  }
}

lcgameFilter.addEventListener("change", async (event) => {
  const q = event.target.value.toLowerCase();
  if (q == "all") {
    lcfilteredData = lcleaderboardData;

  } else {
    lcfilteredData = lcleaderboardData.filter(row =>
      (row.game_id).toLowerCase().includes(q)
    );
  }

  lccurrentPage = 1;
  lcrenderTable();
});

export async function lcrenderLeaderboard() {
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');

    if (!Array.isArray(data)) {
      document.getElementById("lc-table-body").innerHTML = "⚠️ Unexpected response";
      return;
    }

    if (data.length === 0) {
      document.getElementById("lc-table-body").innerHTML = "No scores yet.";
      return;
    }


        // leaderboardData = data;
    lcleaderboardData = data.map((item, index) => ({
      serialNo: index + 1, 
      ...item
    }));
    lcfilteredData = [...lcleaderboardData];
    lccurrentPage = 1;
    lcrenderTable();


    // lcleaderboardData = data;
    // lcfilteredData = [...data];
    // lccurrentPage = 1;
    // lcrenderTable();
}

// export async function lcrenderLeaderboard() {
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
//       document.getElementById("gb-table-body").textContent = "Global Leaderboard fetch error: " + res.status + errText;
//       return;
//     }

//     const data = await res.json();

//     if (!Array.isArray(data)) {
//       document.getElementById("gb-table-body").textContent = "⚠️ Unexpected response";
//       return;
//     }

//     if (data.length === 0) {
//       document.getElementById("gb-table-body").textContent = "No scores yet.";
//       return;
//     }

//     // leaderboardData = data;
//     lcleaderboardData = data.map((item, index) => ({
//       serialNo: index + 1, 
//       ...item
//     }));
//     lcfilteredData = [...lcleaderboardData];
//     lccurrentPage = 1;
//     lcrenderTable();

//   } catch (err) {
//     document.getElementById("gb-table-body").textContent = "❌ Error loading global leaderboard: " + err;
//   }
// }

function lcrenderTable() {
  const tbody = document.getElementById("lc-table-body");
  const start = (lccurrentPage - 1) * lcitemsPerPage;
  const end = start + lcitemsPerPage;
  const currentItems = lcfilteredData.slice(start, end);

//   if (!tbody) return;

  tbody.innerHTML = "";
  if (currentItems.length === 0) {
    tbody.innerHTML = `<tr><td class="lc-td" colspan="6">No records found.</td></tr>`;
    document.getElementById("lcpageInfo").textContent = "";
    return;
  }

  tbody.innerHTML = currentItems
    .map(
      row => `
      <tr>
        <td class="lc-td">${row.serialNo}</td>
        <td class="lc-td">${row.game_id}</td>
        <td class="lc-td">${row.player_name}</td>
        <td class="lc-td">${!row.player_opponent ? "-" : row.player_opponent}</td>
        <td class="lc-td">${!row.size ? "-" : row.size}</td>
        <td class="lc-td">${!row.difficulty ? "-" : row.difficulty}</td>
        <td class="lc-td">${!row.score ? 0 : row.score}</td>
        <td class="lc-td">${Math.floor(row.elapsed / 3600)}:${Math.floor((row.elapsed % 3600) / 60)}:${row.elapsed % 60}</td>
        <td class="lc-td">${new Date(row.created_at).toLocaleString()}</td>
        <td class="lc-td">${!row.moves ? "-" : row.moves}</td>
        <td class="lc-td">${!row.email ? "-" : row.email}</td>
        <td class="lc-td">${!row.filed1 ? "-" : row.filed1}</td>
        <td class="lc-td">${!row.filed2 ? "-" : row.filed2}</td>
        <td class="lc-td">${!row.filed3 ? "-" : row.filed3}</td>
        <td class="lc-td">${!row.filed4 ? "-" : row.filed4}</td>
      </tr>
    `
    )
    .join("");

  const totalPages = Math.ceil(lcfilteredData.length / lcitemsPerPage);
  document.getElementById("lcpageInfo").textContent = `Page ${lccurrentPage} of ${totalPages}`;
}

export function lcsortTable(colIndex, order) {
  if (!lcfilteredData || lcfilteredData.length === 0) return;
  lccurrentSortColumn = colIndex;
  lccurrentSortOrder = order;

  lcfilteredData.sort((a, b) => {
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
        valA = (a.size || "Nil").toLowerCase();
        valB = (b.size || "Nil").toLowerCase();
        break;
      case 4:
        valA = (a.difficulty || "Nil").toLowerCase();
        valB = (b.difficulty || "Nil").toLowerCase();
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
        valA = (a.email || "Nil").toLowerCase();
        valB = (b.email || "Nil").toLowerCase();
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
        valA = (a.filed3 || "Nil").toLowerCase();
        valB = (b.filed3 || "Nil").toLowerCase();
        break;
      case 13:
        valA = (a.field4 || "Nil").toLowerCase();
        valB = (b.filed4 || "Nil").toLowerCase();
        break;
      default:
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  lcupdateIndicators(colIndex, order);
  lcrenderTable();
}

function lcupdateIndicators(activeCol, order) {
//   const headers = document.querySelectorAll("#lcleaderboardTable .lc-thead th");
  const headers = document.querySelectorAll(".sortable");
  headers.forEach((th, i) => {
    const arrows = th.querySelectorAll(".arrow");
    arrows.forEach(arrow => {
      arrow.style.opacity = "1";
    });

    // if (i === activeCol + 1) {
    if (i === activeCol) {
      const arrow = th.querySelector(`.arrow.${order}`);
      if (arrow) arrow.style.opacity = "0.3";
    }
  });
}

const lcsearchInput = document.getElementById("lcsearchInput");
if (lcsearchInput) {
  lcsearchInput.addEventListener("input", e => {
    const q = e.target.value.toLowerCase();
    const lcfiltered = lccurrentData.filter(row =>
      (row.player_name || "Guest").toLowerCase().includes(q)
    );
    lcrenderTable(lcfiltered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const headers = document.querySelectorAll(".sortable");
  headers.forEach((th, i) => {
    const up = th.querySelector(".arrow.asc");
    const down = th.querySelector(".arrow.desc");
    up.addEventListener("click", e => { e.stopPropagation(); lcsortTable(i, 'asc'); });
    down.addEventListener("click", e => { e.stopPropagation(); lcsortTable(i, 'desc'); });
  });
});

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
//     document.getElementById("gb-table-body").textContent = "Score save error in global leaderboard" + err;
//     throw err;
//   }
// }

// lcrenderLeaderboard();


export function lcsaveToLeaderboard(player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at) {
    const entry = { player_name, player_opponent, email, size, difficulty, game_id, score, elapsed, moves, filed1, filed2, filed3, filed4, created_at };
    const boardData = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    boardData.push(entry);
    localStorage.setItem("leaderboard", JSON.stringify(boardData));
  }