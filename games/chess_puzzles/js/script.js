import { shareScore } from "./share.js";
import { playSound } from "./sound.js";
import {
  lcsaveToLeaderboard,
} from "../../../leaderboard/lcleaderboard.js";
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let gameFullName = "Chess Puzzles";
export let gameName = "chesspuzzles";
export let score = 0;
export let noofFireWorks = 10;
export let player1 = localStorage.getItem("player_name") || getUserName();
export let winnerName = player1;
let text = `Puzzle No.`;
let playMode = "-";
let email = localStorage.getItem("email") || "-";

// define variables also used to add firebase leaderboard
const user = JSON.parse(localStorage.getItem("user"));
email = user ? user.email : "";
let game_id = gameName;
let difficulty;

(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    pieces = {
      wk: "♔",
      wq: "♕",
      wr: "♖",
      wb: "♗",
      wn: "♘",
      wp: "♙",
      bk: "♚",
      bq: "♛",
      br: "♜",
      bb: "♝",
      bn: "♞",
      bp: "♟",
    };
  let puzzles = [],
    chess,
    index = 0,
    maxUnlocked = 1,
    lives = 3,
    seconds = 0,
    startTime = 0,
    timer = null,
    selected = null,
    targets = [],
    fen = "",
    moves = [],
    played = [],
    solved = false,
    over = false;
  function status(t, c = "") {
    $("status").textContent = t;
    $("status").className = c;
  }
  function time(seconds) {
    let h = String(Math.floor(seconds / 3600000)).padStart(2, "0"),
      m = String(Math.floor((seconds % 3600000) / 60000)).padStart(2, "0"),
      s = String(Math.floor((seconds % 60000) / 1000)).padStart(2, "0");
    return `⏱️${h}:${m}:${s}`;
  }
  function stats() {
    $("timer-display").textContent = time(seconds);
    $("lives").textContent = "♥ ".repeat(lives).trim() || "—";
    $("pid").textContent = "Puzzle ID : " + (puzzles[index]?.puzzle_id || "—");
    $("rating").textContent = "Rating : " + (puzzles[index]?.rating ?? "—");
    $("level").textContent = "Puzzle No. : " + (index + 1);
  }
  function applyUci(u) {
    if (!u || u.length < 4) return null;
    let o = { from: u.slice(0, 2), to: u.slice(2, 4) };
    if (u.length > 4) o.promotion = u[4];
    return chess.move(o);
  }
  function draw() {
    if (!chess) return;
    let b = $("board");
    b.innerHTML = "";
    let bd = chess.board(),
      last = played[played.length - 1];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        let sq = "abcdefgh"[c] + (8 - r),
          p = bd[r][c],
          el = document.createElement("button");
        el.className = "sq " + ((r + c) % 2 ? "dark" : "light");
        el.dataset.sq = sq;
        el.setAttribute("aria-label", sq);
        if (selected === sq) el.classList.add("selected");
        if (last && (last.from === sq || last.to === sq))
          el.classList.add("last");
        if (targets.includes(sq)) {
          el.classList.add("legal");
          if (p) el.classList.add("capture");
        }
        if (p) {
          let span = document.createElement("span");
          span.className = p.color === "w" ? "whitepiece" : "blackpiece";
          span.textContent = pieces[p.color + p.type];
          el.appendChild(span);
        }
        if (c === 0 || r === 7) {
          let co = document.createElement("span");
          co.className = "coord";
          co.textContent = r === 7 ? "abcdefgh"[c] : 8 - r;
          el.appendChild(co);
        }
        el.onclick = () => clickSquare(sq);
        b.appendChild(el);
      }
    stats();
  }
  function completed() {
    try {
      return JSON.parse(localStorage.getItem("chess_completed_levels") || "[]");
    } catch {
      return [];
    }
  }

  function drawLevels() {
  const container = document.getElementById("levelsContainer");

  if (!container) {
    console.error('HTML में id="levels" नहीं मिला।');
    return;
  }

  container.innerHTML = "";

  // Check puzzles.json for Puzzles received
  if (!Array.isArray(puzzles) || puzzles.length === 0) {
    container.innerHTML =
      '<p style="grid-column:1/-1;color:#c62828;">' +
      'Puzzles not loafded, check puzzles.json or app.js' +
      '</p>';

    console.error("Puzzle list Empty or No Array", puzzles);
    return;
  }

  const done = completedLevels();

  puzzles.forEach((p, i) => {
    const number = i + 1;
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = number;
    button.className = "level";

    if (done.includes(number)) {
      button.classList.add("done");
    } else if (number <= maxUnlocked) {
      if (number === maxUnlocked) {
        button.classList.add("next-unlocked");
      }
    } else {
      button.classList.add("locked");
      button.disabled = true;
    }

    if (number <= maxUnlocked) {
      button.addEventListener("click", () => {
        load(i);
        hideLevels();
      });
    }

    container.appendChild(button);
  });
}

  function load(i) {
    index = i;
    let p = puzzles[i];
    chess = new Chess(p.fen);
    fen = p.fen;
    moves = Array.isArray(p.moves) ? p.moves.slice() : [];
    played = [];
    selected = null;
    targets = [];
    lives = 3;
    seconds = 0;
    solved = false;
    over = false;
    startTime = Date.now() - timer;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (!solved && !over) {
        // seconds++;
        seconds = Date.now() - startTime;
        $("timer-display").textContent = time(seconds);
      }
    }, 1000);
    if (moves.length >= 2) {
      let m = applyUci(moves[0]);
      if (m) played.push(m);
      else status("The first setup move is not legal from this FEN.", "error");
    }
    draw();
    drawLevels();
    if (moves.length < 2)
      status("This puzzle requires at least 2 moves.", "error");
    else status("Now find the correct move for the puzzle.", "");
  }
  function clickSquare(sq) {
    if (!chess || solved || over) return;
    let p = chess.get(sq);
    if (selected && targets.includes(sq)) {
      playerMove(selected, sq);
      return;
    }
    if (p && p.color === chess.turn()) {
      selected = sq;
      targets = chess.moves({ square: sq, verbose: true }).map((m) => m.to);
      playSound("click");
      status("Click on green dots for valid move.", "");
      draw();
    } else if (p && p.color !== chess.turn()){
      selected = null;
      playSound("error");
      status("Please select white piece.", "error");
      targets = [];
      draw();
    } else {
      selected = null;
      playSound("error");
      status("Empty Cell, Please select piece.", "error");
      targets = [];
      draw();
    }
  }
  function playerMove(from, to) {
    let legal = chess
      .moves({ square: from, verbose: true })
      .find((m) => m.to === to);
    if (!legal) {
      playSound("error");
      status(`Invalid move.`, "error");
      return;
    }
    let move = chess.move({ from, to, promotion: "q" });
    if (!move) return;
    played.push(move);
    selected = null;
    targets = [];
    let expected = String(moves[moves.length - 1] || "")
        .replace(/[+#?!]/g, "")
        .toLowerCase(),
      actual = (move.from + move.to + (move.promotion || "")).toLowerCase();
    if (actual === expected || chess.game_over()) {
      solved = true;
      let d = completed();
      if (!d.includes(index + 1)) d.push(index + 1);
      localStorage.setItem("chess_completed_levels", JSON.stringify(d));
      maxUnlocked = Math.min(puzzles.length, Math.max(maxUnlocked, index + 2));
      localStorage.setItem("chess_max_unlocked_index", maxUnlocked);
      status("Well done! The right move — the puzzle is complete.", "success");
      time();
      playSound("win");
      // launchStarFireworks();
      setTimeout(() => {
        shareScore(gameName, score);
      }, 2500);
      updateleaderboard();
      window.saveScore();

      drawLevels();
      setTimeout(() => {
        showLevels();
      }, 2500);
    } else {
      lives--;
      if (lives <= 0) {
        over = true;
        status("Lives have run out. Press 'Try Again'.", "error");
        playSound("loose");
      } else {
        status(`Wrong move. ${lives} lives remaining.`, "error");
        playSound("error");
        chess = new Chess(fen);
        played = [];
        let setup = moves.length >= 2 ? applyUci(moves[0]) : null;
        if (setup) played.push(setup);
      }
    }
    draw();
  }

  function showHint() {
    if (solved || over) return;

    let m = moves[moves.length - 1];

    if (!m || m.length < 4) {
        return status("Hint is not available.", "error");
    }

    selected = m.slice(0, 2);

    targets = chess.moves({
        square: selected,
        verbose: true
    }).map((x) => x.to);

    status("Hint: Make a move using " + selected.toUpperCase() + ".");
    draw();
}

// Hint for click at empty space
$("hint").onclick = showHint;

// Press H on Keyboard for Hint
document.addEventListener("keydown", (event) => {
    if (
        event.key.toLowerCase() === "h" &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        !event.repeat
    ) {
        const tag = document.activeElement?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            document.activeElement?.isContentEditable
        ) {
            return;
        }

        showHint();
    }
});
  $("restart").onclick = () => load(index);
  async function init() {
    if (typeof Chess === "undefined") {
      status(
        "The chess engine failed to load. Check your internet connection.",
        "error",
      );
      return;
    }
    try {
      let r = await fetch("js/puzzles.json");
      if (!r.ok) throw Error();
      puzzles = await r.json();
      if (!Array.isArray(puzzles) || !puzzles.length) throw Error();
      maxUnlocked = Math.min(
        puzzles.length,
        Math.max(
          1,
          Number(localStorage.getItem("chess_max_unlocked_index") || 1),
        ),
      );
      load(0);
      showLevels();
    } catch (e) {
      status("puzzles.json failed to load.", "error");
    }
  }

  document.getElementById("openLevels").onclick = showLevels;

  document.getElementById("closeLevels").onclick = hideLevels;
  function completedLevels() {
    try {
      return JSON.parse(localStorage.getItem("chess_completed_levels") || "[]");
    } catch (error) {
      return [];
    }
  }

  function showLevels() {
    drawLevels();
    document.getElementById("levelsModal").classList.remove("hidden");
  }

  function hideLevels() {
    document.getElementById("levelsModal").classList.add("hidden");
  }
  /* =========================
    Leaderboard update
    ========================= */
  // to add firebase leaderboard (save record)
  window.saveScore = async function () {
    text = `${index+1}, ${puzzles[index]?.puzzle_id}` || "—";
    score = puzzles[index]?.rating ?? 0;
    score = (score - Math.floor(Number(seconds) / 1000)) * lives
    try {
      await addDoc(collection(db, "leaderboard"), {
        game_id: game_id || "chesspuzzles",
        game: gameFullName || "Chess Puzzles",
        name: player1 || "Guast",
        opponent: "-",
        difficulty: difficulty || "-",
        size: `-`,
        elapsed: Math.floor(Number(seconds) / 1000) || 0,
        score: score || 0,
        moves: 0,
        email: email || "-",
        level: index || "-",
        mode: playMode || "-",
        text: text || "-",
        createdAt: new Date(),
      });

      console.log("Score Saved!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // this function is updated leader board
  function updateleaderboard() {
    let opponent = "-";
    let game_id = gameName;
    let gsize = `-`;
    let elapsed = Math.floor(Number(seconds) / 1000);
    difficulty: difficulty || "-";
    moves = "-";
    let filed1 = `No=${index+1}` || 0;
    let filed2 = 0;
    let filed3 = `ID=${puzzles[index]?.puzzle_id}` || "—";
    let filed4 = `Rating=${puzzles[index]?.rating ?? "—"}`;
    email = localStorage.getItem("email") || "-";
    const created_at = new Date();
    score = puzzles[index]?.rating ?? 0;

    lcsaveToLeaderboard(
      player1,
      opponent,
      email,
      gsize,
      difficulty,
      game_id,
      score,
      elapsed,
      moves,
      filed1,
      filed2,
      filed3,
      filed4,
      created_at,
    );
  }

  init();
})();

//get local user name
function getUserName() {
  const userData = localStorage.getItem("user");
  if (!userData) return `Guest`;

  const user = JSON.parse(userData);
  return user.name || `Guest`;
}
