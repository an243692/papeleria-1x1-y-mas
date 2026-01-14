import React from 'react';
import './Services.css';

const Services = ({ onCategoryClick }) => {
    const categories = [
        {
            name: 'Papelería Principal',
            description: 'Oficina y escuela.',
            image: '/category_stationery_1768432436180.png',
            filter: 'Papelería',
        },
        {
            name: 'Manualidades & Foamy',
            description: 'Crea magia.',
            image: '/category_foamy_crafts_1768432449562.png',
            filter: 'Foamy',
        },
        {
            name: 'Arte Profesional',
            description: 'Pinturas y lienzos.',
            image: '/category_art_supplies_1768432462500.png',
            filter: 'Arte',
        },
        {
            name: 'Escolar & Más',
            description: 'Todo para aprender.',
            image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800',
            filter: 'Escolar',
        }
    ];

    // Duplicate for infinite effect
    const duplicatedCategories = [...categories, ...categories, ...categories];

    return (
        <section className="py-16 bg-gray-50/50 overflow-hidden">
            <div className="text-center mb-12 relative">
                <h2 className="text-4xl font-secondary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm inline-block">
                    Explora Categorías
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
