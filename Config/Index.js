// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH9jZV3BQd_ZxDmgAtO76qEqEl1H6gKAo",
  authDomain: "whatsappissat23.firebaseapp.com",
  databaseURL: "https://whatsappissat23-default-rtdb.firebaseio.com",
  projectId: "whatsappissat23",
  storageBucket: "whatsappissat23.appspot.com",
  messagingSenderId: "421094396270",
  appId: "1:421094396270:web:ff9d0d04519f8883f3717f",
  measurementId: "G-817XBR79HT"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;
