import React from 'react';
import { X, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BACKEND_URL = 'https://papeleria-1x1-y-mas.onrender.com';

const CartModal = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { userProfile, user } = useAuth();
    const [deliveryMethod, setDeliveryMethod] = React.useState('delivery'); // 'delivery' or 'store'
    const [paymentMethod, setPaymentMethod] = React.useState('card'); // 'card' or 'cash'
    const [isLoading, setIsLoading] = React.useState(false);

    const [shippingOptions, setShippingOptions] = React.useState([]);
    const [selectedShipping, setSelectedShipping] = React.useState(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = React.useState(false);

    // Shipping Address State
    const [shippingAddress, setShippingAddress] = React.useState({
        street: userProfile?.address?.street || '',
        externalNumber: userProfile?.address?.externalNumber || '',
        neighborhood: userProfile?.address?.neighborhood || '',
        zipCode: userProfile?.address?.zipCode || '',
        city: userProfile?.address?.city || '',
        references: ''
    });

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({ ...prev, [name]: value }));
    };

    // Calculate Shipping Effect
    React.useEffect(() => {
        const fetchShippingRates = async () => {
            if (deliveryMethod !== 'delivery' || !shippingAddress.zipCode || shippingAddress.zipCode.length < 5) return;

            setIsCalculatingShipping(true);
            try {
                const response = await fetch(`${BACKEND_URL}/calculate-shipping`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        zipCode: shippingAddress.zipCode,
                        total: cartTotal
                    })
                });

                const data = await response.json();
                if (data.options && data.options.length > 0) {
                    setShippingOptions(data.options);
                    // Select the first option by default (usually the cheapest or recommended)
                    setSelectedShipping(data.options[0]);
                } else {
                    setShippingOptions([]);
                    setSelectedShipping(null);
                }
            } catch (error) {
                console.error("Error fetching shipping rates:", error);
                toast.error("No se pudieron calcular las tarifas de envío");
            } finally {
                setIsCalculatingShipping(false);
            }
        };

        // Debounce simple para esperar a que termine de escribir el CP
        const timeoutId = setTimeout(() => {
            fetchShippingRates();
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [shippingAddress.zipCode, deliveryMethod, cartTotal]);

    // Reset shipping when delivery method changes
    React.useEffect(() => {
        if (deliveryMethod === 'store') {
            setShippingOptions([]);
            setSelectedShipping(null);
        }
    }, [deliveryMethod]);

    // Warm up the server when the cart is opened to avoid Render's cold start delay
    React.useEffect(() => {
        if (isOpen) {
            fetch(BACKEND_URL).catch(() => { /* Silent fail */ });
        }
    }, [isOpen]);

    // Reset payment method to card if delivery is selected
    React.useEffect(() => {
        if (deliveryMethod === 'delivery') {
            setPaymentMethod('card');
        }
    }, [deliveryMethod]);

    const finalTotal = cartTotal + (selectedShipping ? selectedShipping.price : 0);

    const handleCheckout = async () => {
        // Validation for delivery address
        if (deliveryMethod === 'delivery') {
            if (!shippingAddress.street || !shippingAddress.zipCode || !shippingAddress.neighborhood || !shippingAddress.city) {
                toast.error('Por favor completa la dirección de envío (Calle, Colonia, Código Postal y Ciudad son obligatorios).');
                return;
            }
            if (!selectedShipping) {
                toast.error('Por favor selecciona una opción de envío.');
                return;
            }
        }

        setIsLoading(true);

        try {
            const orderId = `ORD-${Date.now()}`;
            const orderItems = cart.map(item => {
                const unitPrice = item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                    ? item.wholesalePrice
                    : item.price;
                // Verificar si la imagen es una URL válida y no una cadena base64 gigante
                let cleanImageUrl = item.images?.[0] || '';
                if (cleanImageUrl.length > 500 || cleanImageUrl.startsWith('data:')) {
                    console.warn('Imagen omitida por ser demasiado larga (posible base64):', item.name);
                    cleanImageUrl = ''; // Enviar vacío si es muy larga para no romper el checkout
                }

                return {
                    id: item.id,
                    name: item.name,
                    unitPrice: unitPrice,
                    price: unitPrice,
                    quantity: item.quantity,
                    totalPrice: unitPrice * item.quantity,
                    imageUrl: cleanImageUrl
                };
            });

            // Add shipping as an item if applicable
            if (selectedShipping && deliveryMethod === 'delivery') {
                orderItems.push({
                    id: 'shipping_cost',
                    name: `Envío: ${selectedShipping.name}`,
                    unitPrice: selectedShipping.price,
                    price: selectedShipping.price,
                    quantity: 1,
                    totalPrice: selectedShipping.price,
                    imageUrl: '' // No image for shipping
                });
            }

            const orderData = {
                id: orderId,
                items: orderItems,
                total: finalTotal,
                subtotal: cartTotal,
                shippingCost: selectedShipping ? selectedShipping.price : 0,
                shippingOption: selectedShipping,
                status: paymentMethod === 'card' ? 'checkout_session' : 'pending',
                deliveryMethod,
                paymentMethod,
                shippingAddress: deliveryMethod === 'delivery' ? shippingAddress : null,
                timestamp: Date.now(),
                // Asegurar que SIEMPRE se capture el userId si hay usuario autenticado
                userId: userProfile?.uid || user?.uid || 'guest',
                // Construir userInfo de forma robusta con múltiples fallbacks
                userInfo: {
                    fullName: userProfile?.fullName || user?.displayName || 'Usuario',
                    email: userProfile?.email || user?.email || '',
                    phone: userProfile?.phone || '',
                    address: userProfile?.address || ''
                }
            };

            // Debug: Verificar que la información del usuario se está capturando correctamente
            console.log('📦 Datos del pedido:', {
                userId: orderData.userId,
                userInfo: orderData.userInfo,
                userProfile: userProfile,
                user: user ? { uid: user.uid, email: user.email, displayName: user.displayName } : null
            });


            const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: orderData.items,
                    orderId: orderId,
                    orderMetadata: orderData,
                    isCash: paymentMethod === 'cash'
                }),
            });

            const data = await response.json();

            if (paymentMethod === 'card') {
                if (data.url) {
                    toast.success('¡Listo! Redirigiendo al pago...');
                    setTimeout(() => {
                        window.location.href = data.url;
                    }, 400);
                } else {
                    throw new Error(data.error || 'No se recibió la URL de pago');
                }
            } else {
                if (response.ok) {
                    toast.success('¡Pedido registrado! Redirigiendo a WhatsApp...');

                    // Redirigir a WhatsApp

                    // Construct WhatsApp Message (Ticket Style)
                    const formatCurrency = (val) => `$${val.toFixed(2)}`;
                    const storePhone = "525528526573";

                    let message = `*NUEVO PEDIDO - ${orderId}*\n`;
                    message += `--------------------------\n`;
                    message += `👤 *Cliente:* ${userProfile?.fullName || user?.displayName || 'Cliente'}\n`;
                    message += `📞 *Tel:* ${userProfile?.phone || 'No proporcionado'}\n`;
                    message += `🚚 *Entrega:* ${deliveryMethod === 'store' ? 'Recoger en Tienda' : 'Envio a Domicilio'}\n`;
                    message += `💰 *Pago:* Efectivo (Al recibir)\n\n`;

                    message += `*PRODUCTOS:*\n`;
                    orderItems.forEach(item => {
                        // Skip shipping item in product list for clarity (add it at the end maybe?)
                        if (item.id === 'shipping_cost') return;
                        message += `- ${item.name} (x${item.quantity}) - ${formatCurrency(item.totalPrice)}\n`;
                    });

                    message += `\n--------------------------\n`;
                    message += `Subtotal: ${formatCurrency(cartTotal)}\n`;
                    if (selectedShipping) {
                        message += `Envío (${selectedShipping.name}): ${formatCurrency(selectedShipping.price)}\n`;
                    }
                    message += `*TOTAL A PAGAR: ${formatCurrency(finalTotal)}*\n`;

                    if (deliveryMethod === 'delivery' && orderData.shippingAddress) {
                        const addr = orderData.shippingAddress;
                        message += `\n📍 *Dirección:* ${addr.street} ${addr.externalNumber}, ${addr.neighborhood}, CP ${addr.zipCode}, ${addr.city}\n`;
                    }

                    const encodedMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMessage}`;

                    setTimeout(() => {
                        window.location.href = whatsappUrl;
                    }, 1000);
                } else {
                    throw new Error(data.error || 'Error al guardar pedido en efectivo');
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Error al procesar el pedido. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-2xl w-full relative animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {cart.length === 0 ? (
                    <div className="text-center py-10">
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h3>
                        <p className="text-gray-500 mb-6 text-sm">Agrega productos para comenzar</p>
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-primary-blue to-primary-red text-white px-8 py-2.5 rounded-full font-semibold shadow-md active:scale-95 transition-all text-sm"
                        >
                            Continuar Comprando
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                            <span className="text-primary-red">MI</span>
                            <span className="text-primary-blue">CARRITO</span>
                        </h2>

                        <div className="space-y-3 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-sm">
                                        <img
                                            src={item.images?.[0] || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{item.name}</h4>
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium opacity-70 mb-1">
                                            ${item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                                                ? item.wholesalePrice
                                                : item.price} c/u
                                        </p>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-800 text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-30 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col justify-between items-end min-w-[70px] sm:min-w-[90px]">
                                        <p className="font-bold text-base sm:text-lg text-primary-blue whitespace-nowrap">
                                            ${((item.wholesalePrice && item.quantity >= (item.wholesaleQuantity || 4)
                                                ? item.wholesalePrice
                                                : item.price) * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-primary-red text-[10px] sm:text-xs font-bold hover:underline transition-all mt-1 uppercase tracking-tighter"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Options */}
                        <div className="bg-blue-50/50 rounded-2xl p-4 mb-6 space-y-5 border border-blue-100">
                            <div>
                                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    Método de Entrega
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setDeliveryMethod('delivery')}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${deliveryMethod === 'delivery' ? 'bg-primary-blue text-white border-primary-blue shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        Envío a Domicilio
                                    </button>
                                    <button
                                        onClick={() => setDeliveryMethod('store')}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${deliveryMethod === 'store' ? 'bg-primary-blue text-white border-primary-blue shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        Recoger en Tienda
                                    </button>
                                </div>
                                {deliveryMethod === 'delivery' && (
                                    <p className="text-[10px] text-blue-600 mt-2 font-medium italic">
                                        * La tarifa de envío se calculará según tu Código Postal.
                                    </p>
                                )}
                            </div>

                            {/* Shipping Address Form */}
                            {deliveryMethod === 'delivery' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wider border-t border-blue-100 pt-3">Dirección de Envío</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2">
                                            <input
                                                type="text"
                                                name="street"
                                                placeholder="Calle"
                                                value={shippingAddress.street}
                                                onChange={handleAddressChange}
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="externalNumber"
                                                placeholder="N° Ext"
                                                value={shippingAddress.externalNumber}
                                                onChange={handleAddressChange}
                                                className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            name="neighborhood"
                                            placeholder="Colonia"
                                            value={shippingAddress.neighborhood}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                        <input
                                            type="text"
                                            name="zipCode"
                                            placeholder="C.P."
                                            value={shippingAddress.zipCode}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>

                                    {/* Shipping Options Display */}
                                    {isCalculatingShipping && (
                                        <div className="py-2 text-center">
                                            <div className="inline-flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Cotizando envíos...
                                            </div>
                                        </div>
                                    )}

                                    {!isCalculatingShipping && shippingOptions.length > 0 && (
                                        <div className="space-y-2 mt-2">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Opciones de Envío:</p>
                                            {shippingOptions.map((option) => (
                                                <div
                                                    key={option.id}
                                                    onClick={() => setSelectedShipping(option)}
                                                    className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${selectedShipping?.id === option.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-gray-700">{option.name}</span>
                                                        <span className="text-[10px] text-gray-500">{option.days}</span>
                                                    </div>
                                                    <span className={`text-xs font-bold ${option.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {option.price === 0 ? 'GRATIS' : `$${option.price.toFixed(2)}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1">
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Ciudad / Estado"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />
                                    </div>
                                    <textarea
                                        name="references"
                                        placeholder="Referencias (opcional: fachada, entre calles...)"
                                        value={shippingAddress.references}
                                        onChange={handleAddressChange}
                                        rows="2"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                                    ></textarea>
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Forma de Pago</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'card' ? 'bg-primary-red text-white border-primary-red shadow-md' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        Tarjeta (Online)
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('cash')}
                                        disabled={deliveryMethod === 'delivery'}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${paymentMethod === 'cash' ? 'bg-primary-red text-white border-primary-red shadow-md' : 'bg-white text-gray-600 border-gray-200 disabled:opacity-30'}`}
                                    >
                                        Efectivo (En Tienda)
                                    </button>
                                </div>
                                {deliveryMethod === 'delivery' && (
                                    <p className="text-[10px] text-gray-500 mt-1 italic">* El pago en efectivo solo está disponible para entrega en sucursal.</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-dashed pt-4">
                            <div className="space-y-1 mb-4 px-1">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                {deliveryMethod === 'delivery' && (
                                    <div className="flex justify-between items-center text-sm font-medium text-blue-600">
                                        <span>Envío:</span>
                                        <span>
                                            {selectedShipping
                                                ? (selectedShipping.price === 0 ? 'GRATIS' : `$${selectedShipping.price.toFixed(2)}`)
                                                : '--'}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 text-lg font-bold text-gray-700">
                                    <span>Total:</span>
                                    <span className="text-2xl font-black text-primary-blue">
                                        ${finalTotal.toFixed(2)}
                                    </span>
                                </div>
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

