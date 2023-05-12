import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Importa la función getAuth
import { getAnalytics } from "firebase/analytics";

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
const auth = getAuth(app);  // Inicializa Firebase Auth
const analytics = getAnalytics(app);

export {auth}

// Ahora puedes usar `auth` para manejar la autenticación
