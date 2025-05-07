// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCul6zNhyjVenzpP1v4r_yXppBoaKqvPo",
  authDomain: "serene-minds-c24c0.firebaseapp.com",
  projectId: "serene-minds-c24c0",
  storageBucket: "serene-minds-c24c0.firebasestorage.app",
  messagingSenderId: "377310889998",
  appId: "1:377310889998:web:61881a87964d3dd8ad145f",
  measurementId: "G-3X4GXFN63L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);
