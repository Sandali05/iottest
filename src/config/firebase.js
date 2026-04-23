import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAFSgFeYvjZz3Un0_8iaTM7BgAF7wymwk",
  authDomain: "fire-monitoring-system-e0752.firebaseapp.com",
  databaseURL:
    "https://fire-monitoring-system-e0752-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fire-monitoring-system-e0752",
  storageBucket: "fire-monitoring-system-e0752.appspot.com",
  messagingSenderId: "212281652347",
  appId: "1:212281652347:web:944cd1774802f7eb155ede",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getDatabase(app);
