import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKwPIKGqnLp5QgksPPI8-bXo1KFmg6swg",
  authDomain: "poll-management-system-347a4.firebaseapp.com",
  projectId: "poll-management-system-347a4",
  storageBucket: "poll-management-system-347a4.firebasestorage.app",
  messagingSenderId: "234835203765",
  appId: "1:234835203765:web:2e120e842e82abfa0210fc",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
