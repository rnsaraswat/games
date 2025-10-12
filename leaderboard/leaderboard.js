import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
// load initial
loadTop(gameFilter.value);


gameFilter.addEventListener('change', ()=> loadTop(gameFilter.value));


// submit test score
submitBtn.addEventListener('click', async ()=>{
const name = (playerNameEl.value || 'anon').slice(0,64);
const score = Number(playerScoreEl.value) || 0;
const gameId = gameFilter.value;
submitBtn.disabled = true;
const payload = { game_id: gameId, player_name: name, score };
const { data, error } = await supabase.from('scores').insert(payload).select();
submitBtn.disabled = false;
if(error){ alert('Failed to submit score. Check console.'); console.error(error); return; }
playerNameEl.value=''; playerScoreEl.value='';
loadTop(gameId);
});


// Auth helpers
signBtn.addEventListener('click', async ()=>{
const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
if(error) console.error(error);
});


signOutBtn.addEventListener('click', async ()=>{
await supabase.auth.signOut();
currentUser = null; updateAuthUi();
});


// Listen to auth state
supabase.auth.onAuthStateChange((event, session)=>{
currentUser = session?.user ?? null;
updateAuthUi();
});


function updateAuthUi(){
if(currentUser){ signBtn.style.display='none'; signOutBtn.style.display='inline-block'; }
else{ signBtn.style.display='inline-block'; signOutBtn.style.display='none'; }
}


// Anonymous fallback: allow submitting as guest without auth
// (Already supported by using anon key — but you can record player_id if signed in)