import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCueBurP2AnWjl1vcxJXeV4Tzr5VVcSsAQ",
  authDomain: "united-coil-384211.firebaseapp.com",
  projectId: "united-coil-384211",
  storageBucket: "united-coil-384211.appspot.com",
  messagingSenderId: "609129937539",
  appId: "1:609129937539:web:70259226e5c21a59abf9b6",
  measurementId: "G-HYDBRNHJQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
