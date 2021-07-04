// Web app's Firebase configuration

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIo6aVq0hSBbuTgNEYWbtSL1MOa1g7264",
  authDomain: "ecommerce-283c9.firebaseapp.com",
  projectId: "ecommerce-283c9",
  storageBucket: "ecommerce-283c9.appspot.com",
  messagingSenderId: "874884446661",
  appId: "1:874884446661:web:c695d4bc1db5718de3f3ac",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();