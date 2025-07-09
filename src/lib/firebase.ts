// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getAnalytics, isSupported } from "firebase/analytics"; // ✅ to get GA4 data flow from firebase

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3GdGlJSAzPkTYqOZkusfP_D8O8xKF1JI",
  authDomain: "diamante-collections.firebaseapp.com",
  projectId: "diamante-collections",
  storageBucket: "diamante-collections.firebasestorage.app",
  messagingSenderId: "46574867247",
  appId: "1:46574867247:web:e75015e1d3a37bb72907da",
  measurementId: "G-YSLHE69C8C"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

// for GA4 linking
// ✅ Initialize analytics only on the client side
let analytics;

//🧠 Why typeof window !== "undefined"?
//Because Firebase Analytics only runs in the browser, and you're using Next.js (where code can also run server-side).
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;


