// This file uses Supabase client for OAuth (Google). Use config.js in leaderboard folder.
let SUPABASE_URL = null, SUPABASE_ANON_KEY = null;
try { const cfg = await import('../leaderboard/config.js'); SUPABASE_URL = cfg.SUPABASE_URL; SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY; } catch (e) { alert('Supabase config missing. Create ../leaderboard/config.js from ../leaderboard/config.example.js'); }
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // document.getElementById('googleSign').addEventListener('click', () => {
    //     supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + 'leaderboard/index.html' } });
    // });
}

// // --- Supabase Initialization (पहले से होना चाहिए) ---
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../leaderboard/config.js';
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const googleBtn = document.getElementById('google-login');
const facebookBtn = document.getElementById('facebook-login');
const guestBtn = document.getElementById('guest-login');
const emailForm = document.getElementById('email-login');
const statusDiv = document.getElementById('auth-status');

export let userName  
// --- 1️⃣ Google Login ---
googleBtn?.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) statusDiv.textContent = error.message;
});

// --- 2️⃣ Facebook Login ---
facebookBtn?.addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
  if (error) statusDiv.textContent = error.message;
});

// --- 3️⃣ Email + Name Login ---
emailForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value || 'Player';
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  if (error) {
    statusDiv.textContent = error.message;
  } else {
    localStorage.setItem('username', name);
    statusDiv.textContent = 'Check your email for the login link!';
    userName = name;
  }
});

// --- 4️⃣ Guest Login ---
guestBtn?.addEventListener('click', () => {
  const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
  localStorage.setItem('username', guestName);
  localStorage.setItem('isGuest', 'true');
  statusDiv.textContent = `Welcome, ${guestName}!`;
  userName = guestName;
});

// --- 5️⃣ On Page Load: Show Current User ---
supabase.auth.getUser().then(({ data }) => {
  if (data?.user) {
    localStorage.setItem('username', data.user.user_metadata.full_name || data.user.email);
    statusDiv.textContent = `Logged in as ${localStorage.getItem('username')}`;
    userName = data.user.user_metadata.full_name || data.user.email;
}
});
