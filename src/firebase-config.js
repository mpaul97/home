// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7oQp8jgs8-aStaoHYA4g3XXL8nN2MriU",
  authDomain: "minute-mock.firebaseapp.com",
  projectId: "minute-mock",
  storageBucket: "minute-mock.appspot.com",
  messagingSenderId: "317527946877",
  appId: "1:317527946877:web:7885091fd50e04d025e314",
  measurementId: "G-85GSWE6QH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);