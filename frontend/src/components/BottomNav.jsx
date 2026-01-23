import React from 'react';
import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './BottomNav.css';

const BottomNav = ({ onOpenSidebar, onOpenLogin, onOpenCart, onOpenOrders }) => {
    const { cartCount, cartAnimation } = useCart();
    const { user } = useAuth();

    const handleAccountClick = () => {
        if (user) {
            onOpenOrders();
        } else {
            onOpenLogin();
        }
    };

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
                <div className={`relative transition-all duration-300 ${cartAnimation ? 'scale-150' : 'scale-100'}`}>
                    <ShoppingCart className={`w-6 h-6 transition-colors ${cartAnimation ? 'text-primary-red' : ''}`} />
                    {cartCount > 0 && (
                        <span className={`absolute -top-2 -right-2 bg-primary-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm ${cartAnimation ? 'animate-bounce' : ''}`}>
                            {cartCount}
                        </span>
                    )}
                </div>
                <span className={cartAnimation ? 'text-primary-red font-bold' : ''}>Carrito</span>
            </button>
            <button className="nav-item" onClick={handleAccountClick}>
                <User className="w-6 h-6" />
                <span>{user ? 'Mis Pedidos' : 'Mi Cuenta'}</span>
            </button>
        </nav>
    );
};

export default BottomNav;
