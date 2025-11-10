import { player1 } from './script.js';
class FireParticle {
    constructor(x, y, color, dx, dy, shape) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
        this.shape = shape;
        this.alpha = 1;
        this.gravity = 0.08;
        this.size = 4 + Math.random() * 4;
    }

    drawPolygon(ctx, sides) {
        const step = (Math.PI * 2) / sides;
        ctx.moveTo(this.size, 0);
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(this.size * Math.cos(i * step), this.size * Math.sin(i * step));
        }
    }

    drawStar(ctx, points, innerRatio = 0.5) {
        const step = Math.PI / points;
        ctx.moveTo(this.size, 0);
        for (let i = 0; i < 2 * points; i++) {
            const radius = i % 2 === 0 ? this.size : this.size * innerRatio;
            const angle = i * step;
            ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
        }
        ctx.closePath();
    }

    // drawStar1(ctx, x, y, outerRadius, innerRadius, points, rotation = 0) {
    drawStar1(ctx, x, y, points, rotation = 0) {
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? this.size : this.size * 0.5;
            const angle = rotation + (i * Math.PI / points);
            const currentX = x + radius * Math.cos(angle);
            const currentY = y + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(currentX, currentY);
            } else {
                ctx.lineTo(currentX, currentY);
            }
        }
        ctx.closePath();
        ctx.stroke(); // or ctx.fill()
    }

    update(ctx) {
        this.dy += this.gravity;
        this.x += this.dx;
        this.y += this.dy;
        this.alpha -= 0.02;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        // for neon display
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.strokeStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        switch (this.shape) {
            case 'freehandOpen':
                ctx.moveTo(-this.size, -this.size / 2);
                for (let i = 0; i < 4; i++) {
                    const dx = (Math.random() - 0.5) * this.size;
                    const dy = (Math.random() - 0.5) * this.size;
                    ctx.lineTo(dx, dy);
                }
                break;
            case 'freehandClosed':
                ctx.moveTo(-this.size, -this.size / 2);
                for (let i = 0; i < 4; i++) {
                    const dx = (Math.random() - 0.5) * this.size;
                    const dy = (Math.random() - 0.5) * this.size;
                    ctx.lineTo(dx, dy);
                }
                ctx.closePath();
                break;
            case 'circle': ctx.arc(0, 0, this.size, 0, 2 * Math.PI); break;
            case 'square': ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size); break;
            case 'triangle':
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, this.size);
                ctx.lineTo(-this.size, this.size);
                ctx.closePath(); break;
            case 'ellipse':
                ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2); break;
            case 'zigzag':
                for (let i = 0; i < 5; i++) {
                    const x = i * this.size / 5 - this.size / 2;
                    const y = (i % 2 === 0 ? -1 : 1) * this.size / 2;
                    ctx.lineTo(x, y);
                } break;
            case 'pentagon': this.drawPolygon(ctx, 5); break;
            case 'hexagon': this.drawPolygon(ctx, 6); break;
            case 'heptagon': this.drawPolygon(ctx, 7); break;
            case 'octagon': this.drawPolygon(ctx, 8); break;
            case 'nonagon': this.drawPolygon(ctx, 9); break;
            case 'decagon': this.drawPolygon(ctx, 10); break;
            case 'star5': this.drawStar(ctx, 5); break;
            case 'star6': this.drawStar(ctx, 6); break;
            case 'star7': this.drawStar(ctx, 7); break;
            case 'star8': this.drawStar(ctx, 8); break;
            case 'star9': this.drawStar(ctx, 9); break;
            case 'star10': this.drawStar(ctx, 10); break;
            case 'star15': this.drawStar1(ctx, 5); break;
            case 'star16': this.drawStar1(ctx, 6); break;
            case 'star17': this.drawStar1(ctx, 7); break;
            case 'star18': this.drawStar1(ctx, 8); break;
            case 'star19': this.drawStar1(ctx, 9); break;
            case 'star20': this.drawStar1(ctx, 10); break;
            default: ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.restore();
    }

    isAlive() {
        return this.alpha > 0;
    }
}

class GroundCracker {
    constructor(x, y) {
        this.particles = [];
        this.colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffffff'];
        this.shapes = [
            'freehandOpen', 'freehandClosed',
            'circle', 'square', 'triangle', 'ellipse', 'zigzag',
            'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon',
            'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon',
            'star5', 'star6', 'star7', 'star8', 'star9', 'star10',
            'star15', 'star16', 'star17', 'star18', 'star19', 'star20',
            'freehandOpen', 'freehandClosed'
        ]; for (let i = 0; i < 60; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 4 + 1.5;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            this.particles.push(new FireParticle(x, y, color, dx, dy, shape));
        }
    }

    update(ctx) {
        this.particles.forEach(p => p.update(ctx));
        this.particles = this.particles.filter(p => p.isAlive());
    }

    isAlive() {
        return this.particles.length > 0;
    }
}

// show wining text using canvas
function drawNeonText(ctx, canvas) {
    ctx.save();
    ctx.font = "bold 4vw EnglishFontBangers";
    if (document.body.classList.contains("dark")) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
    } else {
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
    }
    ctx.textAlign = "center";
    ctx.letterSpacing = "5px";

    ctx.textBaseline = "middle";
    ctx.shadowColor = "lightblue";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    if (document.body.classList.contains("dark")) {
        ctx.shadowColor = 'rgb(128, 0, 128)';
        ctx.fillText(`🎉 ${player1} Won! 🎉`, canvas.width / 2, canvas.height / 2);
    } else {
        ctx.shadowColor = 'rgb(0, 255, 255)';
        ctx.fillText(`🎉 ${player1} Won! 🎉`, canvas.width / 2, canvas.height / 2);
    }
    ctx.restore();
}

// launch fireworks 
export function launchFireworks() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.zIndex = 9999;
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const crackers = [];

    // Edges only - top, bottom, left, right (not center)
    const edgeCrackers = 8;
    const padding = 60;

    for (let i = 0; i < edgeCrackers; i++) {
        // Top
        crackers.push(new GroundCracker(
            padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
            padding
        ));
        // Bottom
        crackers.push(new GroundCracker(
            padding + i * (window.innerWidth - 2 * padding) / (edgeCrackers - 1),
            window.innerHeight - padding
        ));
        // Left
        crackers.push(new GroundCracker(
            padding,
            padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
        ));
        // Right
        crackers.push(new GroundCracker(
            window.innerWidth - padding,
            padding + i * (window.innerHeight - 2 * padding) / (edgeCrackers - 1)
        ));
    }

    function animate() {
        if (document.body.classList.contains("dark")) {
            ctx.fillStyle = 'rgba(0,0,0,0.01)';
        } else {
            ctx.fillStyle = 'rgba(255,255,255,0.01)';
        }

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // show wining text using canvas
        drawNeonText(ctx, canvas);
        crackers.forEach(c => c.update(ctx));
        for (let i = crackers.length - 1; i >= 0; i--) {
            if (!crackers[i].isAlive()) crackers.splice(i, 1);
        }

        if (crackers.length > 0) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    }

    animate();
}