// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// ✅ updated Firebase config with correct GA4 Measurement ID
const firebaseConfig = {
  apiKey: "AIzaSyD3GdGlJSAzPkTYqOZkusfP_D8O8xKF1JI",
  authDomain: "diamante-collections.firebaseapp.com",
  projectId: "diamante-collections",
  storageBucket: "diamante-collections.firebasestorage.app",
  messagingSenderId: "46574867247",
  appId: "1:46574867247:web:e75015e1d3a37bb72907da",
  measurementId: "G-D50B1GXX3N" // ✅ updated!
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Only initialize analytics on client side
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
