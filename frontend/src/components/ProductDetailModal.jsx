import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    if (!isOpen || !product) return null;

    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart } = useCart();

    // Use generic placeholders if images missing
    const images = product.images && product.images.length > 0
        ? product.images
        : [product.imageUrl || 'https://via.placeholder.com/400'];

    const maxStock = product.stock || 0;

    // Logic for wholesale price calculation purely for display here
    // The actual logic should probably be in the cart or backend, but we'll show it dynamic here
    const currentPrice = (product.wholesaleQuantity && quantity >= product.wholesaleQuantity)
        ? product.wholesalePrice
        : product.price;

    const subtotal = currentPrice * quantity;

    const handleIncrement = () => {
        if (quantity < maxStock) setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const handleAddToCart = () => {
        addToCart({ ...product, quantity });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white/90 glass-panel w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full z-10 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Left: Images */}
                <div className="w-full md:w-1/2 bg-gray-50 p-6 flex flex-col gap-4">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
                        <img
                            src={images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-purple-500 shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span>Inicio</span>
                        <span>/</span>
                        <span className="font-medium text-purple-600">{product.category}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 font-primary mb-2">
                        {product.name}
                    </h2>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            <Check className="w-3 h-3" /> {product.stock} Disponibles
                        </div>
                        <span className="text-gray-400 text-sm">SKU: {product.sku || 'N/A'}</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                        {product.description || "Descripción no disponible para este producto. Excelente calidad garantizada."}
                    </p>

                    <div className="bg-white/50 rounded-2xl p-4 border border-white/60 shadow-sm space-y-4">
                        {/* Improved Price Layout */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-start">
                                {/* Left Side: Unit Price */}
                                <div className="space-y-0.5">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Precio Unitario</p>
                                    <span className="text-2xl font-bold text-primary-blue">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>

                                {/* Right Side: Wholesale Price (Swapped with Subtotal) */}
                                {product.wholesalePrice < product.price && (
                                    <div className="text-right space-y-0.5">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Precio Mayoreo</p>
                                        <span className="text-2xl font-bold text-primary-red">
                                            ${product.wholesalePrice.toFixed(2)}
                                        </span>
                                        <p className="text-[9px] uppercase font-bold text-gray-400">
                                            (A partir de {product.wholesaleQuantity || 4} pzas)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Subtotal moved to the bottom in small text */}
                            <div className="flex justify-center border-t border-gray-100 pt-3">
                                <div className="text-center px-4 py-1.5 bg-gray-50 rounded-lg">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 mr-2">Subtotal estimado:</span>
                                    <span className="text-lg font-bold text-purple-600">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Controls - Stacked on extra small screens */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between bg-white rounded-xl border shadow-sm h-12 px-2 sm:w-32">
                                <button
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="flex-1 text-center font-bold text-lg text-gray-800">{quantity}</span>
                                <button
                                    onClick={handleIncrement}
                                    disabled={quantity >= maxStock}
                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={maxStock === 0}
                                className="flex-1 bg-gradient-to-r from-primary-blue to-primary-red text-white rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 h-12 text-sm px-4 disabled:opacity-50"
                            >
                                <ShoppingCart className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">
                                    {maxStock === 0 ? 'Agotado' : 'Agregar'}
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
