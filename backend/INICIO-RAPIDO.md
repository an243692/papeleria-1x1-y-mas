# 🚀 INICIO RÁPIDO - Backend

## ✅ Cambios Implementados

### Sistema de Limpieza Automática
El backend ahora elimina automáticamente los pedidos abandonados de Stripe:

- ⏱️ **Tiempo de expiración**: 30 minutos
- 🔄 **Frecuencia de limpieza**: Cada 5 minutos
- 🎯 **Criterios de eliminación**:
  - Solo pedidos con `paymentMethod: 'card'`
  - Estado: `checkout_session` o `pending`
  - Antigüedad mayor a 30 minutos
- ✅ **Protección**: Los pedidos en efectivo/WhatsApp NUNCA se eliminan automáticamente

### Mejoras en el Código
- ✨ Logging mejorado con emojis para fácil identificación
- 📊 Información detallada de cada pedido eliminado (ID, estado, antigüedad)
- 🔍 Primera limpieza 10 segundos después de iniciar el servidor
- 🛡️ Validación robusta de tipos de datos

## 📋 Pasos para Iniciar el Backend

### 1️⃣ Configurar Variables de Entorno
Crea un archivo `.env` en `backend/` con:

```env
STRIPE_SECRET_KEY=sk_test_TU_CLAVE_AQUI
STRIPE_WEBHOOK_SECRET=whsec_TU_WEBHOOK_AQUI
CLIENT_URL=http://localhost:5173
PORT=3001
```

### 2️⃣ Configurar Firebase Admin
**Opción A** (Recomendada para desarrollo):
- Descarga `serviceAccountKey.json` desde Firebase Console
- Colócalo en la carpeta `backend/`

**Opción B** (Para producción):
- Agrega la credencial completa en `.env`:
  ```env
  FIREBASE_CREDENTIALS={"type":"service_account",...}
  ```

### 3️⃣ Instalar Dependencias
```bash
cd backend
npm install
```

### 4️⃣ Iniciar el Servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

## 📺 Logs Esperados

Al iniciar verás:
```
Servidor corriendo en puerto 3001
🚀 Iniciando sistema de limpieza automática de pedidos abandonados...
[14:00:00] 🧹 Iniciando limpieza de pedidos abandonados...
✓ No se encontraron pedidos abandonados para eliminar.
```

Cuando elimine pedidos:
```
[14:05:00] 🧹 Iniciando limpieza de pedidos abandonados...
  → Eliminando pedido abc123 (checkout_session, 35 min)
  → Eliminando pedido def456 (pending, 42 min)
✓ Limpieza completada: 2 pedido(s) abandonado(s) eliminado(s).
```

## 🔧 Solución de Problemas

### "Firebase Admin no inicializado"
- Verifica que `serviceAccountKey.json` exista en `backend/`
- O que `FIREBASE_CREDENTIALS` esté en `.env`

### "Stripe key inválida"
- Verifica que `STRIPE_SECRET_KEY` en `.env` sea correcta
- Debe empezar con `sk_test_` (desarrollo) o `sk_live_` (producción)

### "No se eliminan los pedidos"
- Verifica que el backend esté corriendo
- Revisa los logs cada 5 minutos
- Confirma que los pedidos tengan `paymentMethod: 'card'`

## 📞 Soporte
Si tienes problemas, revisa:
1. Los logs del servidor
2. Que todas las variables de entorno estén configuradas
3. Que Firebase esté correctamente inicializado
