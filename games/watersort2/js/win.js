function checkWin() {
    const win = gameState.every(t =>
      t.length === 0 ||
      (t.length === TUBE_SIZE && t.every(c => c === t[0]))
    );
  
    if (win) {
      setTimeout(() => alert("🎉 You Win!"), 100);
    }
  }
  