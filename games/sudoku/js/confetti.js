// these line are added in index.html file display wintext and fireworks
// <div id="winText"></div>
// <canvas id="confettiCanvas"></canvas>

// these line are added in style.css file
/* Confetti canvas */
// #confettiCanvas {
//     position: fixed;
//     inset: 0;
//     pointer-events: none;
//     z-index: 9999;
// }

/* display wining text */
// #winText {
//     position: absolute;
//     top: 20%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     font-size: 3vw;
//     color: var(--win-text);
//     text-shadow: 0.2vw 0.2vw 1vw #fff;
//     font-weight: bold;
//     opacity: 1;
//     z-index: 1001;
//     transition: opacity 0.5s ease, transform 0.5s ease;
//     pointer-events: none;
// }

// these line are added in script.js javascript file

/* ---------- Confetti engine ---------- */
const c = document.getElementById('confettiCanvas');
const ctx = c.getContext('2d');

function resizeCanvas() {
    c.width = innerWidth;
    c.height = innerHeight;
}

addEventListener('resize', () => {
    resizeCanvas();
});
resizeCanvas();

let confettiParticles = [], confettiRunning = false, rafId = null;
// function restartConfetti() {
//     if (confettiRunning) {
//         stopConfetti();
//         launchConfetti();
//     }
// }

export function stopConfetti() { 
    cancelAnimationFrame(rafId); 
    confettiRunning = false; 
    confettiParticles.length = 0; 
    ctx.clearRect(0, 0, c.width, c.height); 
}

export function launchConfetti() {
    // const n = +densityInp.value;
    // const dir = directionSel.value;
    // const multi = colorModeSel.value === 'multi';
    // const single = singleColorInp.value;
    const n = 700;
    const dir = 'up'
    const multi = 'multi';
    const single = 'rgba(255, 106, 0, 0.35)';
    confettiParticles = makeParticles(n, dir, multi, single);
    if (!confettiRunning) {
        confettiRunning = true;
        loopConfetti();
    }
}
function makeParticles(n, direction, multi, singleColor) {
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#f72585', '#4cc9f0', '#b5179e', '#ff9f1c', '#2ec4b6'];
    const W = c.width, H = c.height;
    const arr = [];
    let emitX = W / 2, emitY = H / 2, spread = Math.PI / 2, vx0 = 0, vy0 = 0, gravity = 0.18;
    if (direction === 'up') {
        emitY = H - 10; vy0 = -(8 + Math.random() * 4); gravity = 0.15;
    }
    if (direction === 'down') {
        emitY = 10; vy0 = (6 + Math.random() * 4); gravity = 0.25;
    }
    if (direction === 'left') {
        emitX = W - 10; vx0 = -(8 + Math.random() * 4); gravity = 0.20;
    }
    if (direction === 'right') {
        emitX = 10; vx0 = (8 + Math.random() * 4); gravity = 0.20;
    }

    for (let i = 0; i < n; i++) {
        const ang = (direction === 'up' || direction === 'down')
            ? (direction === 'up' ? -Math.PI / 2 : Math.PI / 2) + (Math.random() - 0.5) * spread
            : (direction === 'left' ? Math.PI : 0) + (Math.random() - 0.5) * spread;

        const spd = 4 + Math.random() * 6;
        const col = multi ? colors[(i * 37) % colors.length] : singleColor;

        arr.push({
            x: emitX + (Math.random() - 0.5) * 80,
            y: emitY + (Math.random() - 0.5) * 40,
            vx: Math.cos(ang) * spd + (direction === 'left' || direction === 'right' ? vx0 * 0.2 : 0),
            vy: Math.sin(ang) * spd + (direction === 'up' || direction === 'down' ? vy0 * 0.2 : 0),
            size: 4 + Math.random() * 6,
            color: col,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 220,
            drag: 0.985 + Math.random() * 0.01,
            gravity: gravity,
            shape: Math.random() < 0.5 ? 'rect' : 'circle',
            life: 0,
            maxLife: 180 + Math.random() * 120
        });
    }
    return arr;
}

function loopConfetti() {
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of confettiParticles) {
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed / 60;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
            ctx.fillRect(-p.size, -p.size / 2, p.size * 2, p.size);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        if (p.y > -50 && p.y < H + 50 && p.x > -50 && p.x < W + 50 && p.life < p.maxLife) alive++;
    }
    if (alive > 0) {
        rafId = requestAnimationFrame(loopConfetti);
    } else {
        confettiRunning = false;
    }
}

/* ---------- Misc ---------- */
document.addEventListener('visibilitychange', () => { 
    if (document.hidden) stopConfetti(); 
});