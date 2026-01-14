import React, { useState } from 'react';
import { Search, ShoppingCart, User, LogOut, History, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ onOpenSidebar, onOpenLogin, onOpenCart }) => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-[80px] px-3 md:px-6 flex items-center justify-between glass-header transition-all duration-300">

            {/* 1. Logo */}
            <div className="flex items-center gap-4">
                <button onClick={onOpenSidebar} className="lg:hidden p-2 hover:bg-white/50 rounded-full">
                    <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <Link to="/" className="group relative cursor-pointer no-underline flex flex-col leading-tight">
                    <span className="text-primary-blue font-bold text-sm sm:text-2xl logo-text group-hover:drop-shadow-lg transition-all">Papelería</span>
                    <span className="text-primary-red font-bold text-sm sm:text-2xl logo-text group-hover:drop-shadow-lg transition-all">1x1 y más</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-blue to-primary-red transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
            </div>

            {/* 2. Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
                <input
                    type="text"
                    placeholder="¿Qué estás buscando hoy?"
                    className="w-full pl-12 pr-6 py-3 rounded-full bg-white/80 border border-transparent focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white transition-all shadow-sm outline-none font-medium text-gray-600 placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            </div>

            {/* 3. Actions */}
            <div className="flex items-center gap-1.5 md:gap-4">
                {/* Cart */}
                <button onClick={onOpenCart} className="relative p-3 rounded-full hover:bg-white/60 transition-colors group">
                    <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-pink-600 transition-colors" />
                    {cartCount > 0 && (
                        <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white shadow-md animate-bounce">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* User Menu */}
                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/60 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                                {user.email[0].toUpperCase()}
                            </div>
                        </button>

                        {/* Dropdown */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                                </div>
                                <button className="w-full px-4 py-2 text-left hover:bg-purple-50 text-sm flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <User className="w-4 h-4" /> Mi Perfil
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-purple-50 text-sm flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <History className="w-4 h-4" /> Mis Pedidos
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-sm flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={onOpenLogin}
                        className="flex items-center gap-2 px-3 sm:px-6 py-2.5 rounded-full bg-primary-blue hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm"
                    >
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Iniciar Sesión</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
