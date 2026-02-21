export function arcPour(fromEl, toEl, color, done) {
    const s = fromEl.getBoundingClientRect();
    const t = toEl.getBoundingClientRect();
  
    const f = document.createElement("div");
    f.className = `fly-liquid ${color}`;
    document.body.appendChild(f);
  
    let p = 0;
    function step() {
      p += 0.04;
      const cx = (s.left + t.left) / 2;
      const cy = Math.min(s.top, t.top) - 150;
  
      const x =
        (1-p)*(1-p)*s.left + 2*(1-p)*p*cx + p*p*t.left;
      const y =
        (1-p)*(1-p)*s.top + 2*(1-p)*p*cy + p*p*t.top;
  
      f.style.left = x + "px";
      f.style.top = y + "px";
  
      if (p < 1) requestAnimationFrame(step);
      else {
        document.body.removeChild(f);
        done();
      }
    }
    step();
  }
  
  // 🔹 Flying Pour Animation
function pour(from, to) {
    const src = gameState[from];
    const tgt = gameState[to];
    if (!src.length || tgt.length === TUBE_SIZE) return;
  
    const color = src[src.length - 1];
    if (tgt.length && tgt[tgt.length - 1] !== color) return;
  
    history.push(JSON.parse(JSON.stringify(gameState)));
  
    const srcEl = document.querySelector(`.tube[data-index='${from}']`);
    const tgtEl = document.querySelector(`.tube[data-index='${to}']`);
  
    const srcRect = srcEl.getBoundingClientRect();
    const tgtRect = tgtEl.getBoundingClientRect();
  
    const fly = document.createElement("div");
    fly.className = `fly-liquid ${color}`;
    fly.style.left = srcRect.left + "px";
    fly.style.top = srcRect.top + "px";
    document.body.appendChild(fly);
  
    requestAnimationFrame(() => {
      fly.style.transform =
        `translate(${tgtRect.left - srcRect.left}px, ${tgtRect.top - srcRect.top}px)`;
    });
  
    setTimeout(() => {
      document.body.removeChild(fly);
  
      while (
        src.length &&
        src[src.length - 1] === color &&
        tgt.length < TUBE_SIZE
      ) {
        tgt.push(src.pop());
      }
  
      render();
      checkWin();
    }, 600);
  }