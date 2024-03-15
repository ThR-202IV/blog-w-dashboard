// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  /* 'cause we're using Vite instead of create react app, it is import.meta which would otherwise be process.env if it were the latter */
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "blog-w-dashboard.firebaseapp.com",
  projectId: "blog-w-dashboard",
  storageBucket: "blog-w-dashboard.appspot.com",
  messagingSenderId: "57334622233",
  appId: "1:57334622233:web:3b909a859901ad3b182288",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
