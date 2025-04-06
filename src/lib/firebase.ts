// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: <"api key">,
  authDomain: "campus-connect-bcaaa.firebaseapp.com",
  projectId: "campus-connect-bcaaa",
  storageBucket: "campus-connect-bcaaa.firebasestorage.app",
  messagingSenderId: "788684280068",
  appId: "1:788684280068:web:9666d2a79fc6d746d3c051",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
