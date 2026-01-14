// Para ejecutar: node frontend/seed.js
// Requiere: npm install firebase (en la raiz o frontend)
// NOTA: Usa imports de ES6, asegurate de tener "type": "module" en package.json o usar extensión .mjs
// Para simplificar este script, usaremos la version compat/CommonJS si lo ejecutamos con node plano
// PERO el usuario pidió ES6 para el frontend. 
// Vamos a hacer este script standalone compatible con Node.

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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

// Hack para que funcione con require en node sin type:module, 
// o si el usuario no tiene configurado babel.
// Si esto falla, el usuario deberá ajustar el entorno.

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
    // 20 de Papelería
    { name: "Cuaderno Profesional Rayas", price: 45, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61S+p+yXw+L._AC_SL1200_.jpg" },
    { name: "Lápices de Colores 24pz", price: 120, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/71Oa-7oW+IL._AC_SL1500_.jpg" },
    { name: "Pluma Gel Negra", price: 12, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61gIsQeXWGL._AC_SL1500_.jpg" },
    { name: "Marcatextos Pastel", price: 85, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/71wLpQhQhJL._AC_SL1500_.jpg" },
    { name: "Juego de Geometría", price: 60, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/71t-K+b+1HL._AC_SL1500_.jpg" },
    { name: "Pegamento en Barra", price: 15, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61jW1xJq4lL._AC_SL1500_.jpg" },
    { name: "Tijeras Escolares", price: 25, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61qS+O+x+lL._AC_SL1500_.jpg" },
    { name: "Corrector en Cinta", price: 30, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61T+O+x+lL._AC_SL1500_.jpg" },
    { name: "Libreta de Notas", price: 55, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/71e+O+x+lL._AC_SL1500_.jpg" },
    { name: "Lapicera Organizadora", price: 150, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/81+O+x+lL._AC_SL1500_.jpg" },
    { name: "Notas Adhesivas", price: 20, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61u+O+x+lL._AC_SL1500_.jpg" },
    { name: "Grapadora Mini", price: 40, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61v+O+x+lL._AC_SL1500_.jpg" },
    { name: "Clips de Colores", price: 15, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61w+O+x+lL._AC_SL1500_.jpg" },
    { name: "Carpeta Argollas", price: 80, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61x+O+x+lL._AC_SL1500_.jpg" },
    { name: "Separadores de Materias", price: 35, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61y+O+x+lL._AC_SL1500_.jpg" },
    { name: "Plumones Lavables", price: 90, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61z+O+x+lL._AC_SL1500_.jpg" },
    { name: "Sacapuntas con Depósito", price: 18, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61A+O+x+lL._AC_SL1500_.jpg" },
    { name: "Goma de Borrar Miga", price: 10, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61B+O+x+lL._AC_SL1500_.jpg" },
    { name: "Calculadora Científica", price: 250, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61C+O+x+lL._AC_SL1500_.jpg" },
    { name: "Cinta Adhesiva Transparente", price: 12, category: "Papelería", imageUrl: "https://m.media-amazon.com/images/I/61D+O+x+lL._AC_SL1500_.jpg" },

    // 20 de Listones
    { name: "Listón Satinado Rojo 10m", price: 25, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61E+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Organdí Azul", price: 30, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61F+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Metálico Dorado", price: 40, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61G+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Estampado Lunares", price: 35, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61H+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Grosgrain Rosa", price: 28, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61I+O+x+lL._AC_SL1500_.jpg" },
    { name: "Rollo Listón Varios Colores", price: 150, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61J+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Falla 22mm", price: 22, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61K+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón de Yute Natural", price: 45, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61L+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Encaje Blanco", price: 50, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61M+O+x+lL._AC_SL1500_.jpg" },
    { name: "Moño Mágico Paq 10", price: 30, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61N+O+x+lL._AC_SL1500_.jpg" },
    { name: "Curling Ribbon Plata", price: 20, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61O+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Navideño", price: 60, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61P+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Tricolor Patrio", price: 35, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61Q+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Organza Tornasol", price: 45, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61R+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Terciopelo Negro", price: 55, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61S+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Raso Ancho", price: 40, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61T+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Decorativo Bebé", price: 30, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61U+O+x+lL._AC_SL1500_.jpg" },
    { name: "Listón Celoseda", price: 15, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61V+O+x+lL._AC_SL1500_.jpg" },
    { name: "Flor de Listón Paq", price: 40, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61W+O+x+lL._AC_SL1500_.jpg" },
    { name: "Caja Listones Surtidos", price: 200, category: "Listones", imageUrl: "https://m.media-amazon.com/images/I/61X+O+x+lL._AC_SL1500_.jpg" }
];

async function seed() {
    console.log("Iniciando seed de productos...");
    const productsRef = collection(db, "products");

    for (const p of products) {
        try {
            await addDoc(productsRef, {
                ...p,
                createdAt: new Date().toISOString()
            });
            console.log(`Agregado: ${p.name}`);
        } catch (e) {
            console.error(`Error agregando ${p.name}:`, e);
        }
    }
    console.log("Seed completado.");
    process.exit(0);
}

seed();
