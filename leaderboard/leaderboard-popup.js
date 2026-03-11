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

const modal = document.getElementById("leaderboardModal");
const filter = document.getElementById("gameFilter");
const list = document.getElementById("leaderboardList");
const title = document.getElementById("leaderboardTitle");

const gameName = document.body.dataset.game;

export function formatTime(totalSeconds) {
    if (!totalSeconds) return "-";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h.toString().padStart(2, '0')}:` +
        `${m.toString().padStart(2, '0')}:` +
        `${s.toString().padStart(2, '0')}`;
}

window.openLeaderboard = async function () {

    modal.style.display = "flex";
    list.innerHTML = "Loading...";
    title.innerText = gameName.toUpperCase() + " Leaderboard";

    // const q = query(
    //     collection(db, "leaderboard"),
    //     where("game", "==", gameName),
    //     orderBy("score", "desc"),
    //     limit(20)
    // );

    let q;

    if (gameName === "all") {
      q = query(
        collection(db, "leaderboard"),
        orderBy("score", "desc"),
        limit(20)
      );
    } else {
    //   q = query(
    //     collection(db, "leaderboard"),
    //     where("game", "==", gameName),
    //     orderBy("score", "desc"),
    //     limit(20)
    //   );
      q = query(
        collection(db, "leaderboard"),
        where("game_id", "==", gameName),
        orderBy("score", "desc"),
        limit(20)
      );
    }

    const snapshot = await getDocs(q);

    list.innerHTML = "";

    // 🏆 Table Start
    let table = `
<table style="width:100%; border-collapse: collapse; font-size:14px;">
  <thead>
    <tr style="background:#222; color:#fff;">
      <th>#</th>
      <th>Game</th>
      <th>Game ID</th>
      <th>Name</th>
      <th>Opponent</th>
      <th>Size</th>
      <th>Score</th>
      <th>Moves</th>
      <th>Level</th>
      <th>Mode</th>
      <th>Elapsed Time</th>
      <th>Date Time</th>
    </tr>
  </thead>
  <tbody>
`;


    let rank = 1;
    snapshot.forEach(doc => {
        const d = doc.data();
        
        table += `
        <tr style="text-align:center; border-bottom:1px solid #444;">
        <td>${rank}</td>
        <td>${d.game}</td>
        <td>${d.game_id}</td>
        <td>${d.name}</td>
        <td>${d.opponent}</td>
        <td>${d.size}</td>
        <td>${d.score}</td>
        <td>${d.moves}</td>
        <td>${d.level}</td>
        <td>${d.mode}</td>
        <td>${d.text}</td>
        <td>${formatTime(d.elapsed)}</td>
        <td>${new Date(d.date).toLocaleString()}</td>
      </tr>
    `;

        rank++;
    });

    table += "</tbody></table>";

    list.innerHTML = table;


    //   snapshot.forEach(doc => {
    //     const data = doc.data();
    //     list.innerHTML += `
    //       <div>
    //         ${rank}. ${data.name} - ${data.score}
    //       </div>
    //     `;
    //     rank++;
    //   });
};



window.closeLeaderboard = function () {
    modal.style.display = "none";
};

filter.addEventListener("change", () => {
    openLeaderboard(filter.value);
  });
  
  openLeaderboard("all");