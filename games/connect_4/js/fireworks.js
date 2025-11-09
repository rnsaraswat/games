import { playSound } from './sound.js';
// 🎉 Show You Won! Text and Fireworks
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

export function showWinText(winner) {
    const winText = document.getElementById("winText");
    winText.textContent = `🎉 ${winner} Won! 🎉`;
    winText.style.opacity = 1;
    winText.style.transform = "translate(-50%, -50%) scale(1.2)";

    // Hide text after 3 seconds
    setTimeout(() => {
        winText.style.opacity = 0;
        winText.style.transform = "translate(-50%, -50%) scale(1)";
    }, 3000);
}

// Crackers canvas Animation
let particles = [];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// create Crackers
function createCracker(x, y) {
    // i is no particles (sparks) from each cracker
    for (let i = 0; i < 100; i++) {
        particles.push({
            x,
            y,
            //vx - horizontal velocity of particles (6 is decide speed)
            //vy - verticle velocity of particles
            //Math.random() - 0.5 - for particle in all 360 dec direction
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            alpha: 1,
            // redius of particles  0 very small, 6 bigger
            radius: Math.random() * 3 + 1,
            // color of each particles seperate
            color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
}

// Animate Crackers
function animateCrackers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hslToRgbStr(p.color)},${p.alpha})`;
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) {
        requestAnimationFrame(animateCrackers);
    }
}

function hslToRgbStr(hsl) {
    // Convert hsl string to rgb string for canvas fillStyle
    const temp = document.createElement("div");
    temp.style.color = hsl;
    document.body.appendChild(temp);
    const rgb = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return rgb.match(/\d+/g).slice(0, 3).join(',');
}

export function launchFireworks() {
    // i is no of crackers displayed
    for (let i = 0; i < 100; i++) {
        // x -horizontal, y - vericle position of each crackers
        const x = Math.random() * canvas.width;
        // canvas.height/2 will display crackes on half height of window
        const y = Math.random() * canvas.height;
        createCracker(x, y);
    }
    playSound('fire');
    animateCrackers();
}