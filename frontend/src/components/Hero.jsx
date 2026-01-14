import React from 'react';

const Hero = () => {
    // Productos para el carrusel
    const products = [
        { id: 1, image: '/product1.png', name: 'Foamy Colores' },
        { id: 2, image: '/product2.png', name: 'Papel Pingüino' },
        { id: 3, image: '/product3.png', name: 'Cartulinas' },
        { id: 4, image: '/product4.png', name: 'Cinta Adhesiva' },
        { id: 5, image: '/product5.png', name: 'Cuaderno Scribe' },
        { id: 6, image: '/product6.png', name: 'Pistola de Silicón' },
        { id: 7, image: '/product7.png', name: 'Bolígrafos' },
        { id: 8, image: '/product8.png', name: 'Plumas de Colores' },
        { id: 9, image: '/product9.jpg', name: 'Lápices de Colores' },
        { id: 10, image: '/product10.png', name: 'Engrapadora' }
    ];

    // Símbolos matemáticos flotantes
    const mathSymbols = [
        { symbol: '+', top: '15%', left: '10%', delay: '0s', duration: '6s' },
        { symbol: '−', top: '25%', right: '15%', delay: '1s', duration: '7s' },
        { symbol: '×', top: '60%', left: '8%', delay: '2s', duration: '8s' },
        { symbol: '÷', top: '70%', right: '12%', delay: '0.5s', duration: '6.5s' },
        { symbol: '+', top: '40%', right: '20%', delay: '1.5s', duration: '7.5s' },
        { symbol: '×', top: '80%', left: '18%', delay: '2.5s', duration: '6s' },
        { symbol: '÷', top: '20%', left: '25%', delay: '3s', duration: '8s' },
        { symbol: '−', top: '50%', right: '8%', delay: '0.8s', duration: '7s' },
    ];

    // Duplicar productos para scroll infinito
    const duplicatedProducts = [...products, ...products, ...products];

    return (
        <section
            className="relative w-full py-8 md:py-12 px-6 flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1a237e 0%, #283593 25%, #3949ab 50%, #3f51b5 75%, #5c6bc0 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient 8s ease-in-out infinite'
            }}
        >
            {/* Floating Math Symbols */}
            {mathSymbols.map((item, index) => (
                <div
                    key={index}
                    className="absolute text-white/20 font-bold text-4xl pointer-events-none"
                    style={{
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        animation: `float ${item.duration} ease-in-out infinite`,
                        animationDelay: item.delay
                    }}
                >
                    {item.symbol}
                </div>
            ))}

            <div className="z-10 max-w-4xl w-full space-y-4 px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
                    Bienvenido a <span className="text-primary-sky">Papeleria</span>{' '}
                    <span className="text-primary-red">1x1 y mas</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl mx-auto drop-shadow-md">
                    ¡Aquí tenemos lo que buscas, algo y mas!
                </p>

                {/* Products Carousel */}
                <div className="products-carousel-container mt-4">
                    <div className="products-carousel">
                        {duplicatedProducts.map((product, index) => (
                            <div
                                key={index}
                                className="product-item"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Logo */}
            <div className="mt-6 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex justify-center">
                <img
                    src="/logo.png"
                    alt="Papelería 1x1 y más Logo"
                    className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
                />
            </div>

            <style>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    25% {
                        background-position: 50% 100%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    75% {
                        background-position: 50% 0%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.2;
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                        opacity: 0.4;
                    }
                }

                .products-carousel-container {
                    width: 100%;
                    max-width: 1000px;
                    overflow: hidden;
                    position: relative;
                    padding: 20px 0;
                    margin: 0 auto;
                }

                .products-carousel {
                    display: flex;
                    gap: 30px;
                    width: max-content;
                    animation: scroll-desktop 25s linear infinite;
                }

                .products-carousel:hover {
                    animation-play-state: paused;
                }

                .product-item {
                    flex-shrink: 0;
                    width: 150px;
                    height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }

                .product-item:hover {
                    transform: scale(1.1);
                }

                @keyframes scroll-desktop {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        /* 10 products (150px each) + 10 gaps (30px each) = 1800px */
                        transform: translateX(-1800px);
                    }
                }

                @media (max-width: 768px) {
                    .product-item {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .products-carousel {
                        gap: 20px;
                        animation: scroll-mobile 20s linear infinite;
                    }

                    @keyframes scroll-mobile {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            /* 10 products (120px each) + 10 gaps (20px each) = 1400px */
                            transform: translateX(-1400px);
                        }
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
