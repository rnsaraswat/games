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
  function time() {
    let h = String(Math.floor(seconds / 3600)).padStart(2, "0"),
      m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
      s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }
  function stats() {
    $("timer").textContent = time();
    $("lives").textContent = "♥ ".repeat(lives).trim() || "—";
    $("pid").textContent = puzzles[index]?.puzzle_id || "—";
    $("rating").textContent = "Rating " + (puzzles[index]?.rating ?? "—");
    $("level").textContent = "Level " + (index + 1);
    $("undo").disabled = !played.length || solved || over;
    $("next").disabled = index + 1 >= maxUnlocked && !solved;
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
    let wrap = $("levels"),
      done = completed();
    wrap.innerHTML = "";
    puzzles.forEach((p, i) => {
      let n = i + 1,
        btn = document.createElement("button");
      btn.className = "level";
      btn.textContent = n;
      if (done.includes(n)) btn.classList.add("done");
      if (i === index) btn.classList.add("current");
      if (n > maxUnlocked) {
        btn.disabled = true;
        btn.title = "Complete the previous level first.";
      }
      btn.onclick = () => load(i);
      wrap.appendChild(btn);
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
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      if (!solved && !over) {
        seconds++;
        $("timer").textContent = time();
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
    else status("Now find the correct move for the puzzle.");
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
      draw();
    } else {
      selected = null;
      targets = [];
      draw();
    }
  }
  function playerMove(from, to) {
    let legal = chess
      .moves({ square: from, verbose: true })
      .find((m) => m.to === to);
    if (!legal) return;
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
      drawLevels();
    } else {
      lives--;
      if (lives <= 0) {
        over = true;
        status("Lives have run out. Press 'Try Again'.", "error");
      } else {
        status(`Wrong move. ${lives} lives remaining.`, "error");
        chess = new Chess(fen);
        played = [];
        let setup = moves.length >= 2 ? applyUci(moves[0]) : null;
        if (setup) played.push(setup);
      }
    }
    draw();
  }
  function undo() {
    if (!played.length || solved || over) return;
    if (played.length > 1) {
      chess.undo();
      played.pop();
    } else {
      chess = new Chess(fen);
      played = [];
      let m = moves.length >= 2 ? applyUci(moves[0]) : null;
      if (m) played.push(m);
    }
    selected = null;
    targets = [];
    status("The previous move was taken back.");
    draw();
  }
  $("hint").onclick = () => {
    if (solved || over) return;
    let m = moves[moves.length - 1];
    if (!m || m.length < 4) return status("Hint is not available.", "error");
    selected = m.slice(0, 2);
    targets = chess.moves({ square: selected, verbose: true }).map((x) => x.to);
    status("Hint: Make a move using " + selected.toUpperCase() + ".");
    draw();
  };
  $("undo").onclick = undo;
  $("restart").onclick = () => load(index);
  $("next").onclick = () => {
    if (index + 1 < maxUnlocked) load(index + 1);
    else status("Complete the puzzle first to unlock the next level.");
  };
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
    } catch (e) {
      status("puzzles.json failed to load.", "error");
    }
  }
  init();
})();
