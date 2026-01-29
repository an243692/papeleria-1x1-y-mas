require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Inicializar Firebase Admin
// SE ESPERA QUE LA VARIABLE DE ENTORNO FIREBASE_CREDENTIALS APUNTE AL ARCHIVO JSON
// O QUE EL USUARIO COLOQUE 'serviceAccountKey.json' EN LA RAIZ DEL BACKEND
// Inicializar Firebase Admin (Con Fail-Safe para pruebas locales)
let db, rtdb;
try {
    let serviceAccount;
    // ... (Lógica de carga de credenciales existente) ...
    if (process.env.FIREBASE_CREDENTIALS) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } catch (e) {
            serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
        }
    } else {
        // Intento silencioso de cargar local
        try {
            serviceAccount = require('./serviceAccountKey.json');
        } catch (e) { throw new Error("No serviceAccountKey.json found"); }
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://papeleria-1x1-y-mas-default-rtdb.firebaseio.com"
        });
    }

    db = admin.firestore();
    rtdb = admin.database();
    console.log("✅ Firebase Admin inicializado correctamente.");

} catch (error) {
    console.warn("⚠️ ADVERTENCIA: No se pudo conectar a Firebase (¿Faltan credenciales?).");
    console.warn("   -> El servidor iniciará en MODO LIMITADO (Solo endpoints que no usen DB).");

    // Mocks para que no crashee al llamar a db/rtdb
    const mockDb = { ref: () => ({ set: async () => { }, update: async () => { }, remove: async () => { }, once: async () => ({ val: () => null }), orderByChild: () => ({ startAt: () => ({ once: async () => ({ val: () => null }) }) }) }) };
    db = mockDb; // Firestore mock simplificado si fuera necesario
    rtdb = mockDb;
}

// Variables db/rtdb ya inicializadas arriba

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
// Aumentar el límite a 50mb para evitar errores 413 (Payload Too Large)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Endpoints
app.get('/', (req, res) => {
    res.json({ message: "Servidor 1x1 y más - Activo" });
});

app.post('/calculate-shipping', async (req, res) => {
    const { zipCode, total } = req.body;

    // 1. SI TENEMOS API KEY DE SKYDROPX, USARLA REAL
    if (process.env.SKYDROPX_API_KEY) {
        try {
            console.log(`cotizando en Skydropx para CP: ${zipCode}`);
            const response = await fetch('https://api.skydropx.com/v1/quotations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token token=${process.env.SKYDROPX_API_KEY}`
                },
                body: JSON.stringify({
                    zip_to: zipCode,
                    zip_from: "06500", // TU CP DE ORIGEN (AJUSTAR SI ES OTRO)
                    parcel: {
                        weight: 1, // Peso promedio 1kg (puedes calcularlo real sumando items)
                        height: 10,
                        width: 10,
                        length: 10
                    }
                })
            });

            const data = await response.json();

            // Transformar respuesta de Skydropx a nuestro formato
            let realOptions = data.map(quote => ({
                id: quote.id,
                name: `${quote.provider} ${quote.service_level_name}`,
                price: parseFloat(quote.amount_local),
                days: `${quote.days} días`
            })).slice(0, 3); // Tomar solo las 3 mejores opciones

            // Aplicar regla de Envío Gratis si aplica
            if (parseFloat(total) >= 1500) {
                realOptions = [{
                    id: 'free_promo',
                    name: 'Envío GRATIS (Promoción)',
                    price: 0,
                    days: '3-5 días hábiles'
                }, ...realOptions];
            }

            return res.json({ options: realOptions });

        } catch (error) {
            console.error("Error Skydropx:", error);
            // Si falla, usar simulación (fallback)
        }
    }

    // 2. FALLBACK/SIMULACIÓN (Si no hay API Key o falló la red)
    let shippingOptions = [];
    const orderTotal = parseFloat(total) || 0;

    // Lógica 1: Envío Gratis si compra > $1500
    if (orderTotal >= 1500) {
        shippingOptions.push({
            id: 'free_shipping',
            name: 'Envío GRATIS (Promoción)',
            price: 0,
            days: '3-5 días hábiles'
        });

        shippingOptions.push({
            id: 'express_discounted',
            name: 'Express Prioritario',
            price: 99,
            days: '1-2 días hábiles'
        });
    } else {
        const isCDMX = zipCode && (zipCode.startsWith('0') || zipCode.startsWith('1'));

        if (isCDMX) {
            shippingOptions.push({
                id: 'local_standard',
                name: 'Envío Local CDMX (Estándar)',
                price: 89,
                days: '2-3 días hábiles'
            });
            shippingOptions.push({
                id: 'local_express',
                name: 'Entrega Express CDMX',
                price: 149,
                days: '24 horas'
            });
        } else {
            shippingOptions.push({
                id: 'national_standard',
                name: 'Envío Nacional Estándar',
                price: 180,
                days: '3-5 días hábiles'
            });
            shippingOptions.push({
                id: 'national_express',
                name: 'FedEx/DHL Express',
                price: 350,
                days: '1-2 días hábiles'
            });
        }
    }

    setTimeout(() => {
        res.json({ options: shippingOptions });
    }, 500);
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, orderId, orderMetadata, isCash } = req.body;
        console.log(`Recibida solicitud de ${isCash ? 'EFECTIVO' : 'TARJETA'} para orden:`, orderId);

        // Save status accordingly
        const initialStatus = isCash ? 'pending' : 'checkout_session';

        try {
            await rtdb.ref(`orders/${orderId}`).set({
                ...orderMetadata,
                status: initialStatus,
                timestamp: admin.database.ServerValue.TIMESTAMP
            });
        } catch (dbError) {
            console.error("Error saving order to RTDB:", dbError);
        }

        // If it's cash, we don't need Stripe
        if (isCash) {
            return res.json({ success: true, message: 'Orden en efectivo registrada' });
        }

        const lineItems = items.map(item => {
            const price = item.unitPrice || item.price;
            if (isNaN(price) || price === undefined) {
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
                    unit_amount: Math.round(price * 100),
                },
                quantity: item.quantity,
            };
        });

        const clientUrl = process.env.CLIENT_URL?.replace(/\/$/, '') || 'https://papeleria-1x1-y-mas.web.app';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${clientUrl}/`,
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
            metadata: {
                orderId: orderId
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error creando sesión:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ OPTIMIZACIÓN: Reducir frecuencia de limpieza de 5 min a 30 min
// ANTES: 288 ejecuciones/día × 1,000 lecturas = 288,000 lecturas/día
// DESPUÉS: 48 ejecuciones/día × 100 lecturas = 4,800 lecturas/día
// AHORRO: 98% de reducción en lecturas
const CLEANUP_INTERVAL = 30 * 60 * 1000; // ✅ 30 minutos (antes: 5 minutos)
const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutos

async function cleanupAbandonedOrders() {
    const now = Date.now();
    const expirationThreshold = now - EXPIRATION_TIME;
    const last24Hours = now - (24 * 60 * 60 * 1000);

    console.log(`[${new Date().toLocaleTimeString()}] 🧹 Iniciando limpieza de pedidos abandonados...`);

    try {
        // ✅ OPTIMIZACIÓN: Solo leer órdenes de las últimas 24 horas
        // En lugar de leer TODAS las órdenes (1,000+), solo lee las recientes (~100)
        const snapshot = await rtdb.ref('orders')
            .orderByChild('timestamp')
            .startAt(last24Hours)
            .once('value');

        const orders = snapshot.val();

        if (!orders) {
            console.log('✓ No hay pedidos recientes.');
            return;
        }

        let deletedCount = 0;

        for (const [orderId, order] of Object.entries(orders)) {
            // Solo eliminar pedidos de TARJETA que estén en estado checkout_session o pending
            const isCardOrder = order.paymentMethod === 'card';
            const isUnpaidStatus = ['checkout_session', 'pending'].includes(order.status);
            const hasTimestamp = order.timestamp && typeof order.timestamp === 'number';
            const isExpired = hasTimestamp && order.timestamp < expirationThreshold;

            if (isCardOrder && isUnpaidStatus && isExpired) {
                const orderAge = Math.floor((now - order.timestamp) / 60000); // minutos
                console.log(`  → Eliminando pedido ${orderId.slice(-6)} (${order.status}, ${orderAge} min)`);

                await rtdb.ref(`orders/${orderId}`).remove();
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            console.log(`✓ Limpieza completada: ${deletedCount} pedido(s) eliminado(s).`);
        } else {
            console.log('✓ No se encontraron pedidos abandonados.');
        }
    } catch (error) {
        console.error('❌ Error en tarea de limpieza:', error);
    }
}

// Ejecutar limpieza inmediatamente al iniciar el servidor
console.log('🚀 Iniciando sistema de limpieza automática de pedidos abandonados...');
console.log(`⏱️  Frecuencia optimizada: cada ${CLEANUP_INTERVAL / 60000} minutos`);
console.log(`⏱️  Expiración: ${EXPIRATION_TIME / 60000} minutos`);
setTimeout(cleanupAbandonedOrders, 10000); // Primera limpieza después de 10 segundos

// ✅ Ejecutar limpieza cada 30 minutos (antes: cada 5 minutos)
setInterval(cleanupAbandonedOrders, CLEANUP_INTERVAL);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`✅ Optimizaciones de Firebase activas`);
});
