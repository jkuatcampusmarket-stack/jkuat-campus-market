// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCzf5OZw20eKVJRpd9iH4sAR6auRyKn_i0",
  authDomain: "jkuat-campus-market.firebaseapp.com",
  projectId: "jkuat-campus-market",
  storageBucket: "jkuat-campus-market.firebasestorage.app",
  messagingSenderId: "409979553093",
  appId: "1:409979553093:web:456c2ec1d2191e9b626a2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
