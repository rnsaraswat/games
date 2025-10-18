export async function loadLeaderboard() {
    const listEl = document.getElementById("leaderboardList");
    if (!listEl) return;

    try {
        const res = await fetch(
            "https://bkhoexvgorxzgdujofar.supabase.co/rest/v1/leaderboard?select=*",
            {
                headers: {
                    apikey:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU3NzUsImV4cCI6MjA3NjE5MTc3NX0.fwz-N1PE6vF3ZwAXXnSm9FTRhV0EotmU_XjREaZBFzU",
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTU3NzUsImV4cCI6MjA3NjE5MTc3NX0.fwz-N1PE6vF3ZwAXXnSm9FTRhV0EotmU_XjREaZBFzU",
                },
            }
        );

        const data = await res.json();
        const sorted = data
            .filter((r) => r.game_id === "tictactoe")
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        listEl.innerHTML = sorted
            .map(
                (r, i) => `
        <div class="score-row">
          <div>
            <strong>${i + 1}. ${r.player_name || "Guest"}</strong>
            <div class="muted">${new Date(r.created_at).toLocaleString()}</div>
          </div>
          <div class="score">${r.score}</div>
        </div>`
            )
            .join("");
    } catch (err) {
        listEl.innerHTML = "<p style='color:red'>⚠️ Error loading leaderboard</p>";
        console.error(err);
    }
}

export async function saveScore(player_name, email, game_id, score) {
    return window.submitScore(game_id, score);
}
