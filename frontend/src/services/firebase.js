import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC2phZiWGmGNqfo5XxlBg53oGxUNK6ttgo",
    authDomain: "papeleria-1x1-y-mas.firebaseapp.com",
    databaseURL: "https://papeleria-1x1-y-mas-default-rtdb.firebaseio.com",
    projectId: "papeleria-1x1-y-mas",
    storageBucket: "papeleria-1x1-y-mas.firebasestorage.app",
    messagingSenderId: "606203364469",
    appId: "1:606203364469:web:96d0c545282cc75251e43c",
    measurementId: "G-C7DCRY1JSB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;
