/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Colores basados en el logo de Papelería 1x1 y Más
                'primary-blue': '#3f51b5',      // Azul del círculo
                'primary-red': '#e91e63',        // Rojo del texto 1X1
                'primary-sky': '#03a9f4',        // Azul cielo de la hoja
                'primary-yellow': '#ffc107',     // Amarillo dorado
                'primary-green': '#8bc34a',      // Verde oliva
                'primary-purple': '#9c27b0',     // Morado
                'primary-pink': '#e91e63',       // Rosa/Magenta
                'dark-blue': '#2c3e50',
                'green-whatsapp': '#25D366',
            },
            fontFamily: {
                display: ['Fredoka One', 'cursive'],
                body: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
