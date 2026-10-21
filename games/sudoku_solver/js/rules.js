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

// Rules Display
function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    rule.innerHTML = `<h2>Sudoku Rules</h2>
    <br>
Sudoku solver rules are simple and straightforward. It is precisely their simplicity that makes finding the solution of any given puzzle.<br>
<br>
To solve Sudoku, the player only needs to be familiar with the numbers from 1 to 9 & A to Z and be able to think logically.<br>
<br>
<b><u>Goal:</b></u> The goal of this solver to fill sqaure in the grid using the numbers from 1 to 9 & A to Z as given in puzzle.<br>
<br>
<b><u>Solving</b></u><br>
After filling entire grid by correctly filling square and left empty square according to the puzzle.<br> 
<br><br>
<b><u>The Core Rules</b></u><br><br>
<b><u>Numbers Alphabets (Rule 1):</b></u> Use only digits from 1 to 9 & A to Z in the grid.<br><br>
<b><u>Row Rule (Rule 2):</b></u> Each horizontal row must contain each number from 1 to 9 & A to Z exactly once. i.e. no duplicated numbers/alphabes in the row.<br><br>
<b><u>Column Rule (Rule 3):</b></u> Each vertical column must contain each number from 1 to 9 & A to Z exactly once. i.e. no duplicated numbers/alphabes in the column.<br><br>
<b><u>Box Rule (Rule 4):</b></u> Each block/sub grids (nonet) must contain each number from 1 to 9 & A to Z exactly once. i.e. no duplicated numbers/alphabets in the block.<br><br>
block/sub grids (nonet) are different size as given under:<br>
1 Grid Size 25x25 [nonets grid 5x5]<br>
2 Grid Size 24x24 [nonets grid 4x6]<br>
3 Grid Size 22x22 [nonets grid 11x2]<br>
4 Grid Size 21x21 [nonets grid 7x3]<br>
5 Grid Size 20x20 [nonets grid 5x4]<br>
6 Grid Size 18x18 [nonets grid 6x6]<br>
7 Grid Size 16x16 [nonets grid 4x4]<br>
8 Grid Size 15x15 [nonets grid 5x3]<br>
9 Grid Size 14x14 [nonets grid 7x2]<br>
10 Grid Size 12x12 [nonets grid 4x3]<br>
11 Grid Size 10x10 [nonets grid 5x2]<br>
12 Grid Size 9x9 [nonets grid 3x3]<br>
13 Grid Size 8x8 [nonets grid 4x2]<br>
14 Grid Size 6x6 [nonets grid 3x2]<br>
15 Grid Size 4x4 [nonets grid 2x2]<br>
<br>
<b><u>Sum Rule (Rule 5):</b></u> The sum of every single row, column, and nonet must equal certain number according the size of puzzle<br>
To find out which numbers are missing from each row, column, or block or if there are any duplicates, the player can simply count or flex their math skills and sum the numbers. When the digits occur only once, the total of each row, column, and group must be certain number .<br>

The certain number of other grid size of sudoku sum of every single row, column, and nonet must equal as under:<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24+25 = 325<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22+23+24 = 300<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21+22 = 253<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20+21 = 231<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20 = 210<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18 = 171<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16 = 136<br>
1+2+3+4+5+6+7+8+9+10+11+12+13+14+15 = 120<br>
1+2+3+4+5+6+7+8+9+10+11+12 = 78<br>
1+2+3+4+5+6+7+8+9+10+11 = 66<br>
1+2+3+4+5+6+7+8+9+10 = 55<br>
1+2+3+4+5+6+7+8+9= 45<br>
1+2+3+4+5+6+7+8 = 36<br>
1+2+3+4+5+6 = 21<br>
1+2+3+4 = 10<br>
<br>

to make number single digit alphabets are used instead number<br>
<br><br>

<b><u>How to Play (Logic, Not Guessing)</b></u><br><br>
<b><u>Start with Givens:</b></u> Puzzles begin with some numbers already filled in (the "givens"). regardless of the difficulty level, begins with allocated numbers on the grid. The player should use these numbers as clues to find which digits are missing in each row.
<b><u>Deduction:</b></u> Use the rules to eliminate possibilities for each empty cell. If a number already exists in a row, column, or 3x3 box, it can't go in the intersecting empty cells.<br><br>
<b><u>Find Singles:</b></u> Look for cells where only one number is possible (a "naked single") or digits that can only go in one spot within a row, column, or box (a "hidden single").<br><br>
<b><u>No Guessing:</b></u> Sudoku puzzles have a unique solution found through logic; guessing can lead you astray. <br>
<br><br>

<b><u>Other details to take into consideration</b></u><br><br>
<b>1. Each puzzle has a unique solution</b><br>
Each Sudoku puzzle has only one possible solution that can only be achieved by following the Sudoku rules correctly.<br>
<br>
Multiple solutions only occur when the puzzle is poorly designed or, the most frequent reason, when the player makes a mistake in its resolution and a duplicate is hidden somewhere on the grid.<br><br>
<b>2. Guessing is not allowed</b><br>
Trying to guess the solution for each cell is not allowed under Sudoku rules. These are logical number puzzles.<br>
<br>
The numbers allocated at the beginning of the game are the only clues the player needs to solve the grid.<br>
<br>
<b>3. Notes and techniques</b><br>
Writing down the numbers that are candidates for each cell is allowed by Sudoku rules and is even encouraged. These help the player keep track of their progress and keep their reasoning organized and clear.<br>
<br>
As the difficulty level of these puzzles increases, these notes also become essential to apply the advanced solving techniques required to complete the grid.<br>
<br><br>

<b>Buttons used in the game</b><br><br>
<u>Grid Size:</u> This dropdown menu to select different grid size of sudoku puzzle.<br>
<u>Difficulty:</u> This is also dropdown menu to select difficulty level of game. the levels are Learner/Easy/medium/Hard/Expert.<br>
<u>Lerner:</u> 75% or more numbers are filled.<br>
<u>Easy:</u> 55% or more numbers are filled.<br>
<u>Medium:</u> 45% or more numbers are filled.<br>
<u>Hard:</u> 35% or more numbers are filled.<br>
<u>Expert:</u> 25% or more numbers are filled.<br>
<u>New game:</u> This will display grid and puzzle according to grid size with some filled or empty number/Alphabets according to level of difficulty. the time is also start. Each time you press new puzzle id displayed.<br>
<u>Reset:</u> This will reset the current game puzzle and display again same puzzle. Beware to reset it will loose cells filled by you during play.<br>
<u>undo:</u> Undo the cell filled by you. By pressing this button again an again it will remove cell filled last by you continue till all filled cell are removed from game board. unnecessary press redo will also reduce your score.<br>
<u>redo:</u> Redo the cell filled again which is undo by you. By pressing this button again and again it will filled all cell last undo by you continue till all undo are completed. unnecessary press undo will reduce your score.<br>

<u>Pause:</u> This button will stop timer till resume button is pressed. you cannot play puzzle in pause mode.<br>
<u>Hint:</u> This button provide hint and filled any one empty number on game board and reduce hint counter. hints are limited use only when needed. this hint are available according to levels.<br>
<u>Check:</u> While pressing check it will shows no of mistakes in the current board in message box. <br>
<u>Error off:</u> this is toggle button, once you press errors are off and again you press errors are on. during on position it will show errors on game board if any rules is broken.<br>
<u>Solve:</u> this button is solve the current puzzle. the cell filled with incorrect number/alphabets also indicated both correct and incorrect.<br>
<u>Theme:</u> this is toggle button for changing theme between light and dark theme.<br>
<u>Music:</u> this is also toggle button to stop and play background music during game play.
<u>View Rules:</u> This also toggle button to view and hide rules (current window).<br>
<u>Global leaderboard:</u> This toggle button to show and hide Global leaderboard (all any one who play and win).<br>
<u>Local leaderboard:</u> This toggle button to show and hide local leaderboard (The games played and win on you current device only).<br>
<u>Sharing:</u> this button used to share the current game link to any one on facebook/tweeter/instgram/whatapp/email etc.<br>
<u>Home:</u> Press this button bring you to Home screen (all game list) of Ravindra Games Hub. this will also loose your current game.<br>
<u>Feedback:</u> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br>
Information window display the filled/empty cell and time during the game play.
<u>Message:</u> display various message/instruction during game play. <br>
<u>Numpad:</u> this will diplay the buttons for number/alphbets according to grid size of game.<br>
<br>
<b><u>play:</b></u><br> 1. select grid size and level and pres new buttons.<br>
2. to fill cell with number/alphabts first select the number/aphabets in numpad. the selected show the different, then click cell to fille that number in the cell.<br>
3. to romove number/alphbets forn cell first select the cell, then click on back button in numpad to reomve the number/alphbets.<br>`;

let GameFeatureBox = document.getElementById("GameFeatureBox");
GameFeatureBox.style.textAlign = "left";
// all rules are write here with required HTML tegs
GameFeatureBox.innerHTML = `
<p>Modern digital memory games featured on Ravindra Games Hub are designed to expand upon the simple, classic tabletop card-matching layout. Integrate specific core modules to maximize replay value, improve brain training, and accommodate all age groups.<br> <br></p>
<p>
        <b>🎮 Gameplay Configurations & Mechanics Grid and Level Scales:</b><br> Games scale from simple grids for quick casual play up to massive grids for a deep focus session.<br></p>
        <p>Grid options commonly level/size(no of card/tiles) as under:-<br></p>
         <p>    <u>very easy</u> - 4x4 total 16 cards/times.<br></p>
         <p>    <u>easy</u> - 6x6 total 36 cards/tiles.<br></p>
         <p>    <u>medium</u> - 8x8 total 64 cards/tiles.<br></p>
         <p>    <u>hard</u> - 10x10 total 100 cards/tiles.<br></p>
         <p>    <u>expert</u> - 12x12 total 144 cards/tiles.<br><br></p>
         <p><b>⏱️Varied Game Modes:</b><br></p>
         <p>    <u>Moves Mode:</u> Flips total number of card in minimum flips before a game over to get higher score.<br></p>
         <p>    <u>Time Attack Mode:</u> Players find every single pair in minimum time of  count up clock to get higher score.<br></p>
         <p>    <u>Endless / Relax Mode:</u> Player can play for casual practice layout without limits or timers to encourage stress-free focus by ignoring the moves and timer.<br><br></p>
         <p><b>🎨 Visual & Customization Features Extensive Deck Themes:</b> Instead of traditional playing cards, boards feature diverse icon types to challenge multi-categorical retention.<br> </p>
        <p>Theme categories include:<br></p>
        <p>    <u>Nature & Animals:</u> 🦁Animals, 🐦 Bird, 🦈 Ocean and Wildlife animals, 🌱 Plant.
            <u>Objects & Learning:</u> 🧸 Toy, 👕 Cloth, House Items, 🍎 Food, 📺 House item, 📦 Items, 🍅 Vegetable.<br></p>
        <p>    <u>Pop Culture & Fun:</u> 🎭 Actors, 🎭 Actress, Emojis.<br> </p>
        <p>    <u>Seasonal themes:</u>  🎃 Halloween, 🤝 Social. <br></p>
        <p>    <u>Education and Learning:</u>0️⃣ Number, 🧑‍🍳 Occupations, Past tense, 🪐 Solar System,  🛝 playground, 🚗 Transportation, 🏖️ Beach, 🏙️ City Item, 🏳️ Flags, <br><br></p>
        <p><b>🌙UI Themes:</b> Dark mode or customizable color profiles help limit digital eye strain during extended play sessions. <br><br></p>
        <p><b>🔊Audio Engineering:</b> Built-in sound effects provide distinct auditory cues for successful matches or mismatches, with options to toggle music off for absolute silence. <br><br></p>
        <p><b>📊 Tracking & Social Features Stat Integration:</b> An interactive counter tracks ongoing Moves and active Stopwatch Timers right on the display.<br><br></p>
        <p><b>🏆Leaderboard Systems:</b> Scores are processed locally or globally to rank high-performing players by the lowest elapsed time or absolute cleanest move efficiency. <br><br></p>
        <p><b>📤Social Sharing Platforms:</b> Direct hooks allow players to share their high scores, challenge friends, or provide immediate development feedback.<br><br></p>
        <p><b>💬Feedback System:</b> it will open feedback window to submit comments/feedback/suggestions/like/dislike/rating/report about the game/app/site etc.<br></p>
        `;
        
let FeqBox = document.getElementById("FeqBox");
FeqBox.style.textAlign = "left";
// all rules are write here with required HTML tegs
FeqBox.innerHTML = `<h3 class='slide-h3'>Is Ravindra Games Hub free?</h3>
        <p class='slide-p'>Yes, every game is free.</p>
        <h3 class='slide-h3'>Can I play offline?</h3>
        <p class='slide-p'>No, Sudoku Solver need internet connection for play.
        <h3 class='slide-h3'>How many themes in website?</h3>
        <p>Two themes are available - Dark(Blue), Light(Orange) in website.</p>
        <h3 class='slide-h3'>Does my partially filled puzzle lost in website?</h3>
        <p class='slide-p'>Your puzzle is lost in website when home, Brower back/refresh button is pressed.</p>
        <h3 class='slide-h3'>When my partially filled puzzle is resume in website?</h3>
        <p class='slide-p'>Your partially filled puzzle is resume in website when leaderboard, feedback, theme, sharing, music and pause is clicked.</p>
        <h3 class='slide-h3'>Can two players play game?</h3>
        <p class='slide-p'>No. it is a solver not a game.</p>
        <h3 class='slide-h3'>Is Sudoku Solver have different difficulty levels and szie?</h3>
        <p class='slide-p'>Yes, Sudoku solve All size of sudoku or any difficulty level.</p>
        <h3 class='slide-h3'>Can see all Solution if moren then one solution?</h3>
        <p class='slide-p'>Yes, you can see all solution if more then one solutions.</p>
        `;

document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "📜View Rules";
}


// showRules();