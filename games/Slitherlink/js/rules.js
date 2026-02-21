import { textToSpeechEng } from './speak.js';

document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("rulesPopup").style.display == "none") {
        document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
        // document.getElementById("rulesPopup").style.display == "flex";
        textToSpeechEng('Close Rules');
        document.getElementById("rulesPopup").style.display = "none";
    }
});

document.getElementById("rulesCloseBtn").addEventListener("click", () => {
    document.getElementById("toggle-rules").textContent = "📜View Rules"
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
});

function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    rule.innerHTML = `<h1>Slitherlink General Rules</h1>
    1. Slitherlink is a logic puzzle where you draw a single, continuous, non-branching loop on a dot grid, connecting adjacent dots horizontally or vertically.<br> 
    2. Numbers inside cells indicate how many of that cell's four sides are part of the loop (0–3).<br> 
    3.<b>Goal:</b>The goal is to form one closed loop without crossings, branches, or loose ends.
    <h2>Core Rules</h2>
    <b>Connect Dots:</b> Connect adjacent dots horizontally or vertically to form a loop; diagonal connections are forbidden.<br>
    <br><b>Number Clues:</b> A number (0,1,2,3) in a cell indicates exactly how many of its four sides must be part of the final loop.<br>
    <b>Empty Cells:</b> Cells without numbers can have any number of sides (0–4) as part of the loop.<br>
    <b>Single Loop:</b> The solution must be one single, continuous, non-intersecting loop.<br>
    <b>No Loose Ends/Branches:</b> The loop cannot branch off or leave segments unconnected.
    <h2>Basic Solving Tips:</h2>
    <b>Zeros (0):</b> No lines can touch a cell.<br>
    <b>Threes (3):</b> A 3 requires three sides of the cell to be filled, which usually means the only side NOT used is the one that forces a branch or violates a neighboring cell.<br>
    <b>Corners & 3s:</b> A 3 in a corner always has two specific sides filled.
    <b>Corners & 2s</b>: A 2 in a corner often forces a specific diagonal path (e.g., if a 2 is in the corner, and one adjacent edge is marked empty, the other must be filled).<br>
    <b>Corners & 1s:</b> A 1 in a corner means one of the sides touching that corner must be filled, but not both. 
    <h2>Techniques:</h2>
    <b>Parity:</b> Every closed loop crosses any straight line through the grid an even number of times.
    <br><b>Edge Cases:</b> If a corner has a 2 and one edge is x'd out, the two sides of the corner must be filled to fulfill the 2 requirement.
    <br><b>Separation:</b> If two 3s are adjacent, they often form a specific pattern of lines.
    <br><b>Auto-Cross:</b> Many digital versions automatically place an x if a cell has all its required lines or if a line would force a branch.
    <h2>How to Play</h2>
    <b>Players and Board:</b> The game is for Single players, connecting adjacent dots horizontally or vertically according to Numbers inside cells indicate how many of that cell's four sides are part of the loop (0–3).
        
    A grid is drawn, which has more then spaces (a square grid). <br>
    the availabe grid size are
    4x4, 5x5, 6x6, 7x7, 8x8, 9x9, 10x10, 12x12, 14x14, 15x15, 16x16,
    18x18, 20x20, 21x21, 22x22, 24x24, 25x25, 25x30<br><br>
        
    <b>Marking line:</b> Players click between two dots horizontally, vertically to mark line.<br>
    As the cells (4 dots) containes number of lines equal to number inside cells (4 dots) the other side got crossed marked.<br>
    Player connot mark line on cells more then numbers in side the cell.<br>
    <b>Removing lines:</b> line can be removing by clicking between dots if line present between dots.<br>
    <b>Removing Cross:</b> Cross can be removing by clicking between dots if cross present between dots. cross is removed only if cell containes lines less then number shown.<br> 
    on first click between dots line marked, on second click line removed cross marked on, third click cross removed cross.<br>
    <b>Winning:</b> Game completed when player form one closed loop without crossings, branches, or loose ends successfully and cells conatains sides equal to mark numbers. <br>
        
    <b>level of games:</b> if play against computer it has four level<br>
    <u>Easy:</u> In this more empty cell and smaller loop.<br>
    <u>Medium:</u> In this some less empty cell and some bigger loop.<br>
    <u>Hard:</u> In this less empty cell and bigger loop.<br>
    <u>Expert:</u> In this more the number and complex loop.<br>

    <h2>Buttons used in the game</h2>
<u>Grid Size:</u> This dropdown menu to select grid size of puzzle. lesser the grid size easy the difficulty and more harder the difficulty.<br>
<u>Level Button:</u>This dropdown menu to select grid size of puzzle, the levels are Easy/Medium/Hard.<br>
<u>Easy:</u> In this more empty cell and smaller loop.<br>
<u>Medium:</u> In this some less empty cell and some bigger loop.<br>
<u>Hard:</u> In this less empty cell and bigger loop.<br>
<u>Expert:</u> In this more the number and complex loop.<br>
<u>New Game:</u> This will display grid with empty dots board to play. the time is also start. Every time new game board is diaplayed. the time is also restart. <br>
<u>Undo:</u> Undo the last cell filled by you. By pressing this button again an again it will remove before last cell filled by you continue till all filled cell are removed from game board. unnecessary press undo will also reduce your score.<br>
<u>Redo:</u> Redo the cell draw line/remove line/remove corss again which is undo by you. By pressing this button again an again it will draw line/remove line/remove corss which is undo by you continue till all draw line/remove line/remove corss on game board. unnecessary press rddo will also reduce your score.<br>
<u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
<u>Sound:</u> this is also toggle button to stop and play background music during game play.
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
Information window display the filled/empty cell and time during the game play.
<u>Timer:</u> this will display the elapsed time of current game.<br>
<u>Pause:</u> Press once pause button will stop the timer pause the elapsed timer of current game. Press twice pause button will start the  elapsed timer of current game.<br>
<u>Message:</u> display various message/instruction during game play.
<h2>Play</h2> 1. select grid size and level and press new buttons.<br>
2. Click place line between dots, one by one between dots single, continuous, non-branching loop on grid.<br>`;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}