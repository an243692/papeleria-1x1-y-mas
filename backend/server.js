require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Inicializar Firebase Admin
// SE ESPERA QUE LA VARIABLE DE ENTORNO FIREBASE_CREDENTIALS APUNTE AL ARCHIVO JSON
// O QUE EL USUARIO COLOQUE 'serviceAccountKey.json' EN LA RAIZ DEL BACKEND
// Inicializar Firebase Admin
try {
    let serviceAccount;
    if (process.env.FIREBASE_CREDENTIALS) {
        try {
            // Intenta parsear si es un string JSON directamente
            serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } catch (e) {
            // Si no es JSON, asume que es una ruta de archivo
            serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
        }
    } else {
        serviceAccount = require('./serviceAccountKey.json');
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://papeleria-1x1-y-mas-default-rtdb.firebaseio.com"
    });
} catch (error) {
    console.warn("Advertencia: No se pudo inicializar Firebase Admin automáticamente.");
    console.error(error);
}

const db = admin.firestore();
const rtdb = admin.database();

const app = express();

// Webhook de Stripe (debe ir antes de express.json() porque necesita el raw body)
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook Signature Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        console.log('Pago completado para orden:', orderId);

        if (orderId) {
            try {
                // Actualizar estado en Firebase Realtime Database
                await rtdb.ref(`orders/${orderId}`).update({
                    status: 'paid',
                    stripeSessionId: session.id,
                    paidAt: admin.database.ServerValue.TIMESTAMP,
                    paymentMethod: 'card'
                });
                console.log(`Orden ${orderId} marcada como pagada.`);
            } catch (e) {
                console.error("Error actualizando DB:", e);
            }
        }
    }

    res.json({ received: true });
});

// Middleware standard
app.use(helmet());
app.use(cors({ origin: true })); // Permitir todas las conexiones por ahora (dev)
app.use(express.json());

// Endpoints
app.get('/', (req, res) => {
    res.json({ message: "Servidor 1x1 y más - Activo" });
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, orderId, orderMetadata } = req.body;
        console.log("Recibida solicitud de checkout para orden:", orderId);
        console.log("Items recibidos:", JSON.stringify(items));

        // Save pending order to Realtime Database (RTDB) as a session attempt
        try {
            await rtdb.ref(`orders/${orderId}`).set({
                ...orderMetadata,
                status: 'checkout_session', // Hidden status for attempts
                timestamp: admin.database.ServerValue.TIMESTAMP
            });
        } catch (dbError) {
            console.error("Error saving pending order to RTDB:", dbError);
        }

        const lineItems = items.map(item => {
            const price = item.unitPrice || item.price;
            if (isNaN(price) || price === undefined) {
                console.error("Error: Precio inválido para el producto:", item.name, "Precio recibido:", price);
                throw new Error(`Precio inválido para el producto: ${item.name}`);
            }

            const imageUrl = item.imageUrl || (item.images && item.images[0]);

            return {
                price_data: {
                    currency: 'mxn',
                    product_data: {
                        name: item.name,
                        images: imageUrl ? [imageUrl] : [],
                    },
                    unit_amount: Math.round(price * 100), // Stripe uses cents
                },
                quantity: item.quantity,
            };
        });

        const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, '');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${clientUrl}/`,
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expirar en 30 minutos exactos
            metadata: {
                orderId: orderId
            },
        });

        if (!session.url) {
            throw new Error('Stripe no generó una URL de pago válida.');
        }

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error creando sesión:", error);
        res.status(500).json({ error: error.message });
    }
});

// Tarea de limpieza: Borrar pedidos 'checkout_session' mayores a 30 minutos
// Se ejecuta cada 10 minutos
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutos
setInterval(async () => {
    console.log('--- Iniciando limpieza de sesiones expiradas ---');
    try {
        const snapshot = await rtdb.ref('orders')
            .orderByChild('status')
            .equalTo('checkout_session')
            .once('value');

        const orders = snapshot.val();
        if (!orders) return;

        const now = Date.now();
        const thirtyMinutesAgo = now - (30 * 60 * 1000);
        let deletedCount = 0;

        for (const orderId in orders) {
            const order = orders[orderId];
            if (order.timestamp < thirtyMinutesAgo) {
                await rtdb.ref(`orders/${orderId}`).remove();
                deletedCount++;
            }
        }
        if (deletedCount > 0) console.log(`Limpieza completada: ${deletedCount} sesiones borradas.`);
    } catch (error) {
        console.error('Error en tarea de limpieza:', error);
    }
}, CLEANUP_INTERVAL);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
