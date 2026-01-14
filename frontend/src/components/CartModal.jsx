import React from 'react';
import { X, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const BACKEND_URL = 'https://papeleria-backend-an24.onrender.com'; // Placeholder, user will update this

const CartModal = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        name: item.name,
                        price: item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                            ? item.wholesalePrice
                            : item.price,
                        quantity: item.quantity,
                        imageUrl: item.images?.[0]
                    })),
                    orderId: `ORD-${Date.now()}`
                }),
            });

            const session = await response.json();

            if (session.id) {
                // Stripe redirect usually involves window.location
                const stripe = window.Stripe('pk_test_51QQM0NAnGzXhW0uO5V9L4jU9A9iV4L9iV4L9iV4L9iV4L9iV4L9iV4L9iV4L9iV4L'); // User will need to replace this
                // If the user doesn't have the script yet, we can simple redirect if the backend returns a URL
                // Actually the backend returns just ID, so we need stripe-js or just redirect to session.url if we fix backend
                window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
            } else {
                throw new Error(session.error || 'Error al crear la sesión de pago');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Ocurrió un error al procesar el pago. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-600 mb-6">Agrega productos para comenzar</p>
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-primary-blue to-primary-red text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-display text-center mb-6">
                            <span className="text-primary-red">MI</span>{' '}
                            <span className="text-primary-blue">CARRITO</span>
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                    <img
                                        src={item.images?.[0] || '/placeholder.png'}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            ${item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                                                ? item.wholesalePrice
                                                : item.price} c/u
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-primary-blue">
                                            ${((item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                                                ? item.wholesalePrice
                                                : item.price) * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 text-sm hover:underline mt-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xl font-bold">Total:</span>
                                <span className="text-2xl font-bold text-primary-blue">
                                    ${cartTotal.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary-blue to-primary-red text-white py-3 rounded-full font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Proceder al Pago'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;

