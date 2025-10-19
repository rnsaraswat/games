// export async function loadLeaderboard() {
//     const listEl = document.getElementById("leaderboardList");
//     if (!listEl) return;

//     try {
//         const res = await fetch(
//             "https://bkhoexvgorxzgdujofar.supabase.co/rest/v1/leaderboard?select=*",
//             {
//                 headers: {
//                     apikey:
//                         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU3NzUsImV4cCI6MjA3NjE5MTc3NX0.fwz-N1PE6vF3ZwAXXnSm9FTRhV0EotmU_XjREaZBFzU",
//                     Authorization:
//                         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU3NzUsImV4cCI6MjA3NjE5MTc3NX0.fwz-N1PE6vF3ZwAXXnSm9FTRhV0EotmU_XjREaZBFzU",
//                 },
//             }
//         );

//         const data = await res.json();
//         const sorted = data
//             .filter((r) => r.game_id === "tictactoe")
//             .sort((a, b) => b.score - a.score)
//             .slice(0, 10);

//         listEl.innerHTML = sorted
//             .map(
//                 (r, i) => `
//         <div class="score-row">
//           <div>
//             <strong>${i + 1}. ${r.player_name || "Guest"}</strong>
//             <div class="muted">${new Date(r.created_at).toLocaleString()}</div>
//           </div>
//           <div class="score">${r.score}</div>
//         </div>`
//             )
//             .join("");
//     } catch (err) {
//         listEl.innerHTML = "<p style='color:red'>⚠️ Error loading leaderboard</p>";
//         console.error(err);
//     }
// }

// export async function saveScore(player_name, email, game_id, score) {
//     return window.submitScore(game_id, score);
// }

// ticktack2/leaderboard/leaderboard.js
const SUPABASE_URL = "https://bkhoexvgorxzgdujofar.supabase.co"; // आपके प्रोजेक्ट URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU3NzUsImV4cCI6MjA3NjE5MTc3NX0.fwz-N1PE6vF3ZwAXXnSm9FTRhV0EotmU_XjREaZBFzU"; // अपना anon key डालें

export async function loadLeaderboard() {
    const listEl = document.getElementById("leaderboardList");
    if (!listEl) return;

    listEl.innerHTML = "⏳ Loading...";

    try {
        // REST v1 query: scores table से top 10 for specific game
        const game = "tictactoe"; // अगर dynamic चाहिए तो param बनाएं
        const url = `${SUPABASE_URL}/rest/v1/scores?select=player_name,score,created_at,game_id&game_id=eq.${encodeURIComponent(game)}&order=score.desc&limit=10`;

        const res = await fetch(url, {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                Accept: "application/json"
            }
        });

        if (!res.ok) {
            // parse possible json error
            let errText;
            try { errText = await res.json(); } catch (e) { errText = await res.text(); }
            console.error("Leaderboard fetch error:", res.status, errText);
            listEl.innerHTML = `<div style="color:crimson">⚠️ Unable to load leaderboard (${res.status})</div>`;
            return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Unexpected leaderboard response:", data);
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

