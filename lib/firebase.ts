import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAL_A4qXOmigOXl5GvRdGAE1gnfrnTPvwA",
  authDomain: "finance-c85d6.firebaseapp.com",
  projectId: "finance-c85d6",
  storageBucket: "finance-c85d6.firebasestorage.app",
  messagingSenderId: "866196244335",
  appId: "1:866196244335:web:e4ea5e6d6196981140ca9a",
  measurementId: "G-B0S91GDH2J",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
