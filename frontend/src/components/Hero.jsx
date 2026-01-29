import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

const Hero = () => {
    // Default fallback products
    const defaultProducts = [
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

    const [products, setProducts] = useState(defaultProducts);

    useEffect(() => {
        const fetchCarouselImages = async () => {
            try {
                const q = query(collection(db, 'hero_carousel'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const fetchedProducts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name || 'Producto',
                        image: doc.data().image
                    }));
                    setProducts(fetchedProducts);
                }
            } catch (error) {
                console.error("Error fetching carousel images:", error);
            }
        };

        fetchCarouselImages();
    }, []);

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

    // Duplicar productos para scroll infinito (si hay pocos, duplicar más veces)
    const displayProducts = products.length < 5 ? [...products, ...products, ...products, ...products] : [...products, ...products];
    const duplicatedProducts = [...displayProducts];

    return (
        <section
            className="relative w-full py-8 md:py-12 px-6 flex flex-col items-center justify-center text-center overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #1A237E 0%, #303F9F 30%, #3f51b5 60%, #5C6BC0 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradient 12s ease infinite'
            }}
        >
            {/* Soft Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-blue/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary-red/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Math Symbols */}
            {mathSymbols.map((item, index) => (
                <div
                    key={index}
                    className="absolute text-white/10 font-black text-2xl sm:text-5xl pointer-events-none select-none z-0"
                    style={{
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        animation: `float-vary ${item.duration} ease-in-out infinite`,
                        animationDelay: item.delay,
                        filter: 'blur(1px)'
                    }}
                >
                    {item.symbol}
                </div>
            ))}

            <div className="z-10 max-w-5xl w-full space-y-6 px-4">
                <div className="space-y-3 animate-in fade-in zoom-in duration-1000">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
                        <span className="block mb-1 opacity-90 text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-blue-200">Bienvenido a</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-red-300 drop-shadow-lg">Papeleria</span>{' '}
                        <span className="text-primary-red decoration-blue-500 drop-shadow-[0_4px_10px_rgba(233,30,99,0.5)]">1x1 y mas</span>
                    </h1>

                    <div className="h-1 w-24 bg-gradient-to-r from-primary-blue via-white to-primary-red mx-auto rounded-full shadow-lg"></div>

                    <p className="text-base sm:text-lg md:text-xl text-blue-50 font-semibold max-w-2xl mx-auto drop-shadow-md opacity-90 font-display">
                        ¡Aquí tenemos lo que buscas, <span className="text-primary-red">algo</span> y mas!
                    </p>
                </div>

                {/* Products Carousel */}
                <div className="products-carousel-container mt-6 mb-4">
                    <div className="products-carousel">
                        {duplicatedProducts.map((product, index) => (
                            <div
                                key={index}
                                className="product-item-clean"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero Logo */}
            <div className="mt-4 relative z-10 flex justify-center group">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl group-hover:bg-primary-red/20 transition-all duration-500 scale-125"></div>
                <img
                    src="/logo.png"
                    alt="Papelería 1x1 y más Logo"
                    className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl animate-pulse-slow relative z-10 group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes float-vary {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(15px, -20px) rotate(10deg); }
                    66% { transform: translate(-15px, 20px) rotate(-10deg); }
                }

                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.03); opacity: 0.95; }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes zoom-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .animate-in {
                    animation-duration: 1s;
                    animation-fill-mode: both;
                    animation-timing-function: ease-out;
                }

                .fade-in { animation-name: fade-in; }
                .zoom-in { animation-name: zoom-in; }

                .animate-pulse-slow {
                    animation: pulse-slow 5s ease-in-out infinite;
                }

                .product-item-clean {
                    flex-shrink: 0;
                    width: 140px;
                    height: 140px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: float-gentle 4s ease-in-out infinite;
                }

                .products-carousel-container {
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    padding: 10px 0;
                }

                .products-carousel {
                    display: flex;
                    gap: 30px;
                    width: max-content;
                    animation: scroll-desktop 35s linear infinite;
                }

                .products-carousel:hover {
                    animation-play-state: paused;
                }

                    @keyframes scroll-desktop {
                        0% { transform: translateX(-${products.length * 170}px); }
                        100% { transform: translateX(0); }
                    }

                    @media (max-width: 768px) {
                        .product-item-clean {
                            width: 110px;
                            height: 110px;
                        }
                        .products-carousel {
                            gap: 20px;
                            animation-duration: 25s;
                        }
                        @keyframes scroll-desktop {
                            0% { transform: translateX(-${products.length * 130}px); }
                            100% { transform: translateX(0); }
                        }
                    }
            `}</style>

        </section>
    );
};

export default Hero;
