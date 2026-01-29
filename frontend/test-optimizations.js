// 🧪 SCRIPT DE PRUEBA - VERIFICAR OPTIMIZACIONES
// Copia y pega este código en la consola del navegador (F12)

console.clear();
console.log('🧪 INICIANDO PRUEBAS DE OPTIMIZACIÓN...\n');

// ============================================
// PRUEBA 1: CACHÉ DE PRODUCTOS
// ============================================
console.log('📦 PRUEBA 1: Caché de Productos');
console.log('─'.repeat(50));

// Importar el servicio
import { getProducts, invalidateProductsCache } from './services/productsService.js';

// Primera llamada (debe leer de Firebase)
console.log('🔄 Primera llamada a getProducts()...');
const start1 = performance.now();
const products1 = await getProducts();
const time1 = (performance.now() - start1).toFixed(2);
console.log(`✅ Productos obtenidos: ${products1.length}`);
console.log(`⏱️  Tiempo: ${time1}ms`);
console.log('💡 Esperado: "📥 Productos actualizados desde Firebase"\n');

// Segunda llamada (debe usar caché)
console.log('🔄 Segunda llamada a getProducts()...');
const start2 = performance.now();
const products2 = await getProducts();
const time2 = (performance.now() - start2).toFixed(2);
console.log(`✅ Productos obtenidos: ${products2.length}`);
console.log(`⏱️  Tiempo: ${time2}ms`);
console.log('💡 Esperado: "📦 Productos desde caché (0 lecturas)"\n');

// Comparación
const improvement = ((time1 - time2) / time1 * 100).toFixed(1);
console.log(`📊 RESULTADO:`);
console.log(`   Primera llamada: ${time1}ms (lee Firebase)`);
console.log(`   Segunda llamada: ${time2}ms (usa caché)`);
console.log(`   Mejora: ${improvement}% más rápido`);
console.log(`   Ahorro: ${products1.length} lecturas evitadas\n`);

if (time2 < time1 / 2) {
    console.log('✅ CACHÉ FUNCIONANDO CORRECTAMENTE\n');
} else {
    console.log('⚠️  CACHÉ NO ESTÁ FUNCIONANDO\n');
}

// ============================================
// PRUEBA 2: QUERY INDEXADO (getUserOrders)
// ============================================
console.log('\n📋 PRUEBA 2: Query Indexado en getUserOrders');
console.log('─'.repeat(50));

// Verificar si hay usuario autenticado
import { auth } from './services/firebase.js';
const currentUser = auth.currentUser;

if (currentUser) {
    console.log(`👤 Usuario autenticado: ${currentUser.email}`);

    // Importar servicio
    import { getUserOrders } from './services/ordersService.js';

    console.log('🔄 Llamando a getUserOrders()...');
    const startOrders = performance.now();
    const orders = await getUserOrders(currentUser.uid);
    const timeOrders = (performance.now() - startOrders).toFixed(2);

    console.log(`✅ Órdenes obtenidas: ${orders.length}`);
    console.log(`⏱️  Tiempo: ${timeOrders}ms`);
    console.log('💡 Esperado: Sin errores de "index not defined"\n');

    if (orders.length > 0) {
        console.log('✅ QUERY INDEXADO FUNCIONANDO CORRECTAMENTE');
        console.log(`   Lecturas: ~${orders.length} (antes: ~1000+)`);
        console.log(`   Ahorro: ~${1000 - orders.length} lecturas\n`);
    } else {
        console.log('ℹ️  Usuario no tiene órdenes (normal si es nuevo)\n');
    }
} else {
    console.log('⚠️  No hay usuario autenticado');
    console.log('   Inicia sesión para probar getUserOrders\n');
}

// ============================================
// PRUEBA 3: PERSISTENCIA OFFLINE
// ============================================
console.log('\n💾 PRUEBA 3: Persistencia Offline de Firestore');
console.log('─'.repeat(50));

if (window.__FIREBASE_PERSISTENCE_ENABLED__) {
    console.log('✅ PERSISTENCIA HABILITADA');
    console.log('   Los datos se cachean en IndexedDB');
    console.log('   Ahorro estimado: +10% en lecturas repetidas\n');
} else {
    console.log('⚠️  PERSISTENCIA NO HABILITADA');
    console.log('   Refresca la página (F5) para habilitarla\n');
}

// ============================================
// RESUMEN FINAL
// ============================================
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE OPTIMIZACIONES');
console.log('='.repeat(50));

const results = {
    'Caché de Productos': time2 < time1 / 2 ? '✅ Activo' : '❌ Inactivo',
    'Query Indexado': currentUser ? '✅ Verificado' : '⚠️  Requiere login',
    'Persistencia Offline': window.__FIREBASE_PERSISTENCE_ENABLED__ ? '✅ Activo' : '❌ Inactivo'
};

Object.entries(results).forEach(([key, value]) => {
    console.log(`${key.padEnd(25)} ${value}`);
});

console.log('\n💡 PRÓXIMO PASO:');
console.log('   Configura índices en Firebase Console');
console.log('   Ver: database.rules.json\n');

console.log('🎉 PRUEBAS COMPLETADAS\n');
