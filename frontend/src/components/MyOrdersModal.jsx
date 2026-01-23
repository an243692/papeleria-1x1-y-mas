import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/ordersService';

const MyOrdersModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Fecha desconocida';
        return new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(timestamp));
    };

    React.useEffect(() => {
        if (isOpen && user) {
            fetchOrders();
        }
    }, [isOpen, user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getUserOrders(user.uid);
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'paid':
                return { label: 'Pagado', color: 'text-blue-600 bg-blue-50', icon: <CheckCircle className="w-4 h-4" /> };
            case 'pending':
                return { label: 'Pendiente', color: 'text-amber-600 bg-amber-50', icon: <Clock className="w-4 h-4" /> };
            case 'completed':
                return { label: 'Completado', color: 'text-green-600 bg-green-50', icon: <CheckCircle className="w-4 h-4" /> };
            case 'cancelled':
                return { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: <XCircle className="w-4 h-4" /> };
            case 'shipped':
                return { label: 'Enviado', color: 'text-indigo-600 bg-indigo-50', icon: <Truck className="w-4 h-4" /> };
            default:
                return { label: status, color: 'text-gray-600 bg-gray-50', icon: <Package className="w-4 h-4" /> };
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl h-[92vh] sm:h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-300 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Mis Pedidos</h2>
                        <p className="text-sm text-gray-500">Historial de tus compras</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-blue/20 border-t-primary-blue"></div>
                            <p className="text-gray-500 font-medium">Cargando tus pedidos...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                <Package className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Aún no tienes pedidos</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    Cuando realices tu primera compra, aparecerá aquí para que puedas seguir su estado.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-primary-blue text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all"
                            >
                                Ir a la Tienda
                            </button>
                        </div>
                    ) : (
                        orders.map((order) => {
                            const status = getStatusInfo(order.status);
                            return (
                                <div key={order.id || order.orderId} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-blue-100 transition-colors group">
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary-blue">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Orden #{order.orderId?.slice(-6) || order.id?.slice(-6)}</p>
                                                <p className="text-sm font-bold text-gray-700">
                                                    {formatDate(order.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                            {status.icon}
                                            {status.label}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-50">
                                                <img
                                                    src={item.imageUrl || item.images?.[0] || '/placeholder.png'}
                                                    alt={item.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.quantity} x ${item.unitPrice || item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-1">
                                        <div className="text-gray-500 text-xs">
                                            {order.paymentMethod === 'card' ? '💳 Pago con tarjeta' : '💬 Pedido por WhatsApp'}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Total Pagado</p>
                                            <p className="text-lg font-black text-primary-blue">${order.total?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrdersModal;
