import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ";
const TABLE_NAME = "scores";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allScores = [];           
let currentSort = { column: 'score', asc: false };
let searchQuery = '';

// ---------- public exports ----------
export async function renderLeaderboard(game_id = 'tictactoe') {
  const tbody = document.getElementById('leaderboardTableBody');
  const searchInput = document.getElementById('searchInput');

  if (!tbody) {
    console.error('renderLeaderboard: #leaderboardTableBody not found in DOM.');
    return;
  }

  // attach search listener once
  if (searchInput && !searchInput._listenerAttached) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      _renderTable();
    });
    searchInput._listenerAttached = true;
  }

  // fetch data from supabase
  tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">Loading...</td></tr>`;

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('player_name,score,created_at,game_id')
      .eq('game_id', game_id)
      .order('score', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      tbody.innerHTML = `<tr><td colspan="4" style="color:crimson;text-align:center">Error loading leaderboard</td></tr>`;
      return;
    }

    allScores = Array.isArray(data) ? data : [];
    _renderTable();
  } catch (err) {
    console.error('Fetch exception:', err);
    tbody.innerHTML = `<tr><td colspan="4" style="color:crimson;text-align:center">Error loading leaderboard</td></tr>`;
  }
}

export async function saveScore(game_id, score) {
  // saves via Edge Function endpoint (recommended) OR direct insert via supabase
  // Here we'll use Edge Function if exists, else fallback to direct insert.
  const player_name = localStorage.getItem('player_name') || 'Guest';
  const email = localStorage.getItem('email') || '';

  // If you have an Edge Function URL, prefer it (replace below)
  const EDGE_FUNCTION_URL = ""; // e.g. "https://<ref>.supabase.co/functions/v1/submit-score"
  try {
    if (EDGE_FUNCTION_URL) {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_name, email, game_id, score })
      });
      const json = await res.json();
      // after save, refresh
      await renderLeaderboard(game_id);
      return json;
    } else {
      // direct insert (uses anon key, ensure policies allow insert if doing client-side)
      const { data, error } = await supabase.from(TABLE_NAME).insert([{ player_name, email, game_id, score }]);
      if (error) throw error;
      await renderLeaderboard(game_id);
      return data;
    }
  } catch (err) {
    console.error('saveScore error:', err);
    throw err;
  }
}

export function sortTable(column) {
  // allowed columns: 'score', 'player_name', 'created_at'
  if (currentSort.column === column) currentSort.asc = !currentSort.asc;
  else { currentSort.column = column; currentSort.asc = true; }
  _renderTable();
}

// ---------- internal helpers ----------
function _renderTable() {
  const tbody = document.getElementById('leaderboardTableBody');
  if (!tbody) return;

  let list = allScores.slice(); // clone

  // apply search
  if (searchQuery) {
    list = list.filter(r => (r.player_name || '').toLowerCase().includes(searchQuery));
  }

  // sort
  list.sort((a, b) => {
    const col = currentSort.column;
    let av = a[col], bv = b[col];

    // normalize for undefined
    if (av === undefined) av = ''; if (bv === undefined) bv = '';

    // if date column
    if (col === 'created_at') {
      av = new Date(av).getTime();
      bv = new Date(bv).getTime();
    }

    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();

    if (av < bv) return currentSort.asc ? -1 : 1;
    if (av > bv) return currentSort.asc ? 1 : -1;
    return 0;
  });

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted)">No results</td></tr>`;
    return;
  }

  tbody.innerHTML = list.slice(0, 100).map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(r.player_name || 'Guest')}</td>
      <td>${r.score}</td>
      <td>${new Date(r.created_at).toLocaleString()}</td>
    </tr>
  `).join('');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c]));
}
