document.getElementById("toggle-rules").addEventListener("click", () => {
  if (document.getElementById("rulesPopup").style.display == "none") {
    document.getElementById("rulesPopup").style.display == "flex";
    showRules();
  } else {
    document.getElementById("rulesPopup").style.display = "none";
  }
});

document.getElementById("rulesCloseBtn").addEventListener("click", () => {
  document.getElementById("toggle-rules").textContent = "📜View Rules";
  document.getElementById("rulesPopup").style.display = "none";
});

// Rules Display
function showRules() {
  let rule = document.getElementById("RulesBox");
  rule.style.textAlign = "left";
  // all rules are write here with required HTML tegs
  rule.innerHTML = `<h2>How to play</h2>
  1. player can click/tap on any unlocked puzzle to play, the puzzle will display on chess board<br>
  2. Click/Tap a chess board to select piece to move it.<br>
  3. After select piece the gree dots indicate the correct move of that piece as per chess rules.<br>
  4. Click/Tap another chess board indicate by green dots move piece at valid position. <br>
  4(a). if click/tap on green dots, it is valid move.<br>
  4(b). if it is an incorrect move (not chakemate) will cost you one life and piece deselected and need to again select chess piece.  <br>
  4(c). if it is a correct move (chakemate) Completing (solved) a puzzle and it unlock the next puzzle and select puzzle screen displayed. Player repeat step to play new puzzle.  <br>
  5. if click/tap other then green dots, it is invalid move and chess piece deselected and need to again select chess piece. <br> 

<h2>1. Board Setup</h2>

Before you start, arrange the board so that each player has a light (white) square on their bottom-right corner ("white on right").<br>
• Rooks go on the four corners.<br>
• Knights are placed right next to the rooks.<br>
• Bishops go next to the knights.<br>
• Queen always goes on her own matching color (White Queen on the white square, Black Queen on the black square).<br>
• King takes the vacant spot next to the queen.<br>
• Pawns form a straight protective row on the second rank in front of all other pieces.<br>
Note: White always makes the first move of the game, followed by Black.<br>
<br>
<h2>2. How the Pieces Move</h2>

Each of the 6 chess pieces moves differently:<br>
• ♟️ Pawn: Moves straight forward 1 square. On its very first move, it can choose to move forward 2 squares. Pawns capture diagonally 1 square forward and cannot move or capture backwards.<br>
• ♜ Rook: Moves horizontally or vertically in a straight line for as many open squares as you want.<br>
• ♞ Knight: Moves in an "L" shape (2 squares in one direction, and then 1 square to the side). It is the only piece that can jump over other pieces.<br>
• ♝ Bishop: Moves diagonally for as many open squares as you want. It stays on the same color square it started on.<br>
• ♛ Queen: The most powerful piece. It can move in any straight or diagonal direction for as many open squares as it likes.<br>
• ♚ King: The most critical piece. It can move only 1 square in any direction.<br>

<h2>3. Special Moves</h2>

• Castling: A special safety move where the King moves 2 squares toward a Rook, and that Rook jumps over the King to land right next to it. You can only do this if neither piece has moved yet, and the path between them is clear.<br>
• Pawn Promotion: If a pawn reaches the opposite end of the board, it is instantly promoted (upgraded) into a Queen, Rook, Bishop, or Knight.<br>
• En Passant: A special diagonal rule where a pawn can capture an opponent's pawn that just moved two squares forward past it, as if it had only moved one square.<br>

<h2>4. How the Game Ends</h2>

• Checkmate (Win): When a King is under direct attack ("in check") and has no legal moves to escape, the game ends and the attacking player wins.<br>
• Stalemate (Draw): When it is a player's turn, their King is not in check, but they have absolutely no legal moves left anywhere on the board.<br>
• Other Draws: The game can also end in a tie if both players agree to a draw, if the exact same board position occurs 3 times, or if there aren't enough pieces left on the board to force a checkmate.<br>

<h2>5. Buttons used in the game</h2>
<b>all puzzles are solveable.</b><br>
<u>Try Again:</u> This will reset the current game puzzle and display again same puzzle.<br>
<u>Levels:</u> This will open select level popup box to select game puzzle.<br>
<u>Theme:</u> this is toggle button for changing theme between light(orange) and dark(blue) theme.<br>
<u>Music:</u> this is also toggle button to stop and play background music during game play.<br>
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Information display:</u> display various information like puzzle no., Rating, Elapsed time, lives and puzzle ID. <br>
<u>Message:</u> display various message/instruction during game play. <br>
<br>
`
  document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
  document.getElementById("rulesPopup").style.display = "none";
  document.getElementById("toggle-rules").textContent = "📜View Rules";
}
