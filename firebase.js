// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0PrHe1x2o-11EfER_Wb3VmQkxJR9UAPo",
  authDomain: "janaseva-da6ed.firebaseapp.com",
  projectId: "janaseva-da6ed",
  storageBucket: "janaseva-da6ed.firebasestorage.app",
  messagingSenderId: "312509374190",
  appId: "1:312509374190:web:18037cb9e38e70851f5dff"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);