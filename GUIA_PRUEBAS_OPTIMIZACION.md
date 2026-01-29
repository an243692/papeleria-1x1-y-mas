# 🧪 GUÍA DE PRUEBAS - VERIFICAR OPTIMIZACIONES

Esta guía te muestra **cómo verificar** que las optimizaciones de Firebase están funcionando correctamente.

---

## 📋 **CHECKLIST DE VERIFICACIÓN**

### ✅ **ANTES DE EMPEZAR**

- [ ] Frontend corriendo: `npm run dev` en `frontend/`
- [ ] Backend corriendo: `npm start` en `backend/`
- [ ] Navegador abierto en: http://localhost:5173
- [ ] Consola del navegador abierta (F12)

---

## 🧪 **PRUEBA 1: CACHÉ DE PRODUCTOS**

### **Objetivo:** Verificar que los productos se cachean por 5 minutos

### **Pasos:**

1. **Abrir la app** en http://localhost:5173
2. **Abrir consola** del navegador (F12)
3. **Buscar mensaje:**
   ```
   📥 Productos actualizados desde Firebase (150 lecturas)
   ```

4. **Refrescar página** (F5)
5. **Buscar mensaje:**
   ```
   📦 Productos desde caché (0 lecturas de Firebase)
   ```

### **Resultado Esperado:**

| Intento | Mensaje | Lecturas |
|---------|---------|----------|
| 1ra carga | "📥 Productos actualizados" | 150 |
| 2da carga | "📦 Productos desde caché" | 0 |
| 3ra carga | "📦 Productos desde caché" | 0 |

### **Verificación:**

✅ **ÉXITO:** Si ves "desde caché" en la 2da y 3ra carga  
❌ **FALLO:** Si siempre dice "actualizados desde Firebase"

### **Ahorro:**
- **Antes:** 150 lecturas por visita
- **Después:** 150 lecturas cada 5 minutos
- **Reducción:** 95%

---

## 🧪 **PRUEBA 2: QUERY INDEXADO (getUserOrders)**

### **Objetivo:** Verificar que solo lee órdenes del usuario (no todas)

### **IMPORTANTE:** Primero debes configurar índices en Firebase

#### **Configurar Índices (5 minutos):**

1. Ir a: https://console.firebase.google.com
2. Proyecto: `papeleria-1x1-y-mas`
3. **Realtime Database** → **Rules**
4. Copiar contenido de `database.rules.json`
5. Click en **"Publish"**
6. Confirmar cambios

### **Pasos de Prueba:**

1. **Iniciar sesión** en la app
2. **Abrir "Mis Pedidos"**
3. **Revisar consola** del navegador

### **Resultado Esperado:**

✅ **ÉXITO:** Las órdenes se cargan sin errores  
❌ **FALLO:** Error en consola: "index not defined"

### **Verificación en Firebase Console:**

1. Ir a: **Realtime Database** → **Usage**
2. Ver gráfica de **Reads**
3. Abrir "Mis Pedidos" varias veces
4. Ver que las lecturas NO aumentan mucho

### **Ahorro:**
- **Antes:** 1,000+ lecturas por usuario
- **Después:** 5-10 lecturas por usuario
- **Reducción:** 99%

---

## 🧪 **PRUEBA 3: PERSISTENCIA OFFLINE**

### **Objetivo:** Verificar que Firestore cachea datos localmente

### **Pasos:**

1. **Abrir consola** del navegador (F12)
2. **Buscar mensaje:**
   ```
   ✅ Persistencia offline de Firestore habilitada
   ```

3. **Abrir DevTools** → **Application** → **IndexedDB**
4. **Buscar:** `firebaseLocalStorageDb`

### **Resultado Esperado:**

✅ **ÉXITO:** Si ves la base de datos IndexedDB  
❌ **FALLO:** Si no existe o hay error

### **Verificación:**

- Cierra todas las pestañas de la app excepto una
- Refresca la página (F5)
- Debe decir: "✅ Persistencia offline habilitada"

### **Ahorro:**
- **Beneficio:** +10% adicional en lecturas repetidas
- **Funciona:** Solo en una pestaña a la vez

---

## 🧪 **PRUEBA 4: CLEANUP OPTIMIZADO**

### **Objetivo:** Verificar que el cleanup se ejecuta cada 30 min (no cada 5)

### **Pasos:**

1. **Revisar logs del backend**
2. **Buscar mensaje:**
   ```
   ⏱️  Frecuencia optimizada: cada 30 minutos
   ```

3. **Esperar 30 minutos**
4. **Buscar mensaje:**
   ```
   🧹 Iniciando limpieza de pedidos abandonados...
   ```

### **Resultado Esperado:**

✅ **ÉXITO:** Mensaje aparece cada 30 minutos  
❌ **FALLO:** Mensaje aparece cada 5 minutos

### **Ahorro:**
- **Antes:** 288 ejecuciones/día × 1,000 lecturas = 288,000 lecturas/día
- **Después:** 48 ejecuciones/día × 100 lecturas = 4,800 lecturas/día
- **Reducción:** 98%

---

## 📊 **PRUEBA 5: FIREBASE CONSOLE (Métricas Reales)**

### **Objetivo:** Ver el ahorro real en Firebase

### **Pasos:**

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com
   - Proyecto: `papeleria-1x1-y-mas`

2. **Ver Realtime Database:**
   - Click en **Realtime Database**
   - Click en **Usage**
   - Ver gráfica de **Reads**

3. **Ver Firestore:**
   - Click en **Firestore Database**
   - Click en **Usage**
   - Ver **Document reads**

### **Qué Esperar:**

**Realtime Database (antes):**
```
Lecturas/día: ~450,000
Lecturas/hora: ~18,750
```

**Realtime Database (después):**
```
Lecturas/día: ~13,000 (⬇️ 97%)
Lecturas/hora: ~540 (⬇️ 97%)
```

**Firestore (antes):**
```
Lecturas/día: ~100,000
Lecturas/hora: ~4,200
```

**Firestore (después):**
```
Lecturas/día: ~5,000 (⬇️ 95%)
Lecturas/hora: ~210 (⬇️ 95%)
```

### **Verificación:**

✅ **ÉXITO:** Gráfica muestra reducción en 24-48 horas  
⏱️ **ESPERA:** Los cambios tardan 1-2 horas en reflejarse

---

## 🧪 **PRUEBA RÁPIDA (Todo en Uno)**

### **Ejecutar Script de Prueba:**

1. **Abrir la app** en http://localhost:5173
2. **Abrir consola** del navegador (F12)
3. **Copiar y pegar** el contenido de `test-optimizations.js`
4. **Presionar Enter**

### **Resultado:**

El script ejecutará todas las pruebas automáticamente y mostrará:

```
🧪 INICIANDO PRUEBAS DE OPTIMIZACIÓN...

📦 PRUEBA 1: Caché de Productos
──────────────────────────────────────────────────
✅ CACHÉ FUNCIONANDO CORRECTAMENTE
   Ahorro: 150 lecturas evitadas

📋 PRUEBA 2: Query Indexado
──────────────────────────────────────────────────
✅ QUERY INDEXADO FUNCIONANDO CORRECTAMENTE
   Ahorro: ~990 lecturas

💾 PRUEBA 3: Persistencia Offline
──────────────────────────────────────────────────
✅ PERSISTENCIA HABILITADA

📊 RESUMEN DE OPTIMIZACIONES
==================================================
Caché de Productos        ✅ Activo
Query Indexado            ✅ Verificado
Persistencia Offline      ✅ Activo

🎉 PRUEBAS COMPLETADAS
```

---

## 📈 **MONITOREO CONTINUO**

### **Día 1 (Hoy):**
- [ ] Verificar mensajes de caché en consola
- [ ] Verificar que "Mis Pedidos" funciona
- [ ] Verificar logs del backend

### **Día 2 (Mañana):**
- [ ] Revisar Firebase Console → Usage
- [ ] Verificar reducción de lecturas
- [ ] Confirmar que no hay errores

### **Semana 1:**
- [ ] Revisar métricas semanales
- [ ] Confirmar ahorro de costos
- [ ] Documentar resultados

---

## ✅ **CHECKLIST FINAL**

- [ ] Caché de productos funciona (mensaje en consola)
- [ ] Query indexado funciona (sin errores)
- [ ] Persistencia offline habilitada (mensaje en consola)
- [ ] Cleanup cada 30 min (logs del backend)
- [ ] Índices configurados en Firebase Console
- [ ] Gráfica de Firebase muestra reducción (24-48h)

---

## 🎯 **MÉTRICAS DE ÉXITO**

| Métrica | Antes | Después | Meta |
|---------|-------|---------|------|
| Lecturas/día | 450,000 | 13,000 | ✅ <50,000 |
| Costo/mes | $7.20 | $0.00 | ✅ $0.00 |
| Tiempo carga | 2.5s | 0.5s | ✅ <1s |

---

## 🚨 **TROUBLESHOOTING**

### **Problema: No veo mensaje de caché**
**Solución:** Refresca la página (F5) dos veces

### **Problema: Error "index not defined"**
**Solución:** Configurar índices en Firebase Console

### **Problema: Persistencia no habilitada**
**Solución:** Cerrar otras pestañas de la app y refrescar

---

**Última actualización:** 27 de Enero 2026  
**Tiempo estimado de pruebas:** 15 minutos  
**Dificultad:** Baja
