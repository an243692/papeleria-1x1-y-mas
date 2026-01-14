import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Persistir en localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        let isNew = false;
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                isNew = false;
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            isNew = true;
            return [...prev, { ...product, quantity: 1 }];
        });

        if (isNew) {
            toast.success(`${product.name} agregado al carrito`);
        } else {
            toast.success(`Cantidad actualizada: ${product.name}`);
        }
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        toast.error("Producto eliminado");
    };

    const updateQuantity = (productId, amount) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQuantity = Math.max(1, item.quantity + amount);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const cartTotal = cart.reduce((total, item) => {
        const price = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
            ? item.wholesalePrice
            : item.price;
        return total + (price * item.quantity);
    }, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
