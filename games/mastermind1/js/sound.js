const sounds = {
    click: new Audio('../../assets/sound/tap-sound.mp3'),
    beep: new Audio('../../assets/sound/Clock-ticking-Turning-one.mp3'),
    submit: new Audio('../../assets/sound/inhalation-and-exhalation.mp3'),
    win: new Audio('../../assets/sound/winner-trumpets.mp3'),
    loose: new Audio('../../assets/sound/Looser.mp3'),
    bg: new Audio('../../assets/sound/bg-music.mp3'),
    fire: new Audio('../../assets/sound/fireworks.mp3')
};

let soundEnabled = false;

document.getElementById("toggle-sound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("toggle-sound").textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";
    if (soundEnabled) sounds.bg.play();
    else sounds.bg.pause();
});

export function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play();
    }
}

  window.addEventListener("load", () => {
    if (soundEnabled) playSound('bg');
  });