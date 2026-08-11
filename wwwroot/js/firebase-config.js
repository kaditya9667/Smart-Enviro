// Firebase JS SDK Configuration & Realtime Database Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get, 
  set 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Official Firebase Web App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNLiScmC5dng2eMWHRBb3cyuCeQkx8BAM",
  authDomain: "smart-enviro.firebaseapp.com",
  databaseURL: "https://smart-enviro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-enviro",
  storageBucket: "smart-enviro.firebasestorage.app",
  messagingSenderId: "614190922691",
  appId: "1:614190922691:web:0c98f0f28a4dff3dc25b76",
  measurementId: "G-T1X7GFPREK"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const rtdb = getDatabase(app, firebaseConfig.databaseURL);

// Expose globally for app access
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseAuth = auth;
window.firebaseRtdb = rtdb;

// Auth & Realtime Database Methods Export
window.firebaseServices = {
  signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signUpWithEmail: async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name && cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
    return cred;
  },
  logoutUser: () => signOut(auth),
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
  
  // Realtime Database Operations
  fetchUserData: async (uid) => {
    try {
      const userRef = ref(rtdb, 'users/' + uid);
      const snap = await get(userRef);
      if (snap.exists()) {
        console.log("[Firebase RTDB] Fetched user profile & progress from users/" + uid);
        return snap.val();
      }
    } catch (e) {
      console.error("[Firebase RTDB Fetch Error]:", e.message, e);
    }
    return null;
  },
  
  saveUserData: async (uid, data) => {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      const userRef = ref(rtdb, 'users/' + uid);
      await set(userRef, payload);
      console.log("[Firebase RTDB] Saved user profile & progress to users/" + uid, payload);
    } catch (e) {
      console.error("[Firebase RTDB Save Error]:", e.code, e.message, e);
    }
  }
};

console.log("[SmartEnviro] Firebase initialized with official config & Realtime Database.");
