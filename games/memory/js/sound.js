// these line are added in index.html file
//<button class="buttonsound" id="toggle-sound">🔇 Music:Off"</button>


// these lines are added in style.css
// .buttonsound {
//     padding: 0.5vh 1vw;
//     background: #4CAF50;
//     border: none;
//     color: var(--fg);
//     cursor: pointer;
// }

// .buttonsound:hover {
//     background: #45a049;
//     color: var(--fg);
// }


// these line are added in javascript file
/* ---------- Sound / music ---------- */
//these lines for added in the javascript file
// Sound objects
const sounds = {
    flip: new Audio('assets/sounds/card-flip.wav'),
    match: new Audio('assets/sounds/card-match.wav'),
    mismatch: new Audio('assets/sounds/card-mismatched.wav'),
    win: new Audio('assets/sounds/winner-trumpets.mp3'),
    loose: new Audio('assets/sounds/Looser.mp3'),
    bg: new Audio('assets/sounds/bg-music.mp3'),
    fire: new Audio('assets/sounds/fireworks.mp3')
};

let soundEnabled = false;

document.getElementById("toggle-sound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("toggle-sound").textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
    if (soundEnabled) sounds.bg.play();
    else sounds.bg.pause();
});

//these para to play sound
// Play sound helper
export function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play();
    }
}

// background music during page load and play
window.addEventListener("load", () => {
    if (soundEnabled) playSound('bg');
});

// to add sound use this line in that js file where sound is required
// playSound('loose');
// playSound('win');
// playSound('flip');
// playSound('match');
// playSound('mismatch');
