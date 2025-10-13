import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


// Try to import config (config.example.js -> user creates config.js)
let SUPABASE_URL = null, SUPABASE_ANON_KEY = null;
try { const cfg = await import('./config.js'); SUPABASE_URL = cfg.SUPABASE_URL; SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY; } catch (e) {/* no config */ }


const hasRemote = SUPABASE_URL && SUPABASE_ANON_KEY;
const supabase = hasRemote ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;


const gameFilter = document.getElementById('gameFilter');
const listEl = document.getElementById('leaderboardList');


async function loadTop(gameId) {
    listEl.innerHTML = '<div style="color:var(--muted)">Loading...</div>';
    if (hasRemote) {
        const { data, error } = await supabase.from('scores').select('*').eq('game_id', gameId).order('score', { ascending: false }).limit(10);
        if (error) { listEl.innerHTML = '<div style="color:crimson">Error loading scores</div>'; console.error(error); return; }
        if (!data || data.length === 0) { listEl.innerHTML = '<div style="color:var(--muted)">No scores yet.</div>'; return; }
        renderRows(data);
    } else {
        const key = `rg_scores_${gameId}`;
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        if (arr.length === 0) { listEl.innerHTML = '<div style="color:var(--muted)">No local scores yet.</div>'; return; }
        renderRows(arr.slice(0, 10));
    }
}


function renderRows(rows) {
    listEl.innerHTML = rows.map((r, i) => `<div class="score-row"><div><strong>${i + 1}. ${escapeHtml(r.player_name || r.name || 'anon')}</strong><div class="muted">${new Date(r.created_at || r.ts || Date.now()).toLocaleString()}</div></div><div class="score">${r.score}</div></div>`).join('');
}


function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]); }


loadTop(gameFilter.value);
gameFilter.addEventListener('change', () => loadTop(gameFilter.value));