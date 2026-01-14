import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Success = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        // Limpiar el carrito después de un pago exitoso
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">¡Pago Exitoso!</h1>
                <p className="text-gray-600">
                    Muchas gracias por tu compra. Hemos recibido tu pedido y estamos procesándolo.
                </p>
                <div className="pt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-primary-blue text-white py-4 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        Volver a la Tienda
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
