import React from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

const FilterSidebar = ({ isOpen, onClose, filters, setFilters, categories = [] }) => {

    const handleCategoryChange = (cat) => {
        setFilters(prev => {
            const current = prev.categories || [];
            if (current.includes(cat)) {
                return { ...prev, categories: current.filter(c => c !== cat) };
            } else {
                return { ...prev, categories: [...current, cat] };
            }
        });
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`
        fixed top-0 left-0 h-full w-[300px] z-[1002] 
        bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl
        transform transition-transform duration-300 ease-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-2 text-primary-blue">
                        <SlidersHorizontal className="w-5 h-5 text-purple-600" />
                        <h2 className="font-bold text-lg font-primary text-gray-800">Filtros</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500 shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                            Rango de Precio
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={filters.minPrice || ''}
                                    onChange={handlePriceChange}
                                    placeholder="Min"
                                    className="w-full pl-6 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:bg-white text-sm transition-all"
                                />
                            </div>
                            <span className="text-gray-400 font-bold">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={filters.maxPrice || ''}
                                    onChange={handlePriceChange}
                                    placeholder="Max"
                                    className="w-full pl-6 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:bg-white text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-4 bg-pink-500 rounded-full"></span>
                            Categorías
                        </h3>
                        <div className="space-y-2">
                            {categories.map(cat => {
                                const isSelected = filters.categories && filters.categories.includes(cat);
                                return (
                                    <label key={cat} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-purple-50 border border-purple-100' : 'hover:bg-gray-50'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300 bg-white'}`}>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={isSelected}
                                            onChange={() => handleCategoryChange(cat)}
                                        />
                                        <span className={`text-sm ${isSelected ? 'text-purple-700 font-medium' : 'text-gray-600'}`}>{cat}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            Tipo de Venta
                        </h3>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                <input
                                    type="radio"
                                    name="type"
                                    value="all"
                                    checked={!filters.type || filters.type === 'all'}
                                    onChange={handlePriceChange}
                                    className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-600">Todos</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                                <input
                                    type="radio"
                                    name="type"
                                    value="wholesale"
                                    checked={filters.type === 'wholesale'}
                                    onChange={handlePriceChange}
                                    className="text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-600">Solo Mayoreo</span>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-blue to-purple-700 text-white font-semibold shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide"
                    >
                        Ver Resultados
                    </button>
                    <button
                        onClick={() => setFilters({})}
                        className="w-full py-2 text-sm text-gray-500 hover:text-gray-800 transition-colors underline decoration-dotted"
                    >
                        Limpiar todo
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;

