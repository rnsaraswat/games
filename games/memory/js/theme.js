// these line are added in index.html file
// <button class="buttonleadderboard" id="dark">☀️ Light</button>
// <script type="module" src="js/theme.js"></script>

// these lines are added in style.css
// or save in file theme.css add link <link rel="stylesheet" href="theme.css"> in index.html header teg
// theme varable 
// :root {
//     --bg: #f0f0f0;
//     --fg: #222;
//     --box-shadow: rgba(0, 0, 0, 0.2);
//     --shadow: 0 0.6vw 2vw rgba(0,0,0,.08);
// }

// body.dark {
//     --bg: #454545;
//     --fg: #eee;
//     --cell-border: #d9d8d8;
//     --box-shadow: rgba(255, 255, 255, 0.3);
//     --shadow: 0 0.6vw 2vw rgba(0,0,0,.35);
// }

// buttondisplaytheme {
//     background: var(--bg);
//     color: var(--fg);
//     border: 0.1vw solid var(--cell-border);
//     border-radius: 10px;
//     padding: 0.7vh 1vw;
//     font-size: 1.2vw;
//     cursor: pointer;
// }

// these line are added in javascript file
import { textToSpeechEng } from './speak.js';

//toggle theme
document.getElementById("dark").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        document.getElementById("dark").innerText = "☀️ Light";
        textToSpeechEng('Theme Dark');
    } else {
        document.getElementById("dark").innerText = "🌙 Dark";
        textToSpeechEng('Theme Light');
    }
});