// Ravindra Games Hub shared sound module for Chess.
const sounds = {
  click: new Audio("../../assets/sound/tap-sound.mp3"),
  error: new Audio("../../assets/sound/error-sound.mp3"),
  win: new Audio("../../assets/sound/winner-trumpets.mp3"),
  draw: new Audio("../../assets/sound/game-over-classic.mp3"),
  bg: new Audio("../../assets/sound/bg-music.mp3"),
  fire: new Audio("../../assets/sound/fireworks.mp3")
};
sounds.bg.loop = true;
sounds.bg.volume = 0.35;
let soundEnabled = localStorage.getItem("rghChessSound") === "on";
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  localStorage.setItem("rghChessSound", soundEnabled ? "on" : "off");
  if (soundEnabled) {
    const result = sounds.bg.play();
    if (result && typeof result.catch === "function") result.catch(() => {});
  } else { sounds.bg.pause(); sounds.bg.currentTime = 0; }
  return soundEnabled;
}
export function isSoundEnabled() { return soundEnabled; }
export function playSound(type = "click") {
  if (!soundEnabled || !sounds[type]) return;
  const audio = sounds[type]; audio.currentTime = 0;
  const result = audio.play();
  if (result && typeof result.catch === "function") result.catch(() => {});
}
export function playTap() { playSound("click"); }
