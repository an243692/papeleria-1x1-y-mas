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
    const q = query(ordersRef, orderByChild('userId'), equalTo(userId));

    try {
        const snapshot = await get(q);
        if (snapshot.exists()) {
            return Object.values(snapshot.val()).sort((a, b) => b.timestamp - a.timestamp);
        }
        return [];
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};
