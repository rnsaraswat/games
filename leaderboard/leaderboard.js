// ✅ Import Supabase client (browser ES Module)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔧 Try to load config (config.js optional)
let SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co";
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🕹️ DOM ready
window.addEventListener("DOMContentLoaded", async () => {
  const gameFilter = document.getElementById("gameFilter");
  const listEl = document.getElementById("leaderboardList");

  if (!gameFilter || !listEl) {
    console.error("❌ Missing #gameFilter or #leaderboardList element in HTML.");
    return;
  }

  // Default game
  let gameId = gameFilter.value || "tictactoe";

  // Load initial leaderboard
  await loadTop(gameId);

  // On game selection change
  gameFilter.addEventListener("change", async (event) => {
    gameId = event.target.value;
    await loadTop(gameId);
  });

  // 🧩 Load top scores
  async function loadTop(gameId) {
    listEl.innerHTML = '<div style="color:var(--muted)">⏳ Loading...</div>';
    try {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("game_id", gameId)
        .order("score", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!data || data.length === 0) {
        listEl.innerHTML = '<div style="color:var(--muted)">No scores yet.</div>';
        return;
      }

      renderRows(data);
    } catch (err) {
      listEl.innerHTML = '<div style="color:crimson">⚠️ Error loading scores</div>';
      console.error(err);
    }
  }

  // 🎨 Render leaderboard rows
  function renderRows(rows) {
    listEl.innerHTML = rows
      .map(
        (r, i) => `
        <div class="score-row">
          <div>
            <strong>${i + 1}. ${escapeHtml(r.player_name || "Anonymous")}</strong>
            <div class="muted">${new Date(r.created_at).toLocaleString()}</div>
          </div>
          <div class="score">${r.score}</div>
        </div>`
      )
      .join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }
});
