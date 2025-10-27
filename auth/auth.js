// This file uses Supabase client for OAuth (Google). Use config.js in leaderboard folder.
// let SUPABASE_URL = null, SUPABASE_ANON_KEY = null;
// try { const cfg = await import('../leaderboard/config.js'); SUPABASE_URL = cfg.SUPABASE_URL; SUPABASE_ANON_KEY = cfg.SUPABASE_ANON_KEY; } catch (e) { alert('Supabase config missing. Create ../leaderboard/config.js from ../leaderboard/config.example.js'); }
// if (SUPABASE_URL && SUPABASE_ANON_KEY) {
//     const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
//     const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//     // document.getElementById('googleSign').addEventListener('click', () => {
//     //     supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + 'leaderboard/index.html' } });
//     // });
// }

// // // --- Supabase Initialization (पहले से होना चाहिए) ---
// // import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm';
// // import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../leaderboard/config.js';
// // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// // --- DOM Elements ---
// const googleBtn = document.getElementById('google-login');
// const facebookBtn = document.getElementById('facebook-login');
// const guestBtn = document.getElementById('guest-login');
// const emailForm = document.getElementById('email-login');
// const statusDiv = document.getElementById('auth-status');

// export let userName  
// // --- 1️⃣ Google Login ---
// googleBtn?.addEventListener('click', async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
//   if (error) statusDiv.textContent = error.message;
// });

// // --- 2️⃣ Facebook Login ---
// facebookBtn?.addEventListener('click', async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'facebook' });
//   if (error) statusDiv.textContent = error.message;
// });

// // --- 3️⃣ Email + Name Login ---
// emailForm?.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = document.getElementById('email').value;
//   const name = document.getElementById('name').value || 'Player';
//   const { data, error } = await supabase.auth.signInWithOtp({ email });
//   if (error) {
//     statusDiv.textContent = error.message;
//   } else {
//     localStorage.setItem('username', name);
//     statusDiv.textContent = 'Check your email for the login link!';
//     userName = name;
//   }
// });

// // --- 4️⃣ Guest Login ---
// guestBtn?.addEventListener('click', () => {
//   const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
//   localStorage.setItem('username', guestName);
//   localStorage.setItem('isGuest', 'true');
//   statusDiv.textContent = `Welcome, ${guestName}!`;
//   userName = guestName;
// });

// // --- 5️⃣ On Page Load: Show Current User ---
// supabase.auth.getUser().then(({ data }) => {
//   if (data?.user) {
//     localStorage.setItem('username', data.user.user_metadata.full_name || data.user.email);
//     statusDiv.textContent = `Logged in as ${localStorage.getItem('username')}`;
//     userName = data.user.user_metadata.full_name || data.user.email;
// }
// });



import { supabase } from "../supabaseClient.js";

// Elements
const googleBtn = document.getElementById("google-login");
const facebookBtn = document.getElementById("facebook-login");
const guestForm = document.getElementById("guest-login");
const emailForm = document.getElementById("email-login");
const statusDiv = document.getElementById("auth-status");

// 🔹 Utility: Update Status Message
function showStatus(msg, success = true) {
  statusDiv.textContent = msg;
  statusDiv.style.color = success ? "green" : "red";
}

// 🔹 Redirect after login (to your main page)
function redirectAfterLogin() {
  window.location.href = "../index.html";
}

// 🔹 Save user info to localStorage
function saveUserLocally(user) {
  localStorage.setItem("player_name", user.name || "Guest");
  localStorage.setItem("email", user.email || "");
  localStorage.setItem("user_id", user.id || "");
}

// 🔹 Google Login
googleBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // redirectTo: window.location.origin + "/auth/redirect.html", 
      emailRedirectTo: "https://rnsaraswat.github.io/games/auth/redirect.html"

    },
  });
  if (error) showStatus("Google login failed: " + error.message, false);
});

// 🔹 Facebook Login
facebookBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: window.location.origin + "/auth/redirect.html",
    },
  });
  if (error) showStatus("Facebook login failed: " + error.message, false);
});

// 🔹 Email Login (no password — just lightweight login)
emailForm.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const name = document.getElementById("name").value.trim();

  if (!email) {
    showStatus("Please enter a valid email.", false);
    return;
  }

  if (!name) {
    showStatus("Please enter your name.", false);
    return;
  } 

  try {
    // Supabase Magic Link Login (optional)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { 
        emailRedirectTo: "https://rnsaraswat.github.io/games/auth/redirect.html"
      },
    });

    if (error) throw error;

    saveUserLocally({ name: name || "Guest", email });
    showStatus("Login link sent to your email. Check inbox!", true);
  } catch (err) {
    showStatus("Email login failed: " + err.message, false);
  }
});

// 🔹 Guest Login
guestForm.addEventListener("submit", async e => {
  e.preventDefault();
  const gemail = document.getElementById("gemail").value.trim();
  const gname = document.getElementById("gname").value.trim();

  console.log(gemail, gname);
  if (!gemail) {
    showStatus("Please enter a valid email.", false);
    return;
  }

  if (!gname) {
    showStatus("Please enter your name.", false);
    return;
  } 

    saveUserLocally({ name: gname || "Guest", gemail });

  showStatus(`Welcome, ${gname}! Logging in as Guest...`);
  setTimeout(redirectAfterLogin, 1000);
});

// 🔹 Check current session (if already logged in)
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    saveUserLocally({
      name: session.user.user_metadata.full_name || "User",
      email: session.user.email,
      id: session.user.id,
    });
    showStatus("You are already logged in! Redirecting...");
    setTimeout(redirectAfterLogin, 1000);
  }
})();

