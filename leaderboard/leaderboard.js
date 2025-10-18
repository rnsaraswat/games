import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';


// Try to import config (config.example.js -> user creates config.js)
let SUPABASE_URL = null, SUPABASE_ANON_KEY = null;
try { const cfg = await import('config.js'); SUPABASE_URL = cfg.SUPABASE_URL; SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY; } catch (e) {/* no config */ }


const hasRemote = SUPABASE_URL && SUPABASE_ANON_KEY;
const supabase = hasRemote ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;


const gameFilter = document.getElementById('gameFilter');
export let gameId = gameFilter.value;
console.log(gameId);
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


loadTop(gameId);
gameFilter.addEventListener('change', (event) => {
    gameId = event.target.value;
    // display gameId
    console.log(gameId);
    loadTop(gameId)
} );



// leaderboard.js
SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co";
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ"; // <-- अपने project key से बदलें

// Fetch Top 10 scores
export async function fetchLeaderboard(game_id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/top_scores?game_id=eq.${game_id}&select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await res.json();
  return data.slice(0, 10);
}

// Render Leaderboard in a target <div>
export async function renderLeaderboard(game_id, targetSelector) {
  const container = document.querySelector(targetSelector);
  container.innerHTML = "<p>Loading leaderboard...</p>";

  try {
    const scores = await fetchLeaderboard(game_id);
    if (scores.length === 0) {
      container.innerHTML = "<p>No scores yet — be the first!</p>";
      return;
    }

    const list = scores.map((s, i) => `
      <div class="score-row">
        <span class="rank">#${i + 1}</span>
        <span class="name">${s.player_name}</span>
        <span class="score">${s.score}</span>
      </div>
    `).join("");

    container.innerHTML = `
      <h3>🏆 Top 10 Players</h3>
      <div class="scoreboard">${list}</div>
    `;
  } catch (err) {
    container.innerHTML = "<p>⚠️ Error loading leaderboard.</p>";
    console.error(err);
  }
}