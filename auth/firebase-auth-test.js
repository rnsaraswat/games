// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEEOj5ZaEs8LZ9HCEVPhapDFy0bw-N3D4",
  authDomain: "ravindra-games-hub-68e5f.firebaseapp.com",
  projectId: "ravindra-games-hub-68e5f",
  storageBucket: "ravindra-games-hub-68e5f.firebasestorage.app",
  messagingSenderId: "233066688435",
  appId: "1:233066688435:web:307f0bc7508df35579e5c6",
  measurementId: "G-B24P20E3K8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//Save user to localStorage
function saveUser(user, email) {
  const userData = {
    name: user,
    email: email,
  };
  localStorage.setItem("user", JSON.stringify(userData));
  // localStorage.setItem("user", JSON.stringify({ name, email }));
}

//Redirect to main
function goMain() {
  window.location.href = "https://rnsaraswat.github.io/games/index.html";
}

// 🔹 Google Login
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  saveUser(result.user.displayName, result.user.email);
  showMsg(`login with ${result.user.displayName}, ${result.user.email}`, true);
  goMain();
}

// 🔹 Logout
export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem("user");
  location.reload();
}



// 🔹 Auto login check
export function checkLoginStatus(callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      saveUser(user);
      callback(true, user);
    } else {
      callback(false, null);
    }
  });
}

checkLoginStatus((isLoggedIn, user) => {

  if (isLoggedIn) {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    authArea.innerHTML = `
      <h3>You are already logged in</h3>
      <p>Welcome: ${savedUser.name} (${savedUser.email})</p>
      <button id="continueBtn">Continue</button>
      <button id="changeBtn">Change Login</button>
    `;

    document.getElementById("continueBtn").onclick = () => {
      window.location.href = "game.html";
    };

    document.getElementById("changeBtn").onclick = logoutUser;

  } else {
    authArea.innerHTML = `
      <button id="loginBtn">Login with Google</button>
    `;

    document.getElementById("loginBtn").onclick = loginWithGoogle;
  }

});