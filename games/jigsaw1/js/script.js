import { shareScore } from './share.js';
import { saveScore } from '../../../leaderboard/gbleaderboard.js';
import { lcrenderLeaderboard, lcsaveToLeaderboard } from '../../../leaderboard/lcleaderboard.js';
import { playSound } from './sound.js';
// to add firebase leaderboard
import { db } from "../../../leaderboard/firebase-config.js";
import { addDoc, collection, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export let winnerName = localStorage.getItem('player_name') || getUserName();
export let gameName = 'jigsaw';
let game = "Jigsaw";
let game_id = "jigsaw";
let opponent, difficulty, elapsed, moves, level, date;
export let score;
let size = '3x4';
let h = 0;
let m = 0;
let s = 0;
let text = "Shape Square";
let playMode = "pvc";


document.addEventListener("DOMContentLoaded", function () {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    const canvas = document.getElementById("puzzleBoard");
    const ctx = canvas.getContext("2d");

    const gallery = document.getElementById("gallery");
    const difficultySel = document.getElementById("difficulty");
    const rotationSel = document.getElementById("rotation");
    const snapSel = document.getElementById("snapMode");
    const hintSel = document.getElementById("hint");

    const startBtn = document.getElementById("startBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    // const resetBtn = document.getElementById("resetBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resumeBtn = document.getElementById("resumeBtn");

    const loadURLBtn = document.getElementById("loadURLBtn");
    const imgURL = document.getElementById("imgURL");
    const localImg = document.getElementById("localImg");
    const loadLocalBtn = document.getElementById("loadLocalBtn");
    const shapeStyle = document.getElementById("shapeStyle") || { value: "square" };

    const pauseOverlay = document.getElementById("pauseOverlay");

    const timerEl = document.getElementById("timer-display");

    const placedEl = document.getElementById("placed");
    const totalEl = document.getElementById("total");

    let img = new Image();

    let rows = 3;
    let cols = 4;

    let pieces = [];

    let boardSize = 0;
    let pieceW = 0;
    let pieceH = 0;

    let selected = null;
    let offsetX = 0;
    let offsetY = 0;

    let hintOpacity = 0;

    let startTime = 0;
    let timerInterval = null;
    let paused = false;

    let placedCount = 0;

    let timeSec = 0;
    let difficulty = "easy";

    /* =========================
       TIMER
    ========================= */
    function startTimer() {
        clearInterval(timerInterval);
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (paused) return;
        timeSec = Math.floor((Date.now() - startTime) / 1000);

        h = String(Math.floor(timeSec / 3600)).padStart(2, "0");
        m = String(Math.floor(timeSec % 3600 / 60)).padStart(2, "0");
        s = String(timeSec % 60).padStart(2, "0");

        timerEl.textContent = `${h}:${m}:${s}`;
    }

    /* =========================
       IMAGE LOAD
    ========================= */
    gallery.querySelectorAll("img").forEach(i => {
        i.addEventListener("click", () => {
            loadImage(i.src);
        });
    });

    function loadImage(src) {
        img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            setupPuzzle();
        };
        img.src = src;
    }

    /* =========================
       DIFFICULTY
    ========================= */
    function readDifficulty() {
        let d = difficultySel.value.split("x");
        rows = parseInt(d[0]);
        cols = parseInt(d[1]);
    }

    /* =========================
       BOARD RESIZE
    ========================= */
    function resizeBoard() {

        let container = document.getElementById("board");

        if (!container) {
            console.error("boardContainer not found");
            return;
        }

        let w = container.clientWidth;
        let h = container.clientHeight;

        boardSize = Math.min(w, h);

        canvas.style.width = boardSize + "px";
        canvas.style.height = boardSize + "px";

        let dpr = window.devicePixelRatio || 1;

        canvas.width = boardSize * dpr;
        canvas.height = boardSize * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        pieceW = boardSize / cols;
        pieceH = boardSize / rows;

        draw();

    }

    window.addEventListener("resize", resizeBoard);

    /* =========================
       PIECE OBJECT
    ========================= */
    function createPieces() {

        pieces = [];

        placedCount = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                let p = {

                    row: r,
                    col: c,

                    x: Math.random() * boardSize,
                    y: Math.random() * boardSize,

                    correctX: c * pieceW,
                    correctY: r * pieceH,

                    rotation: 0,

                    placed: false

                };

                pieces.push(p);

            }
        }

        totalEl.textContent = pieces.length;
        placedEl.textContent = placedCount;
    }
    /* =========================
       DRAW
    ========================= */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        /* hint image */
        if (hintOpacity > 0) {
            ctx.globalAlpha = hintOpacity;
            ctx.drawImage(img, 0, 0, boardSize, boardSize);
            ctx.globalAlpha = 1;
        }

        /* pieces */
        pieces.forEach(p => {
            ctx.save();
            ctx.translate(p.x + pieceW / 2, p.y + pieceH / 2);
            ctx.rotate(p.rotation * Math.PI / 180);

            ctx.drawImage(
                img,
                p.col * (img.width / cols),
                p.row * (img.height / rows),
                img.width / cols,
                img.height / rows,
                -pieceW / 2,
                -pieceH / 2,
                pieceW,
                pieceH
            );

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.strokeRect(-pieceW / 2, -pieceH / 2, pieceW, pieceH);

            ctx.restore();
        });

    }

    /* =========================
       DRAG
    ========================= */
    canvas.addEventListener("pointerdown", e => {

        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);

        let rect = canvas.getBoundingClientRect();

        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        for (let i = pieces.length - 1; i >= 0; i--) {

            let p = pieces[i];

            if (
                mx > p.x &&
                mx < p.x + pieceW &&
                my > p.y &&
                my < p.y + pieceH &&
                !p.placed
            ) {

                selected = p;

                offsetX = mx - p.x;
                offsetY = my - p.y;

                pieces.splice(i, 1);
                pieces.push(p);

                break;
            }
        }
    });

    // canvas.addEventListener("pointermove", e => {

    //     if (!selected) return;

    //     let rect = canvas.getBoundingClientRect();

    //     let mx = e.clientX - rect.left;
    //     let my = e.clientY - rect.top;

    //     selected.x = mx - offsetX;
    //     selected.y = my - offsetY;

    //     draw();

    // });

    canvas.addEventListener("pointerup", () => {
        if (!selected) return;
        snapPiece(selected);
        selected = null;
    });

    canvas.addEventListener("pointerup", releasePiece);
    canvas.addEventListener("pointercancel", releasePiece);
    canvas.addEventListener("pointerleave", releasePiece);

    function releasePiece() {
        if (!selected) return;
        snapPiece(selected);
        selected = null;
        // canvas.releasePointerCapture?.(0);
    }

    /* =========================
       SNAP
    ========================= */
    function snapPiece(p) {
        let dx = p.x - p.correctX;
        let dy = p.y - p.correctY;

        let dist = Math.hypot(dx, dy);

        // let mode = snapSel.value;
        let mode = snapSel ? snapSel.value : "smart";

        let threshold = pieceW * 0.3;

        if (mode === "off") {
            draw();
            return;
        }

        if (mode === "grid") {
            threshold = 5;
        }

        if (dist < threshold) {
            p.x = p.correctX;
            p.y = p.correctY;

            p.placed = true;

            placedCount++;
            placedEl.textContent = placedCount;
            playSound('click');

            checkWin();
        }
        draw();
    }

    /* =========================
       WIN
    ========================= */
    function checkWin() {
        if (placedCount === pieces.length) {
            clearInterval(timerInterval);
            launchConfetti();
            playSound('win');
            updateleaderboard();
            window.saveScore();
            setTimeout(() => {
                shareScore(gameName, score);
            }, 3000);
        }
    }

    startBtn.onclick = () => {
        readDifficulty();
        setupPuzzle();
    };

    shuffleBtn.onclick = () => {
        if (pieces.length === 0) return;
        // no piece placed
        if (placedCount === 0) {
            shuffleAllPieces();
            return;
        }
        // some piece placed
        shuffleUnplaced();
    };

    function shuffleAllPieces() {
        pieces.forEach(p => {
            p.x = Math.random() * (boardSize - pieceW);
            p.y = Math.random() * (boardSize - pieceH);
            p.placed = false;
        });

        placedCount = 0;
        if (placedEl) placedEl.textContent = placedCount;
        draw();
    }

    function shuffleUnplaced() {
        pieces.forEach(p => {
            if (!p.placed) {
                p.x = Math.random() * (boardSize - pieceW);
                p.y = Math.random() * (boardSize - pieceH);
            }
        });
        draw();
    }

    pauseBtn.onclick = () => {
        paused = true;
        pauseOverlay.style.display = "flex";
    };

    if (resumeBtn && pauseOverlay) {
        resumeBtn.onclick = () => {
            paused = false;
            pauseOverlay.style.display = "none";
        };
    }
    /* =========================
       HINT
    ========================= */
    hintSel.onchange = () => {
        hintOpacity = parseFloat(hintSel.value);
        draw();
    };

    /* =========================
       ROTATION
    ========================= */
    canvas.addEventListener("dblclick", e => {
        if (rotationSel.value === "off") return;

        let rect = canvas.getBoundingClientRect();
        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        for (let p of pieces) {
            if (
                mx > p.x &&
                mx < p.x + pieceW &&
                my > p.y &&
                my < p.y + pieceH &&
                !p.placed
            ) {
                if (rotationSel && rotationSel.value === "on") {
                    p.rotation = (p.rotation + 90) % 360;
                }
                draw();
                break;
            }
        }
    });

    /* =========================
       SETUP
    ========================= */
    function setupPuzzle() {
        readDifficulty();
        resizeBoard();
        createPieces();
        hintOpacity = parseFloat(hintSel.value);
        startTimer();
        draw();
    }

    /* =========================
   INERTIA DRAGGING
========================= */
    let vx = 0;
    let vy = 0;
    let lastMoveTime = 0;

    canvas.addEventListener("pointermove", e => {
        if (!selected) return;

        e.preventDefault();
        let rect = canvas.getBoundingClientRect();

        let mx = e.clientX - rect.left;
        let my = e.clientY - rect.top;

        let now = performance.now();
        let dt = now - lastMoveTime;

        vx = (mx - offsetX - selected.x) / dt;
        vy = (my - offsetY - selected.y) / dt;

        selected.x = mx - offsetX;
        selected.y = my - offsetY;

        lastMoveTime = now;

        draw();
    });

    canvas.addEventListener("pointerup", () => {
        if (!selected) return;

        let p = selected;
        selected = null;
        let inertia = setInterval(() => {

            p.x += vx * 20;
            p.y += vy * 20;

            vx *= 0.95;
            vy *= 0.95;

            draw();
            if (Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01) {
                clearInterval(inertia);
                snapPiece(p);
            }
        }, 16);
    });


    /* =========================
       SHADOW + HIGHLIGHT
    ========================= */

    // function draw() {

    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     /* hint */

    //     if (hintOpacity > 0) {

    //         ctx.globalAlpha = hintOpacity;
    //         ctx.drawImage(img, 0, 0, boardSize, boardSize);
    //         ctx.globalAlpha = 1;

    //     }

    //     pieces.forEach(p => {

    //         ctx.save();

    //         ctx.translate(p.x + pieceW / 2, p.y + pieceH / 2);

    //         ctx.rotate(p.rotation * Math.PI / 180);

    //         /* shadow */

    //         if (p === selected) {

    //             ctx.shadowColor = "rgba(0,0,0,0.6)";
    //             ctx.shadowBlur = 20;

    //         }

    //         /* image */

    //         ctx.drawImage(
    //             img,
    //             p.col * (img.width / cols),
    //             p.row * (img.height / rows),
    //             img.width / cols,
    //             img.height / rows,
    //             -pieceW / 2,
    //             -pieceH / 2,
    //             pieceW,
    //             pieceH
    //         );



    //     });

    // }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* hint */
        if (hintOpacity > 0) {
            ctx.globalAlpha = hintOpacity;
            ctx.drawImage(img, 0, 0, boardSize, boardSize);
            ctx.globalAlpha = 1;
        }

        pieces.forEach(p => {
            // let shape = shapeStyle.value;
            // if (shape === "square") {
            drawSquarePiece(p);
            // }
            // else if (shape === "classic") {
            //     drawClassicPiece(p);
            // }
            // else if (shape === "random") {
            //     drawRandomPiece(p);
            // }
            // else if (shape === "bezier") {
            //     drawBezierPiece(p);
            // }
        });
    }

    /* =========================
       SHADOW + HIGHLIGHT
    ========================= */
    function drawSquarePiece(p) {
        ctx.save();

        ctx.translate(p.x + pieceW / 2, p.y + pieceH / 2);

        ctx.rotate(p.rotation * Math.PI / 180);

        /* shadow */
        if (p === selected) {
            ctx.shadowColor = "rgba(0,0,0,0.6)";
            ctx.shadowBlur = 20;
        }

        /* image */
        ctx.drawImage(
            img,
            p.col * (img.width / cols),
            p.row * (img.height / rows),
            img.width / cols,
            img.height / rows,
            -pieceW / 2,
            -pieceH / 2,
            pieceW,
            pieceH
        );

        /* border */
        ctx.lineWidth = 1;
        ctx.strokeStyle = p === selected ? "#00ffff" : "#000";
        ctx.strokeRect(-pieceW / 2, -pieceH / 2, pieceW, pieceH);

        ctx.restore();

    }

    // function drawClassicPiece(p) {

    //     ctx.save();

    //     ctx.translate(p.x, p.y);

    //     let sx = p.col * (img.width / cols);
    //     let sy = p.row * (img.height / rows);

    //     ctx.beginPath();

    //     drawClassicPath(p);

    //     ctx.clip();

    //     ctx.drawImage(
    //         img,
    //         sx,
    //         sy,
    //         img.width / cols,
    //         img.height / rows,
    //         0,
    //         0,
    //         pieceW,
    //         pieceH
    //     );

    //     ctx.stroke();

    //     ctx.restore();


    // }

    // function drawRandomPiece(p) {

    //     ctx.save();

    //     ctx.translate(p.x, p.y);

    //     let sx = p.col * (img.width / cols);
    //     let sy = p.row * (img.height / rows);

    //     ctx.beginPath();

    //     drawRandomPath(p);

    //     ctx.clip();

    //     ctx.drawImage(
    //         img,
    //         sx,
    //         sy,
    //         img.width / cols,
    //         img.height / rows,
    //         0,
    //         0,
    //         pieceW,
    //         pieceH
    //     );

    //     ctx.stroke();

    //     ctx.restore();

    // }

    // function drawBezierPiece(p) {

    //     ctx.save();

    //     ctx.translate(p.x, p.y);

    //     let sx = p.col * (img.width / cols);
    //     let sy = p.row * (img.height / rows);

    //     ctx.beginPath();

    //     drawBezierPath(p);

    //     ctx.clip();

    //     ctx.drawImage(
    //         img,
    //         sx,
    //         sy,
    //         img.width / cols,
    //         img.height / rows,
    //         0,
    //         0,
    //         pieceW,
    //         pieceH
    //     );

    //     ctx.lineWidth = 1.2;
    //     ctx.stroke();

    //     ctx.restore();

    // }

    // function drawClassicPath(p) {

    //     let size = pieceW * 0.3;

    //     ctx.moveTo(0, 0);

    //     ctx.lineTo(pieceW * 0.35, 0);

    //     ctx.bezierCurveTo(
    //         pieceW * 0.35, -size,
    //         pieceW * 0.65, -size,
    //         pieceW * 0.65, 0
    //     );

    //     ctx.lineTo(pieceW, 0);
    //     ctx.lineTo(pieceW, pieceH);

    //     ctx.lineTo(0, pieceH);

    //     ctx.closePath();

    // }

    // function drawRandomPath(p) {

    //     let size = pieceW * (0.2 + Math.random() * 0.2);

    //     ctx.moveTo(0, 0);

    //     ctx.lineTo(pieceW * 0.3, 0);

    //     ctx.bezierCurveTo(
    //         pieceW * 0.3, -size,
    //         pieceW * 0.7, size,
    //         pieceW * 0.7, 0
    //     );

    //     ctx.lineTo(pieceW, 0);
    //     ctx.lineTo(pieceW, pieceH);
    //     ctx.lineTo(0, pieceH);

    //     ctx.closePath();

    // }

    // function drawBezierPath(p) {

    //     let size = pieceW * 0.35;

    //     ctx.moveTo(0, 0);

    //     ctx.lineTo(pieceW * 0.4, 0);

    //     ctx.bezierCurveTo(
    //         pieceW * 0.4, -size,
    //         pieceW * 0.6, -size,
    //         pieceW * 0.6, 0
    //     );

    //     ctx.lineTo(pieceW, 0);

    //     ctx.lineTo(pieceW, pieceH * 0.4);

    //     ctx.bezierCurveTo(
    //         pieceW + size,
    //         pieceH * 0.4,
    //         pieceW + size,
    //         pieceH * 0.6,
    //         pieceW,
    //         pieceH * 0.6
    //     );

    //     ctx.lineTo(pieceW, pieceH);

    //     ctx.lineTo(0, pieceH);

    //     ctx.closePath();

    // }

    /* =========================
       CONFETTI CELEBRATION
    ========================= */
    let confetti = [];
    function launchConfetti() {
        for (let i = 0; i < 150; i++) {
            confetti.push({
                x: Math.random() * boardSize,
                y: Math.random() * -boardSize,
                vx: (Math.random() - 0.5) * 5,
                vy: Math.random() * 5 + 2,
                size: Math.random() * 6 + 4,
                color: generateRandomNeonColor()

            });
        }
        animateConfetti();
    }

    function generateRandomNeonColor() {
        const hue = Math.floor(Math.random() * 361); // Random hue (0-360)
        const saturation = 100; // Full saturation (100%)
        const lightness = 50; // Moderate lightness (50%) for full color intensity
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      }

    function animateConfetti() {
        let anim = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            confetti.forEach(c => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.1;
                ctx.save();
                ctx.fillStyle = c.color;
                ctx.shadowColor = c.color; 
                ctx.shadowBlur = 15; 
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.fillRect(c.x, c.y, c.size, c.size);
                ctx.restore();
            });

            if (confetti.length === 0) {
                clearInterval(anim);
            }
        }, 50);
    }

    /* =========================
       SHUFFLE UNPLACED PIECES
    ========================= */
    function shuffleUnplaced() {
        pieces.forEach(p => {
            if (!p.placed) {
                p.x = Math.random() * boardSize;
                p.y = Math.random() * boardSize;
            }
        });
        draw();
    }

    startBtn.onclick = () => {
        shuffleUnplaced();
    };

    /* =========================
       LOAD IMAGE FROM URL
    ========================= */
    loadURLBtn.onclick = () => {
        let url = imgURL.value.trim();
        if (!url) return alert('कृपया image URL डालें');
        //     loadImage(url);
        let renderUrl = loadImage(url);
        renderUrl.onload = e => {
            loadImage(e.target.result);
        };
        // renderUrl.readAsDataURL(url);
    };

    /* =========================
       LOAD IMAGE FROM COMPUTER
    ========================= */
    loadLocalBtn.onclick = () => {
        let file = localImg.files[0];
        if (!file) return alert('कृपया image URL डालें');
        let reader = new FileReader();
        reader.onload = e => {
            loadImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    /* =========================
       FILE INPUT
    ========================= */
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = e => {
        loadLocalImage(e.target.files[0]);
    };

    document.body.appendChild(fileInput);

    /* =========================
       DOUBLE TAP ROTATION (MOBILE)
    ========================= */
    let lastTap = 0;

    canvas.addEventListener("pointerdown", e => {
        let now = Date.now();
        if (now - lastTap < 300) {

            let rect = canvas.getBoundingClientRect();

            let mx = e.clientX - rect.left;
            let my = e.clientY - rect.top;

            for (let p of pieces) {
                if (
                    mx > p.x &&
                    mx < p.x + pieceW &&
                    my > p.y &&
                    my < p.y + pieceH &&
                    !p.placed
                ) {
                    if (rotationSel && rotationSel.value === "on") {
                        p.rotation = (p.rotation + 90) % 360;
                    }
                    draw();
                }
            }
        }
        lastTap = now;
    });
    /* =========================
       Leaderboard update
    ========================= */

    // to add firebase leaderboard (save record)
    window.saveScore = async function () {
        try {
            await addDoc(collection(db, "leaderboard"), {
                game_id: game_id || 'jigsaw',
                game: game || 'Jigsaw',
                name: winnerName || 'Guast',
                opponent: opponent || "-",
                difficulty: difficulty || "-",
                size: `${rows}x${cols}`,
                elapsed: timeSec || 0,
                score: score || 0,
                moves: moves || 0,
                email: email || "-",
                level: "-",
                mode: playMode || 'pvc',
                text: text || "-",
                createdAt: new Date()
            });

            console.log("Score Saved!");

        } catch (error) {
            console.error("Error:", error);
        }

    };

    function updateleaderboard() {
        let opponent = "-";
        let game_id = 'jigsaw';
        let gsize = `${rows}x${cols}`;
        let elapsed = timeSec;
        let gameCount = 0;
        let filed1 = 0;
        let filed2 = 0
        let filed3 = "-";
        let filed4 = "-";
        let email = localStorage.getItem('email') || '-';
        const created_at = new Date();
        if (rows == 3) {
            difficulty = "easy";
            score = (rows * cols * 100 - Number(elapsed)) * 1;
        } else if (rows == 4) {
            difficulty = "medium";
            score = (rows * cols * 100 - Number(elapsed)) * 1.5;
        } else if (rows == 6) {
            difficulty = "hard";
            score = (rows * cols * 100 - Number(elapsed)) * 2;
        } else if (rows == 10) {
            difficulty = "extreme";
            score = (rows * cols * 100 - Number(elapsed)) * 2.5;
        }

        lcsaveToLeaderboard(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at)

        saveScore(winnerName, opponent, email, gsize, difficulty, game_id, score, elapsed, gameCount, filed1, filed2, filed3, filed4, created_at);
    }

    document.querySelectorAll("body > input[type='file']:not(#localImg)")
        .forEach(el => el.remove());

    /* =========================
       INIT
    ========================= */
    loadImage(gallery.querySelector("img").src);
});

function getUserName() {
    const userData = localStorage.getItem("user");
    if (!userData) return `Guest`;

    const user = JSON.parse(userData);
    return user.name || `Guest`;
}