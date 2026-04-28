// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtmTj53Rvp5w2JOsi7sGbXtoM55BYM4PM",
  authDomain: "plants-fdacc.firebaseapp.com",
  projectId: "plants-fdacc",
  storageBucket: "plants-fdacc.firebasestorage.app",
  messagingSenderId: "839406031961",
  appId: "1:839406031961:web:002bd9579f248c7cda0d48",
  measurementId: "G-H3FRPG0J6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export { app, db, auth, functions, storage, firebaseConfig }; 