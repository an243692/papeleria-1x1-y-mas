import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const PromotionsSection = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

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

            <div className="relative w-full">
                {/* Scroll Container */}
                <div className="flex overflow-x-auto gap-6 px-6 pb-8 snap-x snap-mandatory overflow-y-hidden no-scrollbar justify-start md:justify-center">
                    {promos.map((promo) => (
                        <div
                            key={promo.id}
                            className="flex-shrink-0 w-[280px] h-[400px] bg-white rounded-2xl overflow-hidden shadow-lg snap-center relative group border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <img
                                src={promo.image}
                                alt={promo.title || "Promoción"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay Title */}
                            {(promo.title || promo.description) && (
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12 pointer-events-none">
                                    {promo.title && <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">{promo.title}</h3>}
                                    {promo.description && <p className="text-gray-200 text-sm line-clamp-2">{promo.description}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromotionsSection;
