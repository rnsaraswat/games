let actx;
function ensureAudio() {
    if (!actx) {
        actx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function beep(freq = 600, dur = 0.06, type = 'square', gain = 0.06) {
    ensureAudio();
    const now = actx.currentTime;
    const osc = actx.createOscillator();
    const g = actx.createGain();
    osc.type = type; osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g).connect(actx.destination);
    osc.start(now);
    osc.stop(now + dur);
}

const playFlip = () => beep(520, 0.05, 'square', 0.07);

const playMatch = () => {
    beep(660, 0.06, 'sine', 0.06);
    setTimeout(() => beep(880, 0.06, 'sine', 0.06), 70);
};