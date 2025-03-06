// firebase.tsx
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqem0UlPXnR9KZL1FTZJxSN2rFFjWVr4M",
  authDomain: "ai-edtech-9849c.firebaseapp.com",
  projectId: "ai-edtech-9849c",
  storageBucket: "ai-edtech-9849c.firebasestorage.app",
  messagingSenderId: "43396173380",
  appId: "1:43396173380:web:98daf974f3de238a723611",
  measurementId: "G-VV02S5LT57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };