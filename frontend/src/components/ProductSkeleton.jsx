import React from 'react';

const ProductSkeleton = () => {
    return (
        <div className="product-card h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-square bg-gray-200" />

            {/* Content Placeholder */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 space-y-4">
                {/* Name Placeholder */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>

                {/* Prices Placeholder */}
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <div className="h-2 bg-gray-100 rounded w-12" />
                        <div className="h-8 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="space-y-1">
                        <div className="h-2 bg-gray-100 rounded w-20" />
                        <div className="h-8 bg-gray-200 rounded w-28" />
                    </div>
                </div>

                {/* Badge Placeholder */}
                <div className="h-6 bg-gray-100 rounded-full w-20" />

                {/* Buttons Placeholder */}
                <div className="space-y-2 pt-4 mt-auto">
                    <div className="h-10 bg-gray-100 rounded-xl w-full" />
                    <div className="h-10 bg-gray-200 rounded-xl w-full" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
