import React from 'react';
import './Categories.css';

const Categories = ({ onCategoryClick }) => {
    const categories = [
        {
            name: 'PAPELERÍA',
            color: '#c8e6c9',
            filter: 'Papelería'
        },
        {
            name: 'FOAMY',
            color: '#f8bbd0',
            filter: 'Foamy'
        },
        {
            name: 'MANUALIDADES',
            color: '#81d4fa',
            filter: 'Manualidades'
        }
    ];

    return (
        <section className="categories-section py-12 px-6">
            <div className="container mx-auto">
                {/* Banner Image */}
                <div className="categories-banner-container mb-8 rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src="/categories-banner.png"
                        alt="Categorías de productos"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => onCategoryClick && onCategoryClick(category.filter)}
                            className="category-card group relative overflow-hidden rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            style={{ backgroundColor: category.color }}
                        >
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-gray-800 mb-2 group-hover:scale-110 transition-transform">
                                    {category.name}
                                </h3>
                                <div className="w-16 h-1 bg-gray-800 rounded-full group-hover:w-full transition-all duration-300"></div>
                            </div>

                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300"></div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
