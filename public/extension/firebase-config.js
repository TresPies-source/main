
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  messagingSenderId: "634724124220"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, collection, query, where, getDocs };
