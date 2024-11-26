// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdN4SuW5iIPVo4eUn9pUGyvY7Wu3WNx3M",
  authDomain: "sabanafoods-1fafc.firebaseapp.com",
  projectId: "sabanafoods-1fafc",
  storageBucket: "sabanafoods-1fafc.firebasestorage.app",
  messagingSenderId: "211788569076",
  appId: "1:211788569076:web:c440997ca0fba4ad7b41a1",
  measurementId: "G-JN2F1624L3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);