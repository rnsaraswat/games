// these line are added in index.html file
// <!-- Rules Popup -->
// <div id="rulesPopup">
//     <h3>Game Rules</h3>
//     <button class="buttondisplayrules" id="hide-rules">Hide Rules</button>
//     <ul id="RulesBox"></ul>
// </div>
// <script type="module" src="js/rules.js"></script> 


// these lines are added in style.css 
// or save in file rules.css add link <link rel="stylesheet" href="rules.css"> in index.html header teg
/* Leaderboard/Rules Popup */
// #rulesPopup {
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     padding: 2vw;
//     border-radius: 1vw;
//     display: none;
//     z-index: 10;
//     width: 80%;
//     height: 60%;
//     overflow-y: auto;
//     text-align: center;
//     border: 0.2vw solid var(--cell-border);
//     background: var(--bg);
//     color: var(--fg);
// }

// h3 {
//     display: inline;
//     background: var(--bg);
//     color: var(--fg);
// }

// .buttondisplayrules {
//     padding: 0.5vh 1vw;
//     background: #4CAF50;
//     border: none;
//     color: var(--fg);
//     cursor: pointer;
// }

// .buttondisplayrules:hover {
//     background: #45a049;
//     color: var(--fg);
// }

// these line are added in javascript file
import { textToSpeechEng } from './speak.js';

/* ---------- Rules Toggle  ---------- */
document.getElementById("toggle-rules").addEventListener("click", () => {
    if (document.getElementById("toggle-rules").textContent === "View Rules") {
        document.getElementById("toggle-rules").textContent = "Hide Rules";
        textToSpeechEng('Open Rules');
        showRules();
    } else {
        document.getElementById("toggle-rules").textContent = "View Rules"
        textToSpeechEng('Close Rules');
        document.getElementById("rulesPopup").style.display = "none";
    }
});

document.getElementById("hide-rules").addEventListener("click", () => {
        document.getElementById("toggle-rules").textContent = "View Rules"
        textToSpeechEng('Close Rules');
        document.getElementById("rulesPopup").style.display = "none";
});

/* ---------- Rules Display javaScript ---------- */
function showRules() {
    let rule = document.getElementById("RulesBox");
    rule.style.textAlign = "left";
    // all rules are write here with required HTML tegs
    rule.innerHTML = `Players click on tile/card it take turns, flipping over two cards/tile at a time, trying to find matching pairs. <br>If the cards match, the player keeps them and gets another turn. <br>If they don't match, the cards are flipped back face down, and player click next tiles. <br>The game continues until all pairs are matched, and the player wins when all pair matched.<br>
            <b>1. Setup:</B><br>
            All the cards or tiles face down in a grid or random arrangement. <br>
            For a standard deck of 8 to 150 cards, depending on the desired difficulty like easy/medium /hard.<br>
            You can also play with other types of cards, like those with pictures or designs like furtes/anumals... etc., as long as there are matching pairs. <br>
            For younger children/kids, easy level have only 16 cards of 8 picturs. <br>
            <b>2. Gameplay:</b><br>
            Players take turns flipping over two cards at a time.<br>
            If the cards match, the player keeps the pair and gets another turn.<br>
            If the cards don't match, they are flipped back face down, and player player take turns for next two cards.<br>
            It's crucial to pay attention to the cards that are flipped over, even if they don't match, to help remember their locations for future turns.<br>
            <b>3. Winning the Game:</b><br>
            The game continues until all the pairs have been matched and collected.
            The player take lesser moves/time to matched most pairs at the end of the game wins. <br>
            <b>4. Memory Master:</b> <br>Players memorize their cards, in next turn try to match them.`;
    document.getElementById("rulesPopup").style.display = "block";
}

export function hideRules() {
    textToSpeechEng('Close Rules');
    document.getElementById("rulesPopup").style.display = "none";
    document.getElementById("toggle-rules").textContent = "View Rules";
}