// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

export { db };