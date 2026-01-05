import { supabase } from "../supabaseClient.js";

// Elements
const googleBtn = document.getElementById("google-login");
const facebookBtn = document.getElementById("facebook-login");
const guestForm = document.getElementById("guest-login");
const guestF = document.getElementById("guest");
const emailForm = document.getElementById("email-login");
const statusDiv = document.getElementById("auth-status");

// 🔹 Utility: Update Status Message
function showStatus(msg, success = true) {
  statusDiv.textContent = msg;
  statusDiv.style.color = success ? "green" : "red";
}

// 🔹 Redirect after login (to your main page)
function redirectAfterLogin() {
  // window.location.href = "../index.html";
  window.location.href = "../index.html";
}

// 🔹 Save user info to localStorage
function saveUserLocally(user) {
  console.log(user);
  localStorage.setItem("player_name", user.name);
  localStorage.setItem("email", user.email);
  localStorage.setItem("id", user.id);
}

// 🔹 Google Login
googleBtn.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // redirectTo: window.location.origin + "/auth/redirect.html", 
      redirectTo: "https://rnsaraswat.github.io/games/auth/redirect.html"

    },
  });
  if (error) showStatus("Google login failed: " + error.message, false);
});

// 🔹 Facebook Login
facebookBtn.addEventListener("click", async () => {
  console.log("Facebook Login")
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      // redirectTo: window.location.origin + "redirect.html"
      redirectTo: "https://rnsaraswat.github.io/games/auth/redirect.html"
    },
  });
  console.log("Facebook Login 1")

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

    saveUserLocally({ name: name || "Guest", email: email, id: `${name}${Math.floor(Math.random() * 10000)}` });
    showStatus("Login link sent to your email. Check inbox!", true);
  } catch (err) {
    showStatus("Email login failed: " + err.message, false);
  }
});

// 🔹 Guest Login with email
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

    saveUserLocally({ name: gname || "Guest", email: gemail, id: `${gname}${Math.floor(Math.random() * 10000)}` });

  showStatus(`Welcome, ${gname}! Logging in as Guest...`);
  setTimeout(redirectAfterLogin, 1000);
});


// --- 4️⃣ Guest Login without email ---
guestF.addEventListener("submit", async e => {
  e.preventDefault();
  const guname = document.getElementById("guname").value.trim();
  const rand = Math.floor(Math.random() * 10000);
  const guestName = `${guname}${rand}` || `Gust${rand}`;
  const guemail = "-";
  // localStorage.setItem('username', guestName);
  // localStorage.setItem('email', '-');
  // localStorage.setItem('id', guestName);
  saveUserLocally({ name: guname || "Guest", email: guemail, id: `${guname}${Math.floor(Math.random() * 10000)}` });
  statusDiv.textContent = `Welcome, ${guestName}!`;
  setTimeout(redirectAfterLogin, 1000);
});



// 🔹 Check current session (if already logged in)
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    saveUserLocally({
      name: session.user.user_metadata.full_name,
      email: session.user.email,
      id: session.user.id,
    });
    // showStatus("You are already logged in! Redirecting...");
    // setTimeout(redirectAfterLogin, 1000);

        // 🔸 Auto redirect हटाया
        document.getElementById("alreadyLoginPopup").style.display = "flex";

  }
})();

