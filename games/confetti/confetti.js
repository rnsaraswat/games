// confetti.js
// sirf animation ka kaam

window.launchConfetti = function (duration = 2500) {
    return new Promise(resolve => {
  
      const end = Date.now() + duration;
  
      (function frame() {
        confetti({
          particleCount: 6,
          spread: 80,
          origin: { y: 0.6 }
        });
  
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          resolve(); // ✅ confetti khatam
        }
      })();
  
    });
  };
  