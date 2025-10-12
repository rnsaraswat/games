// submit-helper.js
async function tryImportConfig() {
    try {
        return await import('./config.js');
    } catch (err) {
        return null;
    }
}


window.submitScore = async function (gameId, numericScore, playerName = 'anon') {
    const cfg = await tryImportConfig();
    if (cfg && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
        // use supabase client via CDN
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
        try {
            await supabase.from('scores').insert({ game_id: gameId, player_name: playerName, score: numericScore });
            console.log('Score submitted to Supabase');
            return { ok: true, remote: true };
        } catch (e) {
            console.warn('Supabase submit failed, saving locally', e);
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