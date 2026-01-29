# 🛡️ PROTECCIÓN CONTRA COSTOS INESPERADOS EN FIREBASE

## ⚠️ **PELIGRO: COSTOS DESCONTROLADOS**

Un error en el código puede generar **miles de dólares en minutos**:

```javascript
// ❌ PELIGRO: Esto puede costar $10,000+ en minutos
while(true) {
    await getDocs(collection(db, "products")); // 150 lecturas por iteración
}
```

**Resultado:** 150 lecturas × 1000 iteraciones/segundo = **150,000 lecturas/segundo** = **$$$$$**

---

## 🎯 **LÍMITES GRATUITOS DE FIREBASE**

### **Plan Spark (Gratis):**
| Servicio | Límite Diario | Límite Mensual |
|----------|---------------|----------------|
| **Firestore Lecturas** | 50,000 | 1,500,000 |
| **Firestore Escrituras** | 20,000 | 600,000 |
| **Realtime DB Lecturas** | 100 MB | 3 GB |
| **Realtime DB Escrituras** | 10 MB | 300 MB |
| **Storage** | 1 GB | 5 GB |

### **Plan Blaze (Pago):**
- ✅ Sin límites automáticos
- ⚠️ **PELIGRO:** Puedes gastar miles sin darte cuenta
- 💡 **SOLUCIÓN:** Configurar límites manualmente

---

## 🔧 **PASO 1: CONFIGURAR LÍMITES EN GOOGLE CLOUD**

### **A. Ir a Google Cloud Console**

1. **Abrir:** https://console.cloud.google.com/apis/api/firestore.googleapis.com/quotas?project=papeleria-1x1-y-mas

2. **Buscar:** "Cloud Firestore API"

3. **Click en:** "Quotas & System Limits"

### **B. Configurar Límites de Firestore**

#### **1. Límite de Lecturas Diarias:**

```
Quota: Read requests per day
Límite Recomendado: 60,000 (20% más que el límite gratis)
```

**Cómo configurar:**
1. Click en "Read requests per day"
2. Click en "EDIT QUOTAS"
3. Ingresar: `60000`
4. Justificación: "Protección contra bucles infinitos"
5. Click en "SUBMIT REQUEST"

#### **2. Límite de Escrituras Diarias:**

```
Quota: Write requests per day
Límite Recomendado: 25,000
```

#### **3. Límite de Lecturas por Minuto:**

```
Quota: Read requests per minute
Límite Recomendado: 1,000
```

**Esto previene:**
- ❌ Bucles infinitos
- ❌ Ataques DDoS
- ❌ Errores de código que generen miles de lecturas

---

## 🔧 **PASO 2: CONFIGURAR PRESUPUESTO EN GOOGLE CLOUD**

### **A. Crear Presupuesto**

1. **Ir a:** https://console.cloud.google.com/billing/budgets?project=papeleria-1x1-y-mas

2. **Click en:** "CREATE BUDGET"

3. **Configurar:**
   ```
   Nombre: Firebase Monthly Budget
   Proyectos: papeleria-1x1-y-mas
   Servicios: Todos
   Monto: $10 USD/mes
   ```

4. **Alertas:**
   - 50% del presupuesto ($5): Email de advertencia
   - 90% del presupuesto ($9): Email urgente
   - 100% del presupuesto ($10): Email crítico

### **B. Configurar Alertas por Email**

```
Email 1: tu-email@gmail.com
Email 2: email-backup@gmail.com (opcional)
```

---

## 🔧 **PASO 3: PROTECCIONES EN EL CÓDIGO**

### **A. Límite de Reintentos**

```javascript
// ✅ BUENO: Máximo 3 reintentos
async function fetchWithRetry(fn, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            return await fn();
        } catch (error) {
            retries++;
            if (retries >= maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
    }
}

// Uso
const products = await fetchWithRetry(() => getDocs(collection(db, "products")));
```

### **B. Timeout en Queries**

```javascript
// ✅ BUENO: Timeout de 10 segundos
async function queryWithTimeout(query, timeoutMs = 10000) {
    return Promise.race([
        getDocs(query),
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
        )
    ]);
}
```

### **C. Contador de Lecturas**

```javascript
// ✅ BUENO: Monitorear lecturas
let dailyReads = 0;
const MAX_DAILY_READS = 50000;

async function safeGetDocs(query) {
    if (dailyReads >= MAX_DAILY_READS) {
        throw new Error('Límite diario de lecturas alcanzado');
    }
    
    const snapshot = await getDocs(query);
    dailyReads += snapshot.size;
    
    console.log(`📊 Lecturas hoy: ${dailyReads}/${MAX_DAILY_READS}`);
    
    return snapshot;
}
```

---

## 🔧 **PASO 4: REGLAS DE SEGURIDAD FIRESTORE**

Crea el archivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Productos: Solo lectura pública
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Solo desde admin panel
    }
    
    // Carrusel: Solo lectura pública
    match /hero_carousel/{imageId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Promociones: Solo lectura pública
    match /promotions/{promoId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Reels: Solo lectura pública
    match /reels/{reelId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Límite de lecturas por usuario
    match /{document=**} {
      allow read: if request.time < timestamp.date(2026, 12, 31) 
                  && request.auth != null;
      allow write: if false;
    }
  }
}
```

**Publicar reglas:**
```bash
firebase deploy --only firestore:rules
```

---

## 📊 **PASO 5: MONITOREO EN TIEMPO REAL**

### **A. Dashboard de Firebase**

1. **Ir a:** https://console.firebase.google.com/project/papeleria-1x1-y-mas/usage

2. **Verificar diariamente:**
   - Lecturas de Firestore
   - Escrituras de Firestore
   - Lecturas de Realtime Database
   - Ancho de banda

### **B. Alertas Automáticas**

Crear archivo `monitoring.js` en backend:

```javascript
const admin = require('firebase-admin');

// Verificar uso cada hora
setInterval(async () => {
    try {
        const usage = await admin.firestore().getUsageStats();
        
        const dailyReads = usage.reads;
        const limit = 50000;
        const percentage = (dailyReads / limit) * 100;
        
        console.log(`📊 Uso de Firestore: ${dailyReads}/${limit} (${percentage.toFixed(1)}%)`);
        
        if (percentage > 80) {
            console.error('⚠️ ALERTA: Uso de Firestore al 80%');
            // Enviar email o notificación
        }
        
        if (percentage > 95) {
            console.error('🚨 CRÍTICO: Uso de Firestore al 95%');
            // Deshabilitar queries temporalmente
        }
    } catch (error) {
        console.error('Error verificando uso:', error);
    }
}, 3600000); // Cada hora
```

---

## 🚨 **PASO 6: PLAN DE EMERGENCIA**

### **Si detectas costos inesperados:**

#### **Opción 1: Deshabilitar Firebase (Inmediato)**

1. **Ir a:** https://console.firebase.google.com/project/papeleria-1x1-y-mas/settings/general

2. **Click en:** "Disable Firebase"

3. **Confirmar**

**Efecto:** Detiene TODAS las operaciones inmediatamente

#### **Opción 2: Cambiar a Plan Spark (Gratis)**

1. **Ir a:** https://console.firebase.google.com/project/papeleria-1x1-y-mas/usage/details

2. **Click en:** "Modify plan"

3. **Seleccionar:** "Spark (Free)"

**Efecto:** Límites automáticos, no más cargos

#### **Opción 3: Eliminar Tarjeta de Crédito**

1. **Ir a:** https://console.cloud.google.com/billing

2. **Click en:** "Payment methods"

3. **Eliminar tarjeta**

**Efecto:** No se pueden hacer más cargos

---

## ✅ **CHECKLIST DE PROTECCIÓN**

- [ ] Configurar límites en Google Cloud Quotas
- [ ] Crear presupuesto de $10 USD/mes
- [ ] Configurar alertas por email (50%, 90%, 100%)
- [ ] Publicar reglas de Firestore restrictivas
- [ ] Implementar límites de reintentos en código
- [ ] Agregar timeouts a queries
- [ ] Monitorear uso diariamente
- [ ] Tener plan de emergencia listo

---

## 📈 **ESTIMACIÓN DE COSTOS ACTUAL**

### **Con Lazy Loading (4 productos por categoría):**

```
Usuarios/día: 100
Productos mostrados inicialmente: 40
Lecturas por usuario: 40

Total lecturas/día: 100 × 40 = 4,000 lecturas
Costo: $0.00 (dentro del límite gratis)
```

### **Si todos hacen "Ver Más":**

```
Usuarios que expanden: 50
Productos totales: 150
Lecturas adicionales: 50 × 110 = 5,500

Total lecturas/día: 4,000 + 5,500 = 9,500 lecturas
Costo: $0.00 (dentro del límite gratis)
```

### **Límite de Seguridad:**

```
Máximo permitido: 50,000 lecturas/día
Uso actual: 9,500 lecturas/día
Margen de seguridad: 81% disponible ✅
```

---

## 🎯 **RECOMENDACIONES FINALES**

### **1. Mantente en Plan Spark (Gratis)**
- ✅ Límites automáticos
- ✅ Sin riesgo de cargos inesperados
- ✅ Suficiente para tu tráfico actual

### **2. Solo usa Plan Blaze si:**
- Tienes más de 1,000 usuarios/día
- Necesitas más de 50,000 lecturas/día
- Tienes presupuesto dedicado

### **3. Si usas Plan Blaze:**
- ✅ Configura límites ANTES de agregar tarjeta
- ✅ Presupuesto máximo de $10-20 USD/mes
- ✅ Alertas al 50%, 90%, 100%
- ✅ Revisa uso DIARIAMENTE

---

## 📞 **CONTACTOS DE EMERGENCIA**

**Soporte de Firebase:**
- https://firebase.google.com/support

**Soporte de Google Cloud:**
- https://cloud.google.com/support

**Reportar fraude/cargos inesperados:**
- https://support.google.com/cloud/contact/cloud_platform_billing

---

**Última actualización:** 27 de Enero 2026  
**Prioridad:** 🚨 CRÍTICA  
**Acción requerida:** Configurar límites HOY
