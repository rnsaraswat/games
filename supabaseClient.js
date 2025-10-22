// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './leaderboard/config.js'; // path adjust करें अगर ज़रूरी हो

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// optional default export
export default supabase;
