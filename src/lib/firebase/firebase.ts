// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD52p7Fb6hNwHtwh-WnwIpa_Suww6b-3o0",
  authDomain: "tokyo-silicon-454713-m8.firebaseapp.com",
  projectId: "tokyo-silicon-454713-m8",
  storageBucket: "tokyo-silicon-454713-m8.firebasestorage.app",
  messagingSenderId: "1062434758719",
  appId: "1:1062434758719:web:52afacacf6d38655d1188a",
  measurementId: "G-MJ48V3L9FQ"
};

// Initialize Firebase - with SSR safety checks
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;

// Check if we're running in the browser
if (typeof window !== 'undefined') {
  // Initialize Firebase only once
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize analytics only in the browser
    if (process.env.NODE_ENV !== 'development') {
      // Import analytcs dynamically to avoid SSR issues
      import('firebase/analytics').then((module) => {
        if (app) {
          analytics = module.getAnalytics(app);
        }
      });
    }
  }
}

export { app, auth, db, analytics }; 