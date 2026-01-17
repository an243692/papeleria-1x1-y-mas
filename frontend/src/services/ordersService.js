import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from './firebase';

export const createOrder = async (orderData) => {
    const ordersRef = ref(database, 'orders');
    const newOrderRef = push(ordersRef);
    const orderId = newOrderRef.key;

    await set(newOrderRef, {
        ...orderData,
        orderId,
        timestamp: Date.now(),
        status: 'pending'
    });

    return orderId;
};

export const getUserOrders = async (userId) => {
    const ordersRef = ref(database, 'orders');

    try {
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
            const allOrders = snapshot.val();
            return Object.values(allOrders)
                .filter(order => order.userId === userId && order.status !== 'checkout_session') // Filtrar por usuario y ocultar intentos
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        }
        return [];
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};
