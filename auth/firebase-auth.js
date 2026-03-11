import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCEEOj5ZaEs8LZ9HCEVPhapDFy0bw-N3D4",
    authDomain: "ravindra-games-hub-68e5f.firebaseapp.com",
    projectId: "ravindra-games-hub-68e5f",
    appId: "1:233066688435:web:307f0bc7508df35579e5c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔹 Save user to localStorage
function saveUser(name, email) {
  localStorage.setItem("user", JSON.stringify({ name, email }));
}

// 🔹 Redirect main
function redirectMain() {
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 2000);
}

// 🔹 Show message
function showMsg(msg, ok = true) {
  const el = document.getElementById("msg");
  if (el) {
    el.innerHTML = msg;
    el.style.color = ok ? "green" : "red";
  }
}

// 🔹 Google
export async function loginGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  success(result.user.displayName, result.user.email);
}

// 🔹 Facebook
export async function loginFacebook() {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  success(result.user.displayName, result.user.email);
}

// 🔹 Twitter
export async function loginTwitter() {
  const provider = new TwitterAuthProvider();
  const result = await signInWithPopup(auth, provider);
  success(result.user.displayName, result.user.email);
}

// 🔹 Email Magic Link
export async function sendMagicLink(email) {
  if (!validateEmail(email)) {
    showMsg("Invalid email", false);
    return;
  }

  await sendSignInLinkToEmail(auth, email, {
    url: window.location.origin + "https://rnsaraswat.github.io/games/login.html",
    handleCodeInApp: true
  });

  localStorage.setItem("emailForSignIn", email);
  showMsg("Magic link sent to email");
}

// 🔹 Handle email return
export async function checkEmailLink() {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = localStorage.getItem("emailForSignIn");
    await signInWithEmailLink(auth, email, window.location.href);
    success(email.split("@")[0], email);
  }
}

// 🔹 Name + Email
export function loginNameEmail(name, email) {
  if (!name || !validateEmail(email)) {
    showMsg("Invalid name or email", false);
    return;
  }
  success(name, email);
}

// 🔹 Guest
export function loginGuest(name) {
  if (!name) {
    const now = new Date();
    const auto =
      "guest" +
      String(now.getDate()).padStart(2,"0") +
      String(now.getMonth()+1).padStart(2,"0") +
      String(now.getFullYear()).slice(-2) +
      "_" +
      String(now.getHours()).padStart(2,"0") +
      String(now.getMinutes()).padStart(2,"0");
    name = auto;
  }
  success(name, "");
}

// 🔹 Success handler
function success(name, email) {
  saveUser(name, email);
  showMsg(`Login success!<br>Logged in as: ${name} (${email || "No Email"})`);
  redirectMain();
}

// 🔹 Auto detect
// export function detectLogin(callback) {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       saveUser(user.displayName, user.email);
//       callback(true);
//     } else {
//       const localUser = localStorage.getItem("user");
//       callback(!!localUser);
//     }
//   });
// }

export function detectLogin(callback) {
    const auth = getAuth();
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
  
      unsubscribe(); // important: prevent multiple triggers
  
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          name: user.displayName || "Guest",
          email: user.email || ""
        }));
        callback(true);
      } else {
        const localUser = localStorage.getItem("user");
        callback(!!localUser);
      }
  
    });
  }

// 🔹 Logout
export async function logoutUser() {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "firebase-login.html";
}

// 🔹 Email validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}