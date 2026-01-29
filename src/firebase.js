// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1DBfqk1FRC62OywOEDB0iutacJFI_3oY",
  authDomain: "maxsistemas-290e2.firebaseapp.com",
  databaseURL: "https://maxsistemas-290e2-default-rtdb.firebaseio.com",
  projectId: "maxsistemas-290e2",
  storageBucket: "maxsistemas-290e2.firebasestorage.app",
  messagingSenderId: "231674870295",
  appId: "1:231674870295:web:c815517e07d96c4ccdba52",
  measurementId: "G-SCD0QCJVQX"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app); 
