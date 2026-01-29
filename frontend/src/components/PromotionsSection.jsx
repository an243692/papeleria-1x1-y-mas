import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const PromotionsSection = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalImage, setModalImage] = useState(null);
    const pressTimer = React.useRef(null);

    // Auto-advance carousel
    useEffect(() => {
        if (promos.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % promos.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [promos.length]);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                // Fetch from 'promotions' collection
                const q = query(collection(db, 'promotions'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const fetchedPromos = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPromos(fetchedPromos);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromos();
    }, []);

    const handlePressStart = (image) => {
        pressTimer.current = setTimeout(() => {
            setModalImage(image);
        }, 500); // 0.5 seconds - Short long-press ("tantito")
    };

    const handlePressEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    if (loading || promos.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-8">
                <div className="text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-secondary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 inline-block">
                        Promociones y Novedades
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">¡No te pierdas nuestras ofertas exclusivas!</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mt-3 rounded-full"></div>
                </div>
            </div>

            {/* Infinite Sequential Loop Display */}
            <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
                {promos.map((promo, index) => (
                    <div
                        key={promo.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        onMouseDown={() => handlePressStart(promo.image)}
                        onMouseUp={handlePressEnd}
                        onMouseLeave={handlePressEnd}
                        onTouchStart={() => handlePressStart(promo.image)}
                        onTouchEnd={handlePressEnd}
                    >
                        <img
                            src={promo.image}
                            alt={promo.title || "Promoción"}
                            className="w-full h-full object-contain cursor-pointer select-none"
                            draggable="false"
                        />

                        {/* Overlay Content */}
                        {(promo.title || promo.description) && (
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 pt-24 text-center pointer-events-none">
                                {promo.title && (
                                    <h3 className="text-white font-bold text-2xl md:text-3xl mb-2 drop-shadow-md animate-fade-in-up">
                                        {promo.title}
                                    </h3>
                                )}
                                {promo.description && (
                                    <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto line-clamp-2 drop-shadow-sm">
                                        {promo.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {promos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'bg-white w-8'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Full Screen Image Modal - Persistent */}
            {modalImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setModalImage(null)} // Click background to close
                >
                    <button
                        onClick={() => setModalImage(null)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50 ring-1 ring-white/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={modalImage}
                        alt="Promoción Completa"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                    />
                </div>
            )}
        </section>
    );
};

export default PromotionsSection;
