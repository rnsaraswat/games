// these line are added in index.html file
//<button class="buttonleadderboard" id="toggle-leaderboard">View Leaderboard</button>

//<!-- Leaderboard Popup -->
//<div id="leaderboardPopup">
//    <h3>🏆Leaderboard</h3>
//    <button class="buttonleadderboard" id="hide-leaderboard">Hide Leaderboard</button>
//    <button class="buttonleadderboard" id="clear-leaderboard">Clear Leaderboard</button>
//    <ul id="leaderboardList"></ul>
//</div>



// these lines are added in style.css
// or save in file leaderboard.css add link <link rel="stylesheet" href="leaderboard.css"> in index.html header teg
/* Leaderboard/Rules Popup */
// #leaderboardPopup {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     padding: 2vw;
//     border-radius: 1vw;
//     display: none;
//     z-index: 10;
//     width: 80%;
//     height: 60%;
//     overflow-y: auto;
//     text-align: center;
//     border: 0.2vw solid var(--cell-border);
//     background: var(--bg);
//     color: var(--fg);
// }

// h3 {
//     display: inline;
//     background: var(--bg);
//     color: var(--fg);
// }

// table,
// th,
// td {
//     border: 0.1vw solid var(--cell-border);
//     box-shadow: 0 0.5vw 2.5vw 0 var(--box-shadow);
//     margin: auto;
//     text-align: center;
//     padding: 0.1vw;
//     background: var(--bg);
//     color: var(--fg);
// }


// these line are added in javascript file

// export const leaderboardEl = document.getElementById('leaderboardList');
import { diffSel, state, player1 } from './script.js';
import { hrs, min, sec} from './timer.js';
import { textToSpeechEng } from './speak.js';

//toggle leaderboard Listener
document.getElementById("toggle-leaderboard").addEventListener("click", () => {
    if (document.getElementById("toggle-leaderboard").textContent === "View Leaderboard") {
        document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
        textToSpeechEng('Open Leaderboard');
        toggleLeaderboard();
    } else {
        document.getElementById("toggle-leaderboard").textContent = "View Leaderboard"
        textToSpeechEng('Close Leaderboard');
        document.getElementById("leaderboardPopup").style.display = "none";
    }
});

//save save score to leaderboard
export function saveToLeaderboard() {
    const size = `${state.N}(${state.blockRows}x${state.blockCols})`;
    const level = diffSel.value;
    const elapsed = `${hrs}:${min}:${sec}`
    const dateTime = new Date().toLocaleString();
    const entry = { player1, level, size, elapsed, dateTime };

    const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    leaderboard.push(entry);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

// toggle leaderboard
export function toggleLeaderboard() {
    let list = document.getElementById("leaderboardList");
    if (document.getElementById("toggle-leaderboard").style.display === 'block') {
        document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
        list.style.display = 'none';
        return;
    }
    const data = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    document.getElementById("toggle-leaderboard").textContent = "Hide Leaderboard";
    if (data.length === 0) {
        list.innerHTML = `<p>No entries yet.</p>`;
    } else {
        list.innerHTML = `<table><thead><tr><th>Winner</th><th>Level</th><th>Size</th><th>Elapsed Time</th><th>date time</th></tr></thead><tbody>${data.map(entry => `<tr><td>${entry.player1}</td><td>${entry.level}</td><td>${entry.size}</td><td>${entry.elapsed}</td><td>${entry.dateTime}</td></tr>`).join('')}</tbody></table>`;
    }
    document.getElementById("leaderboardPopup").style.display = "block";
}

//hide leaderbaord
document.getElementById("hide-leaderboard").addEventListener("click", () => {
    textToSpeechEng('Close Leaderboard');
    document.getElementById("leaderboardPopup").style.display = "none";
    document.getElementById("toggle-leaderboard").textContent = "View Leaderboard";
})

//clear leaderbaord
document.getElementById("clear-leaderboard").addEventListener("click", () => {
    if (confirm("Do you realy Want to Remove Leaderboard data?")) {
        localStorage.removeItem('leaderboard');
        alert("Leaderboard Data is Cleared");
        textToSpeechEng('Leaderboard data cleared');
    }
})