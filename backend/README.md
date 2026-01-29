# Backend - Papelería 1x1 y Más

## 🚀 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` en la raíz del backend con las siguientes variables:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
CLIENT_URL=http://localhost:5173
PORT=3001
```

### 3. Configurar Firebase Admin SDK
Tienes dos opciones:

**Opción A:** Archivo JSON (Desarrollo)
1. Descarga el archivo `serviceAccountKey.json` desde Firebase Console
2. Colócalo en la raíz del directorio `backend/`

**Opción B:** Variable de entorno (Producción)
Agrega al `.env`:
```env
FIREBASE_CREDENTIALS={"type":"service_account","project_id":"..."}
```

## 🏃 Ejecutar el servidor

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

## 🧹 Limpieza Automática de Pedidos

El servidor incluye un sistema automático que:
- **Elimina pedidos abandonados de Stripe** después de 30 minutos
- Solo elimina pedidos con `paymentMethod: 'card'` y estado `checkout_session` o `pending`
- **NO elimina pedidos en efectivo/WhatsApp** (estos permanecen como `pending` hasta ser procesados manualmente)
- Se ejecuta cada 5 minutos automáticamente
- Primera ejecución: 10 segundos después de iniciar el servidor

### Logs de limpieza
Verás mensajes como:
```
🚀 Iniciando sistema de limpieza automática de pedidos abandonados...
[13:55:40] 🧹 Iniciando limpieza de pedidos abandonados...
  → Eliminando pedido abc123 (checkout_session, 35 min)
✓ Limpieza completada: 1 pedido(s) abandonado(s) eliminado(s).
```

## 📡 Endpoints

### `POST /create-checkout-session`
Crea una sesión de pago con Stripe o registra un pedido en efectivo.

### `POST /stripe/webhook`
Webhook para recibir eventos de Stripe (pago completado, etc.)

## 🔒 Seguridad
- CORS habilitado
- Helmet para headers de seguridad
- Límite de payload: 50MB
- Validación de webhooks de Stripe

## 📝 Notas
- El servidor corre por defecto en el puerto **3001**
- Asegúrate de que Firebase esté correctamente configurado antes de iniciar
- Los pedidos en efectivo nunca se eliminan automáticamente
