// Attempts to post score to Supabase if /leaderboard/config.js exists.
// Falls back to localStorage if config missing or network error.
async function tryImportConfig() {
    try { return await import('config.js'); } catch (e) { return null; }
}


window.submitScore = async function (gameId, numericScore, playerName = 'anon') {
    console.log("submit-helper.js window.submitScore", gameId, numericScore, playerName)
    const cfg = await tryImportConfig();
    if (cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
        try {
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
            const supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
            const { error } = await supabase.from('scores').insert({ game_id: gameId, player_name: playerName, score: numericScore });
            if (error) throw error;
            console.log('Score submitted to Supabase');
            return { ok: true, remote: true };
        } catch (err) {
            console.warn('Supabase submit failed, saving locally', err.message || err);
        }
    }
    // fallback local save
    const key = `rg_scores_${gameId}`;
    const arr = JSON.parse(localStorage.getItem(key) || '[]');
    arr.push({ name: playerName, score: numericScore, ts: Date.now() });
    arr.sort((a, b) => b.score - a.score);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 200)));
    console.log('Score saved locally');
    return { ok: true, remote: false };
}



// Client-side helper: calls the Edge Function instead of direct DB insert


export async function submitSecureScore(player_name, email, game_id, score) {
    try {
    const res = await fetch("https://YOUR_PROJECT.functions.supabase.co/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player_name, email, game_id, score }),
    });
    
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unknown error");
    console.log("✅ Score submitted securely:", data);
    return data;
    } catch (err) {
    console.error("❌ Error submitting score:", err);
    alert("Error submitting score. Please try again.");
    }
    }
    
    
    // Usage example in your game code:
    // window.submitScore = (gameId, score) => submitSecureScore('Player', '', gameId, score);