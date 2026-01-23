# Plan de Proyecto - Papelería 1x1 y Mas
**Última actualización:** 21 de enero de 2026

---

## 📊 Estado Actual del Proyecto

### ✅ Completado

#### Frontend (Tienda de Usuario)
- [x] Hero section con carrusel dinámico conectado a Firebase
- [x] Footer con información de contacto y redes sociales
- [x] Integración con TikTok
- [x] Diseño responsive y moderno
- [x] Conexión a Firebase Firestore para productos
- [x] Sistema de carrito de compras
- [x] Checkout funcional

#### Admin Panel
- [x] Gestión de productos (CRUD completo)
- [x] Gestión de pedidos con filtros
- [x] Visualización de usuarios
- [x] Estadísticas en tiempo real
- [x] Diseño colorido y profesional con Bootstrap 5
- [x] Subida de imágenes por URL para productos
- [x] Sección de carrusel con gestión por URL

#### Backend
- [x] Firebase Firestore configurado
- [x] Firebase Realtime Database para pedidos
- [x] Firebase Authentication (básico)

---

## 🚧 En Progreso

### Subida de Archivos (Firebase Storage)
**Estado:** Configuración en proceso

**Pasos completados:**
1. ✅ Google Cloud SDK instalado
2. ✅ Autenticación con cuenta de Firebase
3. ✅ Proyecto seleccionado (papeleria-1x1-y-mas)

**Pendiente:**
- [ ] Activar Firebase Storage desde la consola
- [ ] Aplicar configuración CORS
- [ ] Restaurar funcionalidad de subir archivos en:
  - Productos (admin panel)
  - Carrusel (admin panel)

---

## 📝 Tareas Pendientes

### Alta Prioridad
1. **Activar Firebase Storage**
   - Ir a: https://console.firebase.google.com/project/papeleria-1x1-y-mas/storage
   - Hacer clic en "Comenzar"
   - Seleccionar ubicación (us-central1)
   - Confirmar

2. **Configurar CORS para Storage**
   ```powershell
   gsutil cors set cors.json gs://papeleria-1x1-y-mas.appspot.com
   ```

3. **Agregar sección de Carrusel al Admin Panel**
   - Archivo: `frontend/public/admin/admin.html`
   - Agregar tab "Carrusel" en sidebar
   - Crear formulario de gestión de imágenes
   - Implementar funciones en `admin.js`

4. **Habilitar subida de archivos**
   - Restaurar input de archivo en formulario de productos
   - Restaurar input de archivo en formulario de carrusel
   - Actualizar funciones de JavaScript para manejar uploads

### Prioridad Media
5. **Funcionalidad de Usuarios**
   - Implementar carga de usuarios desde Firebase Auth
   - Mostrar información detallada de cada usuario
   - Agregar filtros y búsqueda

6. **Optimizaciones**
   - Comprimir imágenes antes de subir
   - Implementar lazy loading
   - Mejorar tiempos de carga

### Prioridad Baja
7. **Features Adicionales**
   - Sistema de notificaciones
   - Reportes y analytics avanzados
   - Exportación de datos

---

## 🐛 Errores Conocidos

### Errores en Consola del Admin
```
- setupGlobalDelegation is not defined (RESUELTO parcialmente)
- loadStats: Cannot set properties of null
- displayUsers: Cannot set properties of null
- product1.png, product2.png... 404 (imágenes por defecto del carrusel)
```

**Causa:** Imágenes por defecto del carrusel guardadas con rutas locales que no existen.

**Solución:** Una vez activado Storage, eliminar imágenes por defecto y agregar nuevas desde URLs o archivos.

---

## 🔧 Configuración Técnica

### Firebase
- **Proyecto:** papeleria-1x1-y-mas
- **Cuenta:** papeleriayfomis1x1ymas@gmail.com
- **Servicios activos:**
  - ✅ Firestore Database
  - ✅ Realtime Database
  - ✅ Authentication
  - ⏳ Storage (pendiente activación)

### Estructura de Archivos
```
papeleria 1x1 y mas/
├── frontend/
│   ├── public/
│   │   └── admin/
│   │       ├── admin.html
│   │       ├── admin.js
│   │       └── admin.css
│   └── src/
│       └── components/
│           ├── Hero.jsx (carrusel dinámico)
│           ├── Footer.jsx
│           └── ...
├── backend/
└── cors.json (para configurar Storage)
```

---

## 📋 Próximos Pasos Inmediatos

1. **Activar Firebase Storage** (5 minutos)
2. **Aplicar CORS** (2 minutos)
3. **Agregar sección Carrusel al admin** (15 minutos)
4. **Probar subida de archivos** (10 minutos)
5. **Limpiar imágenes por defecto del carrusel** (5 minutos)

**Tiempo estimado total:** ~40 minutos

---

## 💡 Notas Importantes

- El admin panel está en `frontend/public/admin/` (no en carpeta `admin/` raíz)
- Las imágenes del carrusel se guardan en Firestore colección `hero_carousel`
- Los productos se guardan en Firestore colección `products`
- Los pedidos se guardan en Realtime Database en `orders/`

---

## 🎯 Objetivos a Largo Plazo

- [ ] Deploy a producción (Firebase Hosting)
- [ ] Configurar dominio personalizado
- [ ] Implementar sistema de cupones/descuentos
- [ ] Agregar sistema de inventario avanzado
- [ ] Integración con WhatsApp Business API
- [ ] App móvil (React Native)
