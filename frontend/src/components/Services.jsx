import React from 'react';
import './Services.css';

const Services = ({ onCategoryClick }) => {
    const categories = [
        {
            name: 'Papelería Principal',
            description: 'Oficina y escuela.',
            image: '/cat_stationery.png',
            filter: 'Papelería',
        },
        {
            name: 'Manualidades & Foamy',
            description: 'Crea magia.',
            image: '/cat_foamy.png',
            filter: 'Foamy',
        },
        {
            name: 'Papelería & Papeles',
            description: 'Cartulinas, hojas y más.',
            image: '/cat_papers.png',
            filter: 'Papel',
        },
        {
            name: 'Cintas & Masking',
            description: 'Cintas, masking y más.',
            image: '/cat_tapes.png',
            filter: 'Cintas',
        },
        {
            name: 'Escolar & Más',
            description: 'Todo para aprender.',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
            filter: 'Escolar',
        }
    ];

    // Duplicate for infinite effect
    const duplicatedCategories = [...categories, ...categories, ...categories];

    return (
        <section className="py-16 bg-gray-50/50 overflow-hidden">
            <div className="text-center mb-12 relative">
                <h2 className="text-4xl font-secondary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm inline-block">
                    Explora Materiales
                </h2>
                <p className="text-gray-500 mt-2">Encuentra los materiales perfectos para tus proyectos</p>
            </div>

            <div className="services-carousel-wrapper">
                <div className="services-carousel-track">
                    {duplicatedCategories.map((cat, i) => (
                        <div
                            key={i}
                            className="service-card-premium group relative overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => onCategoryClick(cat.filter)}
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-white text-xl font-bold mb-1">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-200 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 line-clamp-1">
                                    {cat.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default Services;
