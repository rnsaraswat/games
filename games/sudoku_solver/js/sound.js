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
//Sounds
    const sounds = {
        tap: new Audio('assets/sound/tap-sound.mp3'),
        key: new Audio('assets/sound/single-key-press.mp3'),
        win: new Audio('assets/sound/winner-trumpets.mp3'),
        loose: new Audio('assets/sound/Looser.mp3'),
        bg: new Audio('assets/sound/bg-music.mp3'),
        fire: new Audio('assets/sound/fireworks.mp3')
    };

    let soundEnabled = false;

    document.getElementById("toggle-sound").addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        document.getElementById("toggle-sound").textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
        if (soundEnabled) sounds.bg.play();
        else sounds.bg.pause();
    });

    // Play sound helper
    // export function playSound(type) {
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
