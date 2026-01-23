import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const ReelsSection = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const q = query(collection(db, 'reels'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const fetchedReels = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReels(fetchedReels);
            } catch (error) {
                console.error("Error fetching reels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReels();
    }, []);

    if (loading || reels.length === 0) return null;

    return (
        <section className="py-12 bg-white overflow-hidden relative">
            <div className="container mx-auto px-4 mb-8">
                <div className="text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-secondary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 inline-block">
                        ¡Síguenos en Facebook!
                    </h2>
                    <p className="text-gray-500 mt-2 font-medium">Mira nuestros últimos videos y reels</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-pink-500 mx-auto mt-3 rounded-full"></div>
                </div>
            </div>

            <div className="relative w-full">
                {/* Scroll Container */}
                <div className="flex overflow-x-auto gap-6 px-6 pb-8 snap-x snap-mandatory overflow-y-hidden no-scrollbar justify-start md:justify-center">
                    {reels.map((reel) => (
                        <div
                            key={reel.id}
                            className="flex-shrink-0 w-[280px] h-[500px] bg-black/5 rounded-2xl overflow-hidden shadow-xl snap-center relative group border border-gray-100 hover:scale-[1.02] transition-transform duration-300"
                        >
                            <iframe
                                src={reel.url}
                                width="100%"
                                height="100%"
                                style={{ border: 'none', overflow: 'hidden' }}
                                scrolling="no"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                allowFullScreen={true}
                                title={reel.title || "Facebook Reel"}
                            ></iframe>

                            {/* Overlay Title (Optional) */}
                            {reel.title && (
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 pointer-events-none">
                                    <p className="text-white font-medium text-sm line-clamp-2">{reel.title}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Gradient Fades */}
                <div className="absolute top-0 left-0 h-full w-4 md:w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-4 md:w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
            </div>
        </section>
    );
};

export default ReelsSection;
