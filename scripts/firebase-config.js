// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = { 
   apiKey: "AIzaSyAPXdtOIrAHuvwXSlP_oxPgwiCOXMkxMvU",
  authDomain: "style-and-space.firebaseapp.com",
  projectId: "style-and-space",
  storageBucket: "style-and-space.appspot.com",
  messagingSenderId: "741061813433",
  appId: "1:741061813433:web:3318357d975b43e36f2768",
  measurementId: "G-3RCMJ7CX73"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
