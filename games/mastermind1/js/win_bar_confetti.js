const winbar = document.getElementById('winbar');
const wintxt = document.getElementById('winText');
document.getElementById('playAgain').addEventListener('click', () => {
    winbar.classList.remove('show');
    startGame();
});

const colorModeSel = document.getElementById('colorMode');
const singleColorRow = document.getElementById('singleColorRow');
const singleColorInp = document.getElementById('singleColor');
const densityInp = document.getElementById('density');
const directionSel = document.getElementById('direction');

colorModeSel.addEventListener('change', () => {
    singleColorRow.style.display = colorModeSel.value === 'single' ? 'flex' : 'none';
    restartConfetti();
});

singleColorInp.addEventListener('input', restartConfetti);
densityInp.addEventListener('input', restartConfetti);
directionSel.addEventListener('change', restartConfetti);