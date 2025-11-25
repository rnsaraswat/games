/*
  Magic Jigsaw — Final Single-file
  - Gallery (built-in + upload + URL)
  - Difficulty Preset B (Easy 3x4, Medium 4x6, Hard 6x8, Extreme 10x14)
  - Style1: Classic curvy jigsaw tabs/knobs (Bezier-like)
  - Canvas clipping used to make each piece shape
  - Pointer events + touch support
  - Hindi comments (व्याख्या) inline
*/

/* -------------------------
   Config / Built-in images
   ------------------------- */
const BUILTIN_IMAGES = [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop'
];

/* -------------------------
   DOM refs
   ------------------------- */
const galleryEl = document.getElementById('gallery');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const board = document.getElementById('board');
const hintOverlay = document.getElementById('hintOverlay');
const difficultySelect = document.getElementById('difficulty');
const snapModeSelect = document.getElementById('snapMode');
const rotationModeSelect = document.getElementById('rotationMode');
const statusEl = document.getElementById('status');
const piecesEl = document.getElementById('pieces');
const placeedEl = document.getElementById('placeed');
const hintBtn = document.getElementById('hintBtn');
const downloadBtn = document.getElementById('downloadBtn');

/* -------------------------
   Game state
   ------------------------- */
let IMAGE = new Image();
let pieces = []; // piece objects
let rows = 4, cols = 6; // default preset B Medium 4x6
let boardW = 900, boardH = 600;
let pieceW = 0, pieceH = 0;
let placedCount = 0;
let timerInterval = null, startTime = null;
let snapMode = 'smart'; // smart/grid/none
let rotationMode = 'none'; // none/double
let allowRotation = false;

/* -------------------------
   Utility helpers
   ------------------------- */
function $(s) { return document.querySelector(s); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}
function startTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const sec = (Date.now() - startTime) / 1000;
        updateStatus(null, null, sec);
    }, 400);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }

/* -------------------------
   Build gallery UI
   ------------------------- */
let currentImageSrc = null;
function buildGallery() {
    galleryEl.innerHTML = '';
    BUILTIN_IMAGES.forEach((src, idx) => {
        const div = document.createElement('div');
        div.className = 'thumb';
        div.dataset.src = src;
        const img = document.createElement('img');
        img.src = src;
        div.appendChild(img);
        div.addEventListener('click', () => chooseImage(src, div));
        galleryEl.appendChild(div);
        if (idx === 1) chooseImage(src, div); // default select second
    });
}
function setActiveThumb(el) {
    galleryEl.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
}

/* -------------------------
   Image loading (upload / URL / builtin)
   ------------------------- */
fileInput.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    chooseImage(url, null, true);
});

loadUrlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (!url) return alert('कृपया image URL डालें');
    chooseImage(url, null, true);
});

function chooseImage(src, thumbEl = null, markActive = false) {
    // load image with crossOrigin anonymous to allow canvas draw (may fail if server blocks)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        IMAGE = img;
        currentImageSrc = src;
        if (markActive) setActiveThumb(null);
        else setActiveThumb(thumbEl);
        // set hint overlay image
        hintOverlay.style.backgroundImage = `url(${src})`;
        hintOverlay.style.display = 'none';
        // auto start shuffle
        prepareBoardAndStart();
    };
    img.onerror = () => {
        alert('Image load failed — CORS या URL समस्या हो सकती है। Local file upload से कोशिश करें।');
    };
    img.src = src;
}

/* -------------------------
   Difficulty Preset B mapping
   ------------------------- */
const PRESET_B = {
    easy: { rows: 3, cols: 4 },
    medium: { rows: 4, cols: 6 },
    hard: { rows: 6, cols: 8 },
    extreme: { rows: 10, cols: 14 }
};
difficultySelect.addEventListener('change', () => {
    const v = difficultySelect.value;
    const p = PRESET_B[v];
    rows = p.rows; cols = p.cols;
});

// document.getElementById("settingBtn").addEventListener('click', () => {
//     if (document.getElementById("settingPopup").style.display === 'block')  {
//         document.getElementById("settingPopup").style.display = 'none';
//         return;
//     } else {
//         document.getElementById("settingPopup").style.display = 'block';
//     }
// });

// document.getElementById("hidesettingBtn").addEventListener('click', () => {
//     if (document.getElementById("settingPopup").style.display === 'block')  {
//         document.getElementById("settingPopup").style.display = 'none';
//         return;
//     } else {
//         document.getElementById("settingPopup").style.display = 'block';
//     }
// });
/* -------------------------
   Options (snap / rotation)
   ------------------------- */
snapModeSelect.addEventListener('change', () => snapMode = snapModeSelect.value);
rotationModeSelect.addEventListener('change', () => {
    rotationMode = rotationModeSelect.value;
    allowRotation = (rotationMode !== 'none');
});

/* -------------------------
   Prepare board dimensions and create pieces
   ------------------------- */
function prepareBoardAndStart() {
    if (!IMAGE.src) return alert('पहले image चुनें (gallery/upload/URL)।');
    // preset values
    const p = PRESET_B[difficultySelect.value];
    rows = p.rows; cols = p.cols;

    // fit board to window but respect image aspect ratio
    const maxW = Math.min(window.innerWidth - 420, 1100);
    const maxH = Math.min(window.innerHeight - 120, 800);
    console.log("window.innerWidth",window.innerWidth,"window.innerHeight",window.innerHeight)
    console.log("maxW",maxW,"maxH",maxH)
    const ratio = IMAGE.width / IMAGE.height;
    console.log("ratio",ratio,"IMAGE.width",IMAGE.width, "IMAGE.height", IMAGE.height)
    let bw = IMAGE.width, bh = IMAGE.height;
    console.log("bw",bw,"bh",bh)
    if (bw > maxW) { bw = maxW; bh = bw / ratio; }
    if (bh > maxH) { bh = maxH; bw = bh * ratio; }
    console.log("bw",bw,"bh",bh)

    console.log("boardW",boardW,"boardH",boardH)
    boardW = Math.round(bw); boardH = Math.round(bh);
    console.log("boardW",boardW,"boardH",boardH)
    board.style.width = boardW + 'px';
    board.style.height = boardH + 'px';

    // piece size (integer)
    pieceW = Math.ceil(boardW / cols);
    pieceH = Math.ceil(boardH / rows);
    console.log("pieceW",pieceW,"pieceH",pieceH)

    // clear prior
    clearPieces();
    // create
    createPieces();
    // shuffle
    shufflePieces();
    placedCount = 0;
    updateStatus();
    startTimer();
}

/* -------------------------
   Clear pieces DOM
   ------------------------- */
function clearPieces() {
    pieces.forEach(p => {
        if (p.canvas && p.canvas.parentNode) p.canvas.parentNode.removeChild(p.canvas);
    });
    pieces = [];
}




function createPieces() {

    // For square pieces: NO tabs, NO curves, NO padding
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            const canvas = document.createElement("canvas");
            canvas.width = pieceW;
            canvas.height = pieceH;
            canvas.className = "piece";
            canvas.style.width = pieceW + "px";
            canvas.style.height = pieceH + "px";
            canvas.style.left = "0px";
            canvas.style.top = "0px";
            canvas.style.zIndex = 1000;

            const ctx = canvas.getContext("2d");

            // source cropping on main image
            const scaleX = IMAGE.width / boardW;
            const scaleY = IMAGE.height / boardH;
            const sx = Math.round(c * pieceW * scaleX);
            const sy = Math.round(r * pieceH * scaleY);
            const sw = Math.round(pieceW * scaleX);
            const sh = Math.round(pieceH * scaleY);

            // Draw the square piece (no path/clipping needed)
            ctx.drawImage(IMAGE, sx, sy, sw, sh, 0, 0, pieceW, pieceH);

            // simple border (optional)
            ctx.strokeStyle = "rgba(0,0,0,0.3)";
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, pieceW, pieceH);

            // shadow for look
            canvas.style.filter = "drop-shadow(0 6px 12px rgba(0,0,0,0.4))";

            // Piece object
            const piece = {
                r, c,
                canvas,
                width: pieceW,
                height: pieceH,
                x: 0,
                y: 0,
                correctX: c * pieceW,
                correctY: r * pieceH,
                placed: false,
                rotation: 0
            };

            attachPointerHandlers(piece);
            board.appendChild(canvas);
            pieces.push(piece);
        }
    }

    // random stacking
    pieces.forEach((p, idx) => p.canvas.style.zIndex = 1000 + idx);
}




/* -------------------------
   Shuffle pieces: distribute pieces randomly within board bounds
   ------------------------- */
function shufflePieces() {
    const padding = 4;
    pieces.forEach((p, i) => {
        const maxX = boardW - p.width;
        const maxY = boardH - p.height;
        p.x = Math.floor(Math.random() * (maxX - padding)) + padding / 2;
        p.y = Math.floor(Math.random() * (maxY - padding)) + padding / 2;
        p.rotation = 0;
        p.placed = false;
        updatePieceDOM(p);
        p.canvas.style.pointerEvents = 'auto';
    });
    // randomize z-order
    shuffleArray(pieces);
    pieces.forEach((p, idx) => p.canvas.style.zIndex = 1000 + idx);
}

/* -------------------------
   Update piece DOM (position/rotation)
   ------------------------- */
function updatePieceDOM(p) {
    p.canvas.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
}

/* -------------------------
   Attach pointer handlers for drag and rotate
   - pointerdown, pointermove, pointerup
   - double-click rotates if enabled
   ------------------------- */
function attachPointerHandlers(p) {
    const el = p.canvas;
    let isDown = false;
    let start = { x: 0, y: 0 };
    let startPos = { x: 0, y: 0 };
    let pid = null;
    let lastTap = 0;

    el.addEventListener('pointerdown', ev => {
        ev.preventDefault();
        el.setPointerCapture(ev.pointerId);
        isDown = true;
        pid = ev.pointerId;
        start = { x: ev.clientX, y: ev.clientY };
        startPos = { x: p.x, y: p.y };
        // bring to front
        el.style.zIndex = 9999;
    });

    window.addEventListener('pointermove', ev => {
        if (!isDown || ev.pointerId !== pid) return;
        ev.preventDefault();
        const dx = ev.clientX - start.x;
        const dy = ev.clientY - start.y;
        p.x = startPos.x + dx;
        p.y = startPos.y + dy;
        updatePieceDOM(p);
    });

    window.addEventListener('pointerup', ev => {
        if (!isDown || ev.pointerId !== pid) return;
        ev.preventDefault();
        isDown = false;
        try { el.releasePointerCapture(pid); } catch (e) { }
        pid = null;
        // on drop -> check snap
        handleDrop(p);
    });

    // double click to rotate (if enabled)
    el.addEventListener('click', ev => {
        const now = Date.now();
        if (now - lastTap < 300) {
            // double click
            if (rotationMode === 'double') {
                p.rotation = (p.rotation + 90) % 360;
                updatePieceDOM(p);
                handleDrop(p);
            }
        }
        lastTap = now;
    });

    // prevent context menu on long press
    el.addEventListener('contextmenu', ev => ev.preventDefault());
}

/* -------------------------
   handleDrop: snapping rules
   - smart: if close enough and rotation 0 -> snap
   - grid: snap to exact cell (ignore pad)
   - none: leave as is
   ------------------------- */
function handleDrop(p) {
    // compute distance from center of piece to its target
    const targetX = p.correctX;
    const targetY = p.correctY;
    const dx = p.x - targetX;
    const dy = p.y - targetY;
    const dist = Math.hypot(dx, dy);
    const threshold = Math.max(30, Math.min(pieceW, pieceH) * 0.28);

    const rotationOK = (p.rotation % 360) === 0;

    if (snapMode === 'none') {
        p.placed = false;
        updateStatus();
        return;
    } else if (snapMode === 'grid') {
        // snap if overlapping the correct cell area (intersect)
        const left = p.x, top = p.y;
        if (Math.abs(dx) < p.width && Math.abs(dy) < p.height && rotationOK) {
            p.x = targetX; p.y = targetY;
            lockPiece(p);
        } else {
            p.placed = false;
        }
    } else { // smart
        if (dist <= threshold && rotationOK) {
            p.x = targetX; p.y = targetY;
            lockPiece(p);
        } else {
            p.placed = false;
        }
    }
    updatePieceDOM(p);
    updateStatus();
}

/* -------------------------
   lockPiece: finalize placed piece
   ------------------------- */
function lockPiece(p) {
    p.placed = true;
    // disable further pointer interactions
    p.canvas.style.pointerEvents = 'none';
    // adjust z-index lower so others can overlap
    p.canvas.style.zIndex = 800;
    // count placed
    placedCount = pieces.filter(x => x.placed).length;
    if (placedCount === pieces.length) onWin();
}

/* -------------------------
   onWin: puzzle complete
   ------------------------- */
function onWin() {
    stopTimer();
    setTimeout(() => {
        alert('बधाई! Puzzle पूरा हुआ — Time: ' + statusTime());
    }, 200);
}

/* -------------------------
   updateStatus: update status bar
   ------------------------- */
function statusTime() {
    if (!startTime) return '00:00';
    const sec = (Date.now() - startTime) / 1000;
    return formatTime(sec);
}
function updateStatus(total = null, placed = null, sec = null) {
    total = total === null ? pieces.length : total;
    placed = placed === null ? pieces.filter(p => p.placed).length : placed;
    sec = sec === null ? (startTime ? (Date.now() - startTime) / 1000 : 0) : sec;
    // statusEl.textContent = `Pieces: ${total} | Placed: ${placed} | Time: ${formatTime(sec)}`;
    piecesEl.textContent = total;
    placeedEl.textContent = placed;
}

/* -------------------------
   Helper: shuffle array in-place
   ------------------------- */
function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

/* -------------------------
   Download assembled image (canvas composite)
   ------------------------- */
downloadBtn.addEventListener('click', () => {
    // draw full assembled image on offscreen canvas sized boardW x boardH
    const out = document.createElement('canvas');
    out.width = boardW; out.height = boardH;
    const ctx = out.getContext('2d');
    // background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, out.width, out.height);
    // draw the original image fitted to board size
    ctx.drawImage(IMAGE, 0, 0, IMAGE.width, IMAGE.height, 0, 0, out.width, out.height);
    // export
    const link = document.createElement('a');
    link.download = 'jigsaw-result.png';
    link.href = out.toDataURL('image/png');
    link.click();
});

/* -------------------------
   Controls: start / reset / hint
   ------------------------- */
startBtn.addEventListener('click', () => {
    document.getElementById("settingPopup").style.display = 'none';
    prepareBoardAndStart();
});
resetBtn.addEventListener('click', () => {
    // reshuffle and reset placed
    shufflePieces();
    document.getElementById("settingPopup").style.display = 'none';
    pieces.forEach(p => {
        p.placed = false;
        p.canvas.style.pointerEvents = 'auto';
    });
    placedCount = 0;
    updateStatus();
    startTimer();
});
hintBtn.addEventListener('click', () => {
    if (hintOverlay.style.display === 'none') {
        hintOverlay.style.display = 'block';
        hintBtn.textContent = 'Hide Hint';
    } else {
        hintOverlay.style.display = 'none';
        hintBtn.textContent = 'Show Hint';
    }
});

/* -------------------------
   Initialize page
   ------------------------- */
buildGallery();
// set initial states
snapMode = snapModeSelect.value;
rotationMode = rotationModeSelect.value;
allowRotation = (rotationMode !== 'none');

/* -------------------------
   Auto-select first builtin image if none chosen
   ------------------------- */
if (!IMAGE.src) {
    chooseImage(BUILTIN_IMAGES[0], galleryEl.querySelector('.thumb'));
}

/* -------------------------
   Window resize -> adjust board rect (no auto reflow to avoid losing pieces)
   ------------------------- */
window.addEventListener('resize', () => {
    // do nothing heavy; user can press Start to recompute sizing
});

/* -------------------------
   END
   ------------------------- */

   const themeToggle = document.getElementById('toggle-theme');
   function setTheme(t) {
     if (t === 'dark') {
       document.documentElement.setAttribute('data-theme', 'dark');
       localStorage.setItem('rg_theme', t);
       themeToggle.textContent = '☀️ Light'
     }
     if (t === 'light') {
       document.documentElement.setAttribute('data-theme', 'light');
       localStorage.setItem('rg_theme', t);
       themeToggle.textContent = '🌙 Dark'
     }
   }
   if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
   setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');