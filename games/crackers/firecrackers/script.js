function firecrackerFromTube(tubeEl, color) {
    const r = tubeEl.getBoundingClientRect();
  
    const startX = r.left + r.width / 2;
    const startY = window.innerHeight - 10;
  
    const peakY = r.top - 40;
  
    const rocket = document.createElement("div");
    rocket.className = "firework";
    rocket.style.left = `${startX}px`;
    rocket.style.background = color;
  
    document.body.appendChild(rocket);
  
    rocket.animate(
      [
        { top: `${startY}px` },
        { top: `${peakY}px` }
      ],
      { duration: 500, easing: "ease-out", fill: "forwards" }
    );
  
    setTimeout(() => {
      rocket.remove();
      explodeAt(startX, peakY, color, 14);
    }, 520);
  }
  
  function explodeAt(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.background = color;
  
      document.body.appendChild(spark);
  
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 60;
  
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
  
      spark.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
        ],
        { duration: 700, easing: "ease-out", fill: "forwards" }
      );
  
      setTimeout(() => spark.remove(), 720);
    }
  }

  function fullGameFireworks() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const peakY = 100 + Math.random() * (window.innerHeight * 0.4);
  
        const rocket = document.createElement("div");
        rocket.className = "firework";
        rocket.style.left = `${x}px`;
        rocket.style.background =
          ["red","yellow","cyan","lime","magenta","orange"]
            [Math.floor(Math.random()*6)];
  
        document.body.appendChild(rocket);
  
        rocket.animate(
          [
            { top: `${window.innerHeight}px` },
            { top: `${peakY}px` }
          ],
          { duration: 600, easing: "ease-out", fill: "forwards" }
        );
  
        setTimeout(() => {
          rocket.remove();
          explodeAt(x, peakY, rocket.style.background, 22);
        }, 620);
  
      }, i * 200);
    }
  }
  