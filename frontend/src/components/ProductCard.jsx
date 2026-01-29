import React, { useState } from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onOpenDetail, onAddToCart }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = product.images || [];
    const hasMultipleImages = images.length > 1;

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Category icon mapping
    const getCategoryIcon = (category) => {
        const icons = {
            'HILOS': '📌',
            'LISTONES': '📌',
            'PAPELERÍA': '📌',
            'ARTE': '🎨',
            'ESCOLAR': '✏️',
            'REGALOS': '🎁'
        };
        return icons[category?.toUpperCase()] || '📌';
    };

    return (
        <div className="product-card h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={images[currentImageIndex] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onOpenDetail(product)}
                />



                {/* Image Navigation */}
                {hasMultipleImages && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                        >
                            ›
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-3">
                {/* Product Name */}
                <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-snug min-h-[48px] sm:min-h-[56px] flex items-center">
                    {product.name}
                </h3>

                {/* Prices Container with fixed minimum height to maintain alignment */}
                <div className="space-y-3 min-h-[110px] sm:min-h-[120px] flex flex-col justify-center">
                    {/* Individual Price */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">
                            Individual:
                        </span>
                        <span className="text-2xl font-black text-gray-900 leading-tight">
                            ${product.price?.toFixed(2)}
                        </span>
                    </div>

                    {/* Wholesale Price */}
                    {product.wholesalePrice && (
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-medium tracking-wider">
                                Mayoreo (mín. {product.wholesaleQuantity || 4}):
                            </span>
                            <span className="text-2xl font-black text-orange-500 leading-tight">
                                ${product.wholesalePrice?.toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Stock Badge */}
                <div className="flex items-center justify-start">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                        Stock: {product.stock || 0}
                    </span>
                </div>

                {/* Action Buttons - Pushed to bottom */}
                <div className="space-y-2 pt-2 mt-auto">
                    <button
                        onClick={() => onOpenDetail(product)}
                        className="w-full flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 border-2 border-primary-blue text-primary-blue rounded-xl font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Detalles
                    </button>
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.stock || product.stock === 0}
                        className="w-full flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 bg-primary-blue text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
