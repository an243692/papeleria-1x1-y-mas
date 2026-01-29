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
                'primary-blue': '#1034a6',      // Deep Corporate Blue (Core Brand Color)
                'primary-red': '#e91e63',        // Rojo del texto 1X1
                'primary-sky': '#03a9f4',        // Azul cielo de la hoja
                'primary-yellow': '#ffc107',     // Amarillo dorado
                'primary-green': '#8bc34a',      // Verde oliva
                'primary-purple': '#9c27b0',     // Morado
                'primary-pink': '#e91e63',       // Rosa/Magenta
                'dark-blue': '#0f172a',
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
                'scroll-slow': 'scroll 25s linear infinite',
                'scroll-slow-delayed': 'scroll-delayed 25s linear infinite',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
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
                'scroll': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                'scroll-delayed': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
