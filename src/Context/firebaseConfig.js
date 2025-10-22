// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkm1ZfApaiWmpNmEBdyqkxveP0z2JT0HA",
  authDomain: "airesumeanalyzer-f1e4c.firebaseapp.com",
  projectId: "airesumeanalyzer-f1e4c",
  storageBucket: "airesumeanalyzer-f1e4c.firebasestorage.app",
  messagingSenderId: "1056937037211",
  appId: "1:1056937037211:web:0e5af7631452e7c498a53e",
  measurementId: "G-JPFKRCJXMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
