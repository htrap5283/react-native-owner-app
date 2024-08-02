// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import necessary firebase service
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADdu7KWwiZrlOOAdctisePxpS2HMCgBqA",
  authDomain: "ev-rental-app.firebaseapp.com",
  projectId: "ev-rental-app",
  storageBucket: "ev-rental-app.appspot.com",
  messagingSenderId: "17035324584",
  appId: "1:17035324584:web:c80172879146b79846669d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Instantiate auth object
const auth = getAuth(app)

// Instantiate firestore object
const db = getFirestore(app)

// export the auth and db object to use in app
export{ auth, db }