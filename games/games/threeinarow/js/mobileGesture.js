      // Mobile gestures to select columns via swipe
      let touchStartX = 0;
      let touchEndX = 0;
      let touchThreshold = 30; // minimum px to consider swipe
    
      boardEl.addEventListener('touchstart', e => {
        if(gameOver) return;
        if(e.touches.length === 1){
          touchStartX = e.touches[0].clientX;
        }
      });
    
      boardEl.addEventListener('touchend', e => {
        if(gameOver) return;
        if(e.changedTouches.length === 1){
          touchEndX = e.changedTouches[0].clientX;
          let diffX = touchEndX - touchStartX;
          if(Math.abs(diffX) > touchThreshold){
            // Swipe right or left detected
            let boardRect = boardEl.getBoundingClientRect();
            let colWidth = boardRect.width / cols;
            let col = Math.floor(touchStartX / colWidth);
            if(diffX > 0){
              // Swipe right: try next column
              col = Math.min(cols - 1, col + 1);
            } else {
              // Swipe left: try previous column
              col = Math.max(0, col - 1);
            }
            handleMove(col);
          } else {
            // Tap: get tapped column and move
            let boardRect = boardEl.getBoundingClientRect();
            let col = Math.floor(touchEndX / (boardRect.width / cols));
            handleMove(col);
          }
        }
      });