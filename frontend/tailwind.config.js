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
            animation: {
                'pulse-slow': 'pulse-slow 3s infinite',
                'float': 'float 3s ease-in-out infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
            },
            keyframes: {
                'pulse-slow': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'wiggle': {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
            }
        },
    },
    plugins: [],
}
