// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCE57XuUcz5g17ePu7vIyLB4TjtjB__voo",
    authDomain: "english-dictionary-6a01f.firebaseapp.com",
    projectId: "english-dictionary-6a01f",
    storageBucket: "english-dictionary-6a01f.firebasestorage.app",
    messagingSenderId: "634922743521",
    appId: "1:634922743521:web:f1ffbea047296cda99e9a0",
    measurementId: "G-JJRH56ZDW5"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
