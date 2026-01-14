import React from 'react';
import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './BottomNav.css';

const BottomNav = ({ onOpenSidebar, onOpenLogin, onOpenCart }) => {
    const { cartCount } = useCart();

    return (
        <nav className="bottom-nav lg:hidden">
            <button className="nav-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Home className="w-6 h-6" />
                <span>Inicio</span>
            </button>
            <button className="nav-item" onClick={onOpenSidebar}>
                <Grid className="w-6 h-6" />
                <span>Categorías</span>
            </button>
            <button className="nav-item" onClick={onOpenCart}>
                <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    )}
                </div>
                <span>Carrito</span>
            </button>
            <button className="nav-item" onClick={onOpenLogin}>
                <User className="w-6 h-6" />
                <span>Mi Cuenta</span>
            </button>
        </nav>
    );
};

export default BottomNav;
