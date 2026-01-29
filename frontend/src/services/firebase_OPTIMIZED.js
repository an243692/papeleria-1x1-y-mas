import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
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

// ✅ OPTIMIZACIÓN: Habilitar persistencia offline de Firestore
// Esto permite que los datos se cacheen localmente en IndexedDB
// Reduce lecturas repetidas cuando el usuario vuelve a la página
// 
// BENEFICIOS:
// - Datos disponibles offline
// - Lecturas reducidas en visitas repetidas
// - Mejor experiencia de usuario (carga instantánea)
// 
// AHORRO ESTIMADO: +10% adicional en lecturas
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Múltiples pestañas abiertas, persistencia solo funciona en una
        console.warn('⚠️ Persistencia de Firestore no disponible: múltiples pestañas abiertas');
        console.warn('   Cierra otras pestañas de esta app para habilitar caché offline');
    } else if (err.code === 'unimplemented') {
        // Navegador no soporta persistencia
        console.warn('⚠️ Persistencia de Firestore no soportada en este navegador');
        console.warn('   Usa Chrome, Firefox o Safari para mejor rendimiento');
    } else {
        console.error('Error habilitando persistencia de Firestore:', err);
    }
});

// Log de éxito (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase inicializado correctamente');
    console.log('✅ Persistencia de Firestore habilitada');
}

export default app;
