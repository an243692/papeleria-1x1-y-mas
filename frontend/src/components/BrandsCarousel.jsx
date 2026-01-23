import React from 'react';

const BrandsCarousel = () => {
    const brands = [
        { name: 'BIC', logo: '/brands/bic.png' },
        { name: 'Berol', logo: '/brands/berol.png' },
        { name: 'Azor', logo: '/brands/azor.png' },
        { name: 'Prismacolor', logo: '/brands/prismacolor.png' },
        { name: 'Paper Mate', logo: '/brands/papermate.png' },
        { name: 'Selanusa', logo: '/brands/selanusa.png' },
        { name: 'Barrilito', logo: '/brands/barrilito.png' },
        { name: 'Jumbo', logo: '/brands/jumbo.png' },
        { name: 'Jocar', logo: '/brands/jocar.png' },
        { name: 'Dixon', logo: '/brands/dixon.png' },
    ];

    // Duplicate brands for seamless scrolling
    const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

    return (
        <section className="py-6 bg-slate-50 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="container mx-auto px-6 mb-4 text-center relative z-10">
                <h2 className="text-2xl md:text-3xl font-secondary font-bold text-gray-800 mb-2">
                    Encuentra las mejores marcas
                </h2>
                <div className="h-1.5 w-24 bg-gradient-to-r from-primary-blue to-primary-red mx-auto rounded-full"></div>
            </div>

            <div className="relative flex overflow-x-hidden group py-2">
                <div className="flex animate-scroll-slow whitespace-nowrap">
                    {duplicatedBrands.map((brand, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center justify-center mx-4 w-40 h-24 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-[80%] max-h-[70%] object-contain transition-all duration-300"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/150x80?text=${brand.name}`;
                                }}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex absolute top-2 animate-scroll-slow-delayed whitespace-nowrap">
                    {duplicatedBrands.map((brand, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center justify-center mx-4 w-40 h-24 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-[80%] max-h-[70%] object-contain transition-all duration-300"
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/150x80?text=${brand.name}`;
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes color-change {
                    0%, 100% { color: #3f51b5; } /* Azul institucional */
                    50% { color: #e91e63; }    /* Rojo institucional */
                }

                @keyframes color-change-bg {
                    0%, 100% { background-color: #3f51b5; }
                    50% { background-color: #e91e63; }
                }

                .animate-color-change {
                    animation: color-change 4s ease-in-out infinite;
                }

                .animate-color-change-bg {
                    animation: color-change-bg 4s ease-in-out infinite;
                }

                @keyframes scroll-reverse {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }

                .animate-scroll-slow {
                    animation: scroll-reverse 100s linear infinite;
                }

                .animate-scroll-slow-delayed {
                    animation: scroll-reverse 100s linear infinite;
                    animation-delay: -50s;
                }

                .group:hover .animate-scroll-slow,
                .group:hover .animate-scroll-slow-delayed {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default BrandsCarousel;
