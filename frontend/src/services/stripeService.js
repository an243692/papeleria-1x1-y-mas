const API_URL = 'http://localhost:4242'; // Adjust if backend runs on different port

export const createCheckoutSession = async (items, orderId, userInfo, userId) => {
    try {
        const response = await fetch(`${API_URL}/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, orderId, userInfo, userId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error("Error creating stripe session:", error);
        throw error;
    }
};

export const generateWhatsAppMessage = (orderData) => {
    let message = `*Nuevo Pedido #${orderData.orderId.slice(-6)}*\n\n`;
    message += `*Cliente:* ${orderData.userInfo.fullName}\n`;
    message += `*Dirección:* ${orderData.deliveryInfo.address.street || 'Recoger en tienda'}\n\n`;
    message += `*Productos:*\n`;

    orderData.items.forEach(item => {
        message += `- ${item.quantity}x ${item.name} ($${item.unitPrice})\n`;
    });

    message += `\n*Total:* $${orderData.total.toFixed(2)}`;

    return `https://wa.me/525631979145?text=${encodeURIComponent(message)}`;
};
