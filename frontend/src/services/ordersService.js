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

// ✅ OPTIMIZACIÓN: Query indexado por userId
// ANTES: Lee TODAS las órdenes (1,000+) y filtra en memoria
// DESPUÉS: Lee SOLO las órdenes del usuario (5-10)
// AHORRO: 99% de reducción en lecturas
// 
// IMPORTANTE: Requiere índice en Firebase Realtime Database
// Ver instrucciones en PLAN_ACCION_INMEDIATO.md
export const getUserOrders = async (userId) => {
    const ordersRef = ref(database, 'orders');

    try {
        // ✅ Query indexado: solo lee órdenes del usuario
        const userOrdersQuery = query(
            ordersRef,
            orderByChild('userId'),
            equalTo(userId)
        );

        const snapshot = await get(userOrdersQuery);

        if (snapshot.exists()) {
            const userOrders = snapshot.val();

            // Filtrar y ordenar en memoria (operación barata)
            return Object.values(userOrders)
                .filter(order => order.status !== 'checkout_session') // Ocultar intentos de pago
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Más recientes primero
        }

        return [];
    } catch (error) {
        console.error("Error fetching user orders:", error);

        // Si el índice no existe, mostrar error claro
        if (error.message && error.message.includes('index')) {
            console.error(`
⚠️ ERROR: Índice no configurado en Firebase.

Solución:
1. Ir a Firebase Console → Realtime Database → Rules
2. Agregar índice:
{
  "rules": {
    "orders": {
      ".indexOn": ["userId", "timestamp", "status"]
    }
  }
}
3. Publicar reglas
            `);
        }

        return [];
    }
};
