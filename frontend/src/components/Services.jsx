import React from 'react';
import './Services.css';

const Services = ({ onCategoryClick }) => {
    const categories = [
        {
            name: 'PAPELERÍA',
            color: '#ea938eff',
            textColor: '#ffffffff',
            filter: 'Papelería'
        },
        {
            name: 'FOAMY',
            color: '#f8bbd0',
            textColor: '#ffffff',
            filter: 'Foamy'
        },
        {
            name: 'MANUALIDADES',
            color: '#81d4fa',
            textColor: '#ffffff',
            filter: 'Manualidades'
        },

        {
            name: 'SILICÓN',
            color: '#f8fa81ff',
            textColor: '#ffffff',
            filter: 'Manualidades'
        }
    ];

    // Duplicate categories for infinite scroll effect
    const duplicatedCategories = [...categories, ...categories, ...categories];

    return (
        <section className="py-12 px-6 overflow-hidden">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-secondary font-bold text-primary-red drop-shadow-sm inline-block">
                    Nuestros Servicios
                </h2>
                <div className="h-1 w-24 bg-primary-red mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="categories-carousel-container">
                <div className="categories-carousel">
                    {duplicatedCategories.map((category, index) => (
                        <div
                            key={index}
                            className="category-banner-item cursor-pointer flex items-center justify-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            style={{ backgroundColor: category.color }}
                            onClick={() => {
                                if (onCategoryClick) {
                                    onCategoryClick(category.filter);
                                }
                            }}
                        >
                            <h3
                                className="text-2xl md:text-3xl font-bold font-secondary tracking-wide"
                                style={{
                                    color: category.textColor,
                                    textShadow: category.textColor === '#ffffff' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
                                }}
                            >
                                {category.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
