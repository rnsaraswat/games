// This file uses Supabase client for OAuth (Google). Use config.js in leaderboard folder.
let SUPABASE_URL = null, SUPABASE_ANON_KEY = null;
try { const cfg = await import('../leaderboard/config.js'); SUPABASE_URL = cfg.SUPABASE_URL; SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY; } catch (e) { alert('Supabase config missing. Create /leaderboard/config.js from config.example.js'); }
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    document.getElementById('googleSign').addEventListener('click', () => {
        supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + '/leaderboard/index.html' } });
    });
}