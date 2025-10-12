const games = [
    { id: 'tictactoe', title: 'Tic Tac Toe', desc: 'Classic X vs O — human or AI', href: 'games/tictactoe/index.html', thumb: 'images/tictactoe-thumb.png' },
    { id: 'mastermind', title: 'Mastermind', desc: 'Guess the color code — AI solver', href: '/games/mastermind/index.html', thumb: '/images/mastermind-thumb.png' },
    { id: 'memory', title: 'Memory Game', desc: 'Find matching pairs', href: '/games/memory/index.html', thumb: '/images/memory-thumb.png' }
];


const grid = document.getElementById('gamesGrid');
if (grid) {
    games.forEach(g => {
        const el = document.createElement('article'); el.className = 'game-card';
        el.innerHTML = `<img class="thumb" src="${g.thumb}" alt="${g.title}"><div class="content"><h3>${g.title}</h3><p>${g.desc}</p><a class="play-btn" href="${g.href}">Play ▶</a></div>`;
        grid.appendChild(el);
    })
}


// Theme toggle
const themeToggle = document.getElementById('themeToggle');
function setTheme(t) {
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark'); else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('rg_theme', t);
    document.getElementById('meta-theme-color').setAttribute('content', t === 'dark' ? '#071a2b' : '#0f172a');
    themeToggle.textContent = t === 'dark' ? 'Light' : 'Dark';
}
if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');


// Leaderboard button opens leaderboard page
const leaderBtn = document.getElementById('leaderBtn');
if (leaderBtn) leaderBtn.addEventListener('click', () => { window.location.href = 'leaderboard/leaderboard.html'; });


// Register improved service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => console.log('SW registered', reg)).catch(err => console.warn('SW failed', err));
}