import React from 'react';
import './Services.css';

const Services = ({ onCategoryClick }) => {
    const categories = [
        {
            name: 'Papelería Principal',
            description: 'Todo lo que necesitas para tu oficina y escuela.',
            image: '/category_stationery_1768432436180.png',
            filter: 'Papelería',
            className: 'md:col-span-2 md:row-span-2'
        },
        {
            name: 'Manualidades & Foamy',
            description: 'Crea magia con tus propias manos.',
            image: '/category_foamy_crafts_1768432449562.png',
            filter: 'Foamy',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            name: 'Arte Profesional',
            description: 'Pinturas, pinceles y lienzos.',
            image: '/category_art_supplies_1768432462500.png',
            filter: 'Arte',
            className: 'md:col-span-1 md:row-span-2'
        },
        {
            name: 'Escolar & Más',
            description: 'Acompañamos tu aprendizaje.',
            image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&q=80&w=800',
            filter: 'Escolar',
            className: 'md:col-span-1 md:row-span-1'
        }
    ];

    return (
        <section className="py-20 px-4 sm:px-10 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 relative">
                    <h2 className="text-5xl font-secondary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm inline-block">
                        Explora Categorías
                    </h2>
                    <p className="text-gray-500 mt-4 text-lg">Encuentra los materiales perfectos para tus proyectos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 h-[800px] md:h-[600px]">
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-[2.5rem] cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${cat.className}`}
                            onClick={() => onCategoryClick(cat.filter)}
                        >
                            {/* Background Image */}
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
                                <h3 className="text-white text-2xl font-bold mb-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    {cat.description}
                                </p>

                                <div className="mt-4 flex items-center gap-2 text-white/80 font-medium text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all delay-100">
                                    Ver productos
                                    <span className="text-xl">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
