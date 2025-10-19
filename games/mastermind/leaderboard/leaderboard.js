const SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co"; // आपके प्रोजेक्ट URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ"; 
const TABLE_NAME = "scores";

export async function renderLeaderboard() {
    const listEl = document.getElementById("leaderboardList");
    if (!listEl) return;

    listEl.innerHTML = "⏳ Loading...";

    try {
        const game = "tictactoe"; 
        const url = `${SUPABASE_URL}/rest/v1/scores?select=*`;

        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            }
        });

        if (!res.ok) {
            let errText;
            try { errText = await res.json(); } catch (e) { errText = await res.text(); }
            console.error("Leaderboard fetch error:", res.status, errText);
            listEl.innerHTML = `<div style="color:crimson">⚠️ Unable to load leaderboard (${res.status})</div>`;
            return;
        }


        const data = await res.json();

        if (!Array.isArray(data)) {
            listEl.innerHTML = `<div style="color:crimson">⚠️ Unexpected response</div>`;
            return;
        }

        if (data.length === 0) {
            listEl.innerHTML = "<div style='color:var(--muted)'>No scores yet.</div>";
            return;
        }

        listEl.innerHTML = data.map((r, i) => `
      <div class="score-row">
        <div>
          <strong>${i + 1}. ${escapeHtml(r.player_name || 'Guest')}</strong>
          <div class="muted">${new Date(r.created_at).toLocaleString()}</div>
        </div>
        <div class="score">${r.score}</div>
      </div>
    `).join("");


    } catch (err) {
        console.error("Fetch failed:", err);
        listEl.innerHTML = `<div style="color:crimson">❌ Error loading leaderboard</div>`;
    }
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[c])); }


export async function saveScore(game_id, score) {
    const player_name = localStorage.getItem("player_name") || "Guest";
    const email = localStorage.getItem("email") || "";
  
    try {
      const res = await fetch("https://bkhoexvgorxzgdujofar.supabase.co/functions/v1/submit-score", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          player_name,
          email,
          game_id,
          score
        })
      });
  
      const data = await res.json();
      console.log("✅ Score saved:", data);
      return data;
    } catch (err) {
      console.error("❌ Error saving score:", err);
      throw err;
    }
  }

  
  