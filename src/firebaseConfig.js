// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1GJUX2trwgUfYNkcxqfuxhW18I0_2fcY",
  authDomain: "wake-31799.firebaseapp.com",
  projectId: "wake-31799",
  storageBucket: "wake-31799.firebasestorage.app",
  messagingSenderId: "1081212884630",
  appId: "1:1081212884630:web:940706aa9c6de6826554b7",
  measurementId: "G-RQP9VVBHR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export db so it can be used in App.js
export { db };