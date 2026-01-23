import React, { useState } from 'react';
import { Search } from 'lucide-react';

const MobileSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(searchTerm);
    };

    return (
        <div className="md:hidden w-full px-4 py-3 bg-white/30 backdrop-blur-sm border-b border-gray-100/50">
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="¿Qué estás buscando hoy?"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/5 outline-none transition-all text-sm font-medium text-gray-700 placeholder:text-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-blue transition-colors" />
            </form>
        </div>
    );
};

export default MobileSearchBar;
