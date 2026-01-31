import { playSound } from './sound.js';
import { winnerName } from './script.js';
const canvas = document.getElementById("crackersCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

export function showWinText() {
    const winText = document.getElementById("winText");
    winText.textContent = "🎉 " + winnerName + " 🎉";
    winText.style.opacity = 1;
    winText.style.transform = "translate(-50%, -50%) scale(1.2)";

    setTimeout(() => {
        winText.style.opacity = 0;
        winText.style.transform = "translate(-50%, -50%) scale(1)";
    }, 3000);
}

let fireworks = [];

class Firework {
    constructor(x, height, color, shape) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = height;
        this.color = color;
        this.shape = shape;
        this.radius = 2;
        this.speed = Math.random() * 3 + 2;
        this.exploded = false;
        this.particles = [];
    }

    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            this.particles.forEach(p => p.update());
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }

    createParticles() {
        const count = 20 + Math.random() * 30;
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 4 + 1;
            this.particles.push(
                new Particle(this.x, this.y, angle, speed, this.color, this.shape)
            );
        }
    }

    isDone() {
        return this.exploded && this.particles.every(p => p.alpha <= 0);
    }
}

class Particle {
    constructor(x, y, angle, speed, color, shape) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.shape = shape;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.shape === "star") {
            drawStar(ctx, this.x, this.y, 5, 5, 5);
        } else if (this.shape === "triangle") {
            drawPolygon(ctx, this.x, this.y, 3, 14);
        } else if (this.shape === "square") {
            drawPolygon(ctx, this.x, this.y, 4, 8);
        } else if (this.shape === "pentagon") {
            drawPolygon(ctx, this.x, this.y, 5, 6);
        } else if (this.shape === "hexagon") {
            drawPolygon(ctx, this.x, this.y, 6, 10);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

function drawPolygon(ctx, x, y, sides, radius) {
    if (sides < 3) return;
    const angle = (Math.PI * 2) / sides;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const dx = x + radius * Math.cos(i * angle);
        const dy = y + radius * Math.sin(i * angle);
        if (i === 0) ctx.moveTo(dx, dy);
        else ctx.lineTo(dx, dy);
    }
    ctx.closePath();
    ctx.fill();
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function launchFirework() {
    const x = Math.random() * canvas.width;
    const height = Math.random() * canvas.height * 0.5 + 100;
    const colors = ["#ff3", "#3ff", "#f3f", "#f33", "#3f3", "#33f"];
    const shapes = ["circle", "star", "triangle", "square", "pentagon", "hexagon"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    fireworks.push(new Firework(x, height, color, shape));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if (fw.isDone()) fireworks.splice(index, 1);
    });
}

setInterval(launchFirework, 600);
animate();

// Resize support
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
