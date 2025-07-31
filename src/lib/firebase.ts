import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "zen-jar",
  appId: "1:634724124220:web:ba7756c2eb459c12eda539",
  storageBucket: "zen-jar.firebasestorage.app",
  apiKey: "AIzaSyBweI2Cnh6LeS6XOxAA4enfqak6a8AUFQA",
  authDomain: "zen-jar.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "634724124220"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
