// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2phZiWGmGNqfo5XxlBg53oGxUNK6ttgo",
    authDomain: "papeleria-1x1-y-mas.firebaseapp.com",
    databaseURL: "https://papeleria-1x1-y-mas-default-rtdb.firebaseio.com",
    projectId: "papeleria-1x1-y-mas",
    storageBucket: "papeleria-1x1-y-mas.firebasestorage.app",
    messagingSenderId: "606203364469",
    appId: "1:606203364469:web:96d0c545282cc75251e43c",
    measurementId: "G-C7DCRY1JSB"
};

// Verificar que Firebase esté disponible globalmente
if (typeof firebase === 'undefined') {
    console.error('Firebase no está disponible. Asegúrate de que los scripts se carguen correctamente.');
}

// Initialize Firebase
let db, rtdb, storage;

function initializeFirebase() {
    try {
        // Verificar que Firebase esté disponible
        if (typeof firebase === 'undefined' || typeof firebase.initializeApp === 'undefined') {
            console.log('Firebase no está disponible aún. Esperando...');
            // Intentar de nuevo después de un breve delay (máximo 10 intentos)
            if (typeof initializeFirebase.attempts === 'undefined') {
                initializeFirebase.attempts = 0;
            }
            initializeFirebase.attempts++;
            if (initializeFirebase.attempts < 20) {
                setTimeout(initializeFirebase, 200);
            } else {
                alert('Error: Firebase no se pudo cargar después de varios intentos. Por favor verifica tu conexión a internet y recarga la página.');
            }
            return;
        }

        console.log('Inicializando Firebase...');
        console.log('Firebase disponible:', typeof firebase !== 'undefined');
        console.log('Firebase config:', { ...firebaseConfig, apiKey: firebaseConfig.apiKey ? '***' : 'NO DEFINIDA' });

        // Verificar si Firebase ya está inicializado
        if (!firebase.apps || firebase.apps.length === 0) {
            console.log('Inicializando nueva app de Firebase...');
            firebase.initializeApp(firebaseConfig);
        } else {
            console.log('Firebase ya estaba inicializado');
        }

        // Usar compat mode para Firestore, Database y Storage
        db = firebase.firestore();
        rtdb = firebase.database();
        storage = firebase.storage();

        console.log('Firebase inicializado correctamente');
        console.log('db:', db ? 'OK' : 'ERROR');
        console.log('rtdb:', rtdb ? 'OK' : 'ERROR');
        console.log('storage:', storage ? 'OK' : 'ERROR');

        // Verificar conexión a Firestore
        if (db) {
            db.enablePersistence().catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Persistencia fallida: múltiples pestañas abiertas');
                } else if (err.code == 'unimplemented') {
                    console.warn('Persistencia no disponible en este navegador');
                } else {
                    console.warn('Error en persistencia:', err);
                }
            });
        }
    } catch (error) {
        console.error('Error al inicializar Firebase:', error);
        console.error('Error stack:', error.stack);
        alert('Error al inicializar Firebase. Por favor recarga la página. Error: ' + error.message);
    }
}

// Inicializar Firebase cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    // Si el DOM ya está cargado, esperar un momento para que Firebase se cargue
    setTimeout(initializeFirebase, 100);
}

// Global State
let currentEditingProductId = null;
let productImages = [];
let currentPrimaryImageIndex = 0;

// Wait for DOM to be ready and Firebase to be initialized
function waitForFirebase() {
    if (typeof firebase === 'undefined' || !db) {
        console.log('Esperando a que Firebase se inicialice...');
        setTimeout(waitForFirebase, 100);
        return;
    }
    console.log('Firebase listo, inicializando app...');
    initializeApp();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        waitForFirebase();
    });
} else {
    waitForFirebase();
}

function initializeApp() {
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Products Management - Event Listeners
    const addProductBtn = document.getElementById('addProductBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const productForm = document.getElementById('productForm');
    const addUrlImageBtn = document.getElementById('addUrlImage');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            showProductForm();
        });
    }

    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', () => {
            hideProductForm();
            resetProductForm();
        });
    }

    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Formulario enviado, llamando a saveProduct...');
            try {
                await saveProduct();
            } catch (error) {
                console.error('Error en saveProduct:', error);
                alert('Error al guardar: ' + error.message);
            }
        });
    } else {
        console.error('No se encontró el formulario productForm');
    }

    // También agregar listener directo al botón por si acaso
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botón guardar clickeado directamente');
            const form = document.getElementById('productForm');
            if (form) {
                // Disparar el evento submit del formulario
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            } else {
                await saveProduct();
            }
        });
    }

    if (addUrlImageBtn) {
        addUrlImageBtn.addEventListener('click', () => {
            const urlInput = document.getElementById('imageUrl');
            if (!urlInput) {
                console.error('No se encontró el campo imageUrl');
                return;
            }

            const url = urlInput.value.trim();
            if (!url) {
                alert('Por favor ingresa una URL de imagen');
                return;
            }

            if (isValidImageUrl(url)) {
                addImageToPreview(url);
                urlInput.value = '';
            } else {
                alert('Por favor ingresa una URL válida de imagen (debe comenzar con http:// o https://)');
            }
        });
    }

    // Permitir agregar imagen con Enter en el campo URL
    const imageUrlInput = document.getElementById('imageUrl');
    if (imageUrlInput) {
        imageUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (addUrlImageBtn) {
                    addUrlImageBtn.click();
                }
            }
        });
    }

    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', () => {
            if (fileInput) {
                fileInput.click();
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);

            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    alert(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`);
                    continue;
                }
                if (!file.type.startsWith('image/')) {
                    alert(`El archivo ${file.name} no es una imagen válida.`);
                    continue;
                }

                // Mostrar preview temporal mientras se sube
                const reader = new FileReader();
                reader.onload = (event) => {
                    addImageToPreview(event.target.result, true); // true = es temporal
                };
                reader.readAsDataURL(file);

                // Subir a Firebase Storage
                try {
                    await uploadImageToStorage(file);
                } catch (error) {
                    console.error('Error al subir imagen:', error);
                    alert(`Error al subir ${file.name}. Por favor intenta de nuevo.`);
                    // Remover la imagen temporal del preview
                    const tempIndex = productImages.findIndex(img => img.startsWith('data:'));
                    if (tempIndex !== -1) {
                        removeImage(tempIndex);
                    }
                }
            }

            // Limpiar el input
            fileInput.value = '';
        });
    }

    // Initialize data
    loadProducts();
    loadStats();
    setupRealtimeStats();
    setupOrderFilters();
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Load data for the tab
    switch (tabName) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'stats':
            loadStats();
            break;
    }
}

function isValidImageUrl(url) {
    // Validar que sea una URL válida
    try {
        new URL(url);
    } catch (e) {
        return false;
    }

    // Verificar extensiones de imagen o si es una URL de imagen (puede no tener extensión)
    const imageExtensions = /\.(jpg|jpeg|png|webp|gif|svg|bmp)(\?.*)?$/i;
    const imagePatterns = [
        /\.(jpg|jpeg|png|webp|gif|svg|bmp)(\?.*)?$/i,
        /\/image\//i,
        /\/img\//i,
        /\.(jpg|jpeg|png|webp|gif)/i
    ];

    // Si tiene extensión de imagen, es válida
    if (imageExtensions.test(url)) {
        return true;
    }

    // Si no tiene extensión pero parece una URL de imagen, también aceptarla
    // (muchas APIs de imágenes no tienen extensión en la URL)
    return url.startsWith('http://') || url.startsWith('https://');
}

function addImageToPreview(imageUrl, isTemporary = false) {
    if (isTemporary) {
        // Si es temporal, reemplazar la última imagen temporal si existe
        const lastTempIndex = productImages.findLastIndex(img => img && img.startsWith('data:'));
        if (lastTempIndex !== -1) {
            productImages[lastTempIndex] = imageUrl;
        } else {
            productImages.push(imageUrl);
        }
    } else {
        productImages.push(imageUrl);
    }
    updateImagePreview();
}

// Función para subir imagen a Firebase Storage
async function uploadImageToStorage(file) {
    if (!storage) {
        throw new Error('Firebase Storage no está inicializado');
    }

    try {
        // Crear referencia única para la imagen
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `products/${timestamp}_${randomString}_${file.name}`;
        const storageRef = storage.ref().child(fileName);

        // Mostrar indicador de carga
        const container = document.getElementById('imagePreviewContainer');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'upload-loading';
        loadingIndicator.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.5); color: white; border-radius: 4px; margin: 5px 0;';
        loadingIndicator.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Subiendo ${file.name}...`;
        container.appendChild(loadingIndicator);

        // Subir el archivo
        const snapshot = await storageRef.put(file);

        // Obtener la URL de descarga pública
        const downloadURL = await snapshot.ref.getDownloadURL();

        // Remover el indicador de carga
        loadingIndicator.remove();

        // Reemplazar la imagen temporal (Data URL) con la URL pública
        const tempIndex = productImages.findLastIndex(img => img && img.startsWith('data:'));
        if (tempIndex !== -1) {
            productImages[tempIndex] = downloadURL;
        } else {
            productImages.push(downloadURL);
        }

        updateImagePreview();

        console.log('Imagen subida exitosamente:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error al subir imagen a Storage:', error);
        throw error;
    }
}

function removeImage(index) {
    productImages.splice(index, 1);
    if (currentPrimaryImageIndex >= productImages.length) {
        currentPrimaryImageIndex = 0;
    }
    updateImagePreview();
}

function setPrimaryImage(index) {
    currentPrimaryImageIndex = index;
    updateImagePreview();
}

function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';

    if (productImages.length === 0) {
        container.innerHTML = '<p style="color: #999;">No hay imágenes agregadas</p>';
        return;
    }

    productImages.forEach((imageUrl, index) => {
        const item = document.createElement('div');
        item.className = 'image-preview-item';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Imagen ${index + 1}`;

        const actions = document.createElement('div');
        actions.className = 'image-actions';

        if (index !== currentPrimaryImageIndex) {
            const setPrimaryBtn = document.createElement('button');
            setPrimaryBtn.innerHTML = '<i class="fas fa-star"></i>';
            setPrimaryBtn.title = 'Marcar como principal';
            setPrimaryBtn.onclick = () => setPrimaryImage(index);
            actions.appendChild(setPrimaryBtn);
        }

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.title = 'Eliminar';
        removeBtn.onclick = () => removeImage(index);
        actions.appendChild(removeBtn);

        if (index === currentPrimaryImageIndex) {
            const badge = document.createElement('span');
            badge.className = 'primary-badge';
            badge.textContent = 'Principal';
            item.appendChild(badge);
        }

        item.appendChild(img);
        item.appendChild(actions);
        container.appendChild(item);
    });
}

function showProductForm() {
    document.getElementById('productFormContainer').style.display = 'block';
    document.getElementById('addProductBtn').style.display = 'none';
}

function hideProductForm() {
    document.getElementById('productFormContainer').style.display = 'none';
    document.getElementById('addProductBtn').style.display = 'inline-flex';
}

function resetProductForm() {
    document.getElementById('productForm').reset();
    productImages = [];
    currentPrimaryImageIndex = 0;
    currentEditingProductId = null;
    updateImagePreview();
    document.getElementById('saveProductBtn').innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
}

async function saveProduct() {
    console.log('saveProduct llamado');

    // Verificar que Firebase esté inicializado
    if (!db) {
        alert('Error: Firebase no está inicializado. Por favor recarga la página.');
        console.error('db no está definido');
        return;
    }

    // Validar campos requeridos
    const nameInput = document.getElementById('productName');
    const descriptionInput = document.getElementById('productDescription');
    const priceInput = document.getElementById('productPrice');
    const wholesalePriceInput = document.getElementById('productWholesalePrice');
    const stockInput = document.getElementById('productStock');
    const categoryInput = document.getElementById('productCategory');

    if (!nameInput || !descriptionInput || !priceInput || !wholesalePriceInput || !stockInput || !categoryInput) {
        alert('Error: No se encontraron todos los campos del formulario');
        console.error('Campos faltantes:', { nameInput, descriptionInput, priceInput, wholesalePriceInput, stockInput, categoryInput });
        return;
    }

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const price = parseFloat(priceInput.value);
    const wholesalePrice = parseFloat(wholesalePriceInput.value);
    const stock = parseInt(stockInput.value);
    const category = categoryInput.value.trim();

    console.log('Valores del formulario:', { name, description, price, wholesalePrice, stock, category, imagesCount: productImages.length });

    if (!name) {
        alert('El nombre del producto es requerido');
        return;
    }

    if (!description) {
        alert('La descripción es requerida');
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert('El precio individual debe ser mayor a 0');
        return;
    }

    if (isNaN(wholesalePrice) || wholesalePrice <= 0) {
        alert('El precio mayoreo debe ser mayor a 0');
        return;
    }

    if (isNaN(stock) || stock < 0) {
        alert('El stock debe ser un número válido');
        return;
    }

    if (!category) {
        alert('La categoría es requerida');
        return;
    }

    if (productImages.length === 0) {
        alert('Debes agregar al menos una imagen');
        return;
    }

    const productData = {
        name: name,
        description: description,
        price: price,
        wholesalePrice: wholesalePrice,
        wholesaleQuantity: parseInt(document.getElementById('productWholesaleQuantity').value) || 4,
        stock: stock,
        category: category,
        brand: document.getElementById('productBrand').value.trim() || '',
        sku: document.getElementById('productSku').value.trim() || '',
        images: productImages,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Solo agregar createdAt si es un producto nuevo
    if (!currentEditingProductId) {
        productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    try {
        console.log('Preparando datos del producto:', productData);

        // Mostrar indicador de carga
        const saveBtn = document.getElementById('saveProductBtn');
        if (!saveBtn) {
            alert('Error: No se encontró el botón de guardar');
            return;
        }

        const originalBtnText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

        console.log('Guardando en Firebase...');

        if (currentEditingProductId) {
            console.log('Actualizando producto existente:', currentEditingProductId);
            await db.collection('products').doc(currentEditingProductId).update(productData);
            console.log('Producto actualizado exitosamente');
            alert('Producto actualizado correctamente');
        } else {
            console.log('Creando nuevo producto...');
            const docRef = await db.collection('products').add(productData);
            console.log('Producto agregado con ID:', docRef.id);
            alert('Producto agregado correctamente');
        }

        console.log('Limpiando formulario...');
        resetProductForm();
        hideProductForm();
        loadProducts();

        // Restaurar botón
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
        console.log('Proceso completado exitosamente');
    } catch (error) {
        console.error('Error completo al guardar producto:', error);
        console.error('Stack trace:', error.stack);
        const errorMsg = error.message || 'Error desconocido';
        alert('Error al guardar el producto: ' + errorMsg + '\n\nRevisa la consola para más detalles.');

        // Restaurar botón
        const saveBtn = document.getElementById('saveProductBtn');
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
        }
    }
}

async function loadProducts() {
    try {
        const snapshot = await db.collection('products').orderBy('category').get();
        const products = {};

        snapshot.forEach(doc => {
            const product = { id: doc.id, ...doc.data() };
            if (!products[product.category]) {
                products[product.category] = [];
            }
            products[product.category].push(product);
        });

        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function displayProducts(productsByCategory) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';

    Object.keys(productsByCategory).sort().forEach(category => {
        const categoryGroup = document.createElement('div');
        categoryGroup.className = 'category-group';

        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <h3>${category} (${productsByCategory[category].length})</h3>
            <i class="fas fa-chevron-down"></i>
        `;
        header.onclick = () => {
            const content = categoryGroup.querySelector('.category-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        };

        const content = document.createElement('div');
        content.className = 'category-content';

        productsByCategory[category].forEach(product => {
            const card = createProductCard(product);
            content.appendChild(card);
        });

        categoryGroup.appendChild(header);
        categoryGroup.appendChild(content);
        container.appendChild(categoryGroup);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <img src="${product.images?.[0] || '/placeholder.jpg'}" alt="${product.name}" class="product-card-image">
        <div class="product-card-info">
            <h4>${product.name}</h4>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Precio Individual:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Precio Mayoreo:</strong> $${product.wholesalePrice.toFixed(2)} (min. ${product.wholesaleQuantity})</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
        </div>
        <div class="product-card-actions">
            <button class="btn btn-primary" onclick="editProduct('${product.id}')">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;

    return card;
}

async function editProduct(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        if (!doc.exists) {
            alert('Producto no encontrado');
            return;
        }

        const product = doc.data();
        currentEditingProductId = productId;

        document.getElementById('productName').value = product.name || '';
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productPrice').value = product.price || '';
        document.getElementById('productWholesalePrice').value = product.wholesalePrice || '';
        document.getElementById('productWholesaleQuantity').value = product.wholesaleQuantity || 4;
        document.getElementById('productStock').value = product.stock || '';
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productSku').value = product.sku || '';

        productImages = product.images || [];
        currentPrimaryImageIndex = 0;
        updateImagePreview();

        document.getElementById('saveProductBtn').innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
        showProductForm();
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar el producto');
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
        return;
    }

    try {
        await db.collection('products').doc(productId).delete();
        alert('Producto eliminado correctamente');
        loadProducts();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
    }
}

// Orders Management
let allOrders = [];

async function loadOrders() {
    try {
        const snapshot = await rtdb.ref('orders').once('value');
        const ordersData = snapshot.val();

        if (!ordersData) {
            document.getElementById('ordersList').innerHTML = '<p>No hay pedidos</p>';
            allOrders = [];
            return;
        }

        allOrders = Object.keys(ordersData).map(key => ({
            id: key,
            ...ordersData[key]
        })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        applyOrderFilters();
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

function applyOrderFilters() {
    const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
    const paymentFilter = document.getElementById('orderPaymentFilter')?.value || '';

    let filtered = [...allOrders];

    if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter) {
        filtered = filtered.filter(order => order.paymentMethod === paymentFilter);
    }

    displayOrders(filtered);
}

function setupOrderFilters() {
    const statusFilter = document.getElementById('orderStatusFilter');
    const paymentFilter = document.getElementById('orderPaymentFilter');

    if (statusFilter) {
        statusFilter.addEventListener('change', applyOrderFilters);
    }

    if (paymentFilter) {
        paymentFilter.addEventListener('change', applyOrderFilters);
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    container.innerHTML = '';

    // Group by customer
    const ordersByCustomer = {};
    orders.forEach(order => {
        const customerKey = order.userInfo?.email || 'unknown';
        if (!ordersByCustomer[customerKey]) {
            ordersByCustomer[customerKey] = {
                customer: order.userInfo,
                orders: []
            };
        }
        ordersByCustomer[customerKey].orders.push(order);
    });

    Object.values(ordersByCustomer).forEach(({ customer, orders: customerOrders }) => {
        const group = document.createElement('div');
        group.className = 'customer-group';

        const header = document.createElement('div');
        header.className = 'customer-header';
        header.innerHTML = `
            <div>
                <h3>${customer?.fullName || 'Cliente'}</h3>
                <p>${customer?.email || ''} | ${customer?.phone || ''}</p>
            </div>
            <i class="fas fa-chevron-down"></i>
        `;

        const content = document.createElement('div');
        content.className = 'customer-orders';

        customerOrders.forEach(order => {
            const card = createOrderCard(order);
            content.appendChild(card);
        });

        header.onclick = () => {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        };

        group.appendChild(header);
        group.appendChild(content);
        container.appendChild(group);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';

    const statusClass = order.status || 'pending';
    const statusText = {
        'pending': 'Pendiente',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    }[statusClass] || 'Pendiente';

    const paymentMethod = order.paymentMethod === 'card' ? 'Tarjeta' : 'WhatsApp';
    const deliveryType = order.deliveryInfo?.type === 'pickup' ? 'Recoger en tienda' : 'Envío a domicilio';

    card.innerHTML = `
        <div class="order-header-info">
            <div>
                <h4>Pedido #${order.orderId?.substring(6) || order.id}</h4>
                <p>${new Date(order.timestamp).toLocaleString('es-ES')}</p>
            </div>
            <span class="order-status ${statusClass}">${statusText}</span>
        </div>
        <div class="order-items-list">
            ${order.items?.map(item => `
                <div class="order-item">
                    <img src="${item.images?.[0] || '/placeholder.jpg'}" alt="${item.name}" class="order-item-image">
                    <div>
                        <p><strong>${item.name}</strong></p>
                        <p>Cantidad: ${item.quantity} | Precio: $${item.unitPrice.toFixed(2)}</p>
                        <p>Subtotal: $${item.totalPrice.toFixed(2)}</p>
                    </div>
                </div>
            `).join('') || ''}
        </div>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
            <p><strong>Total: $${order.total?.toFixed(2)}</strong></p>
            <p>Método de pago: ${paymentMethod}</p>
            <p>Tipo de entrega: ${deliveryType}</p>
            ${order.deliveryInfo?.address ? `
                <p>Dirección: ${order.deliveryInfo.address.street || ''}, ${order.deliveryInfo.address.city || ''}, ${order.deliveryInfo.address.state || ''}</p>
            ` : ''}
        </div>
        <div class="order-actions">
            <button class="btn btn-primary" onclick="changeOrderStatus('${order.id}', '${order.status}')">
                <i class="fas fa-edit"></i> Cambiar Estado
            </button>
            <button class="btn btn-secondary" onclick="printOrderTicket('${order.id}')">
                <i class="fas fa-print"></i> Imprimir Ticket
            </button>
        </div>
    `;

    return card;
}

async function changeOrderStatus(orderId, currentStatus) {
    const statuses = ['pending', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
        await rtdb.ref(`orders/${orderId}`).update({
            status: nextStatus,
            updatedAt: Date.now()
        });
        loadOrders();
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        alert('Error al cambiar el estado del pedido');
    }
}

async function printOrderTicket(orderId) {
    try {
        const snapshot = await rtdb.ref(`orders/${orderId}`).once('value');
        const order = snapshot.val();

        if (!order) {
            alert('Pedido no encontrado');
            return;
        }

        const ticketContent = document.getElementById('ticketContent');
        ticketContent.innerHTML = `
            <h2>Un Mundo de Color</h2>
            <div class="ticket-info">
                <p><strong>Fecha:</strong> ${new Date(order.timestamp).toLocaleString('es-ES')}</p>
                <p><strong>Pedido #:</strong> ${order.orderId?.substring(6) || orderId}</p>
                <p><strong>Cliente:</strong> ${order.userInfo?.fullName || ''}</p>
                <p><strong>Email:</strong> ${order.userInfo?.email || ''}</p>
                <p><strong>Teléfono:</strong> ${order.userInfo?.phone || ''}</p>
            </div>
            <div class="ticket-items">
                <h3>Productos:</h3>
                ${order.items?.map(item => `
                    <div class="ticket-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${item.totalPrice.toFixed(2)}</span>
                    </div>
                `).join('') || ''}
            </div>
            <div class="ticket-total">
                <span>Total:</span>
                <span>$${order.total?.toFixed(2)}</span>
            </div>
        `;

        document.getElementById('ticketModal').style.display = 'flex';
    } catch (error) {
        console.error('Error al cargar ticket:', error);
        alert('Error al generar el ticket');
    }
}

function closeTicketModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

function printTicket() {
    window.print();
}

// Users Management
async function loadUsers() {
    try {
        const snapshot = await rtdb.ref('users').once('value');
        const usersData = snapshot.val();

        if (!usersData) {
            document.getElementById('usersList').innerHTML = '<p>No hay usuarios</p>';
            return;
        }

        const users = Object.keys(usersData).map(key => ({
            id: key,
            ...usersData[key]
        }));

        // Get orders for each user
        const ordersSnapshot = await rtdb.ref('orders').once('value');
        const ordersData = ordersSnapshot.val() || {};
        const orders = Object.values(ordersData);

        displayUsers(users, orders);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function displayUsers(users, orders) {
    const container = document.getElementById('usersList');
    container.innerHTML = '';

    users.forEach(user => {
        const userOrders = orders.filter(o => o.userId === user.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <h4>${user.fullName || 'Usuario'}</h4>
            <p><strong>Email:</strong> ${user.email || ''}</p>
            <p><strong>Teléfono:</strong> ${user.phone || ''}</p>
            <p><strong>Ubicación:</strong> ${user.location || ''}</p>
            <p><strong>Fecha de registro:</strong> ${new Date(user.createdAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Total de pedidos:</strong> ${userOrders.length}</p>
            <p><strong>Total gastado:</strong> $${totalSpent.toFixed(2)}</p>
        `;
        container.appendChild(card);
    });
}

// Stats Management
async function loadStats() {
    try {
        // Load all data
        const [productsSnapshot, ordersSnapshot, usersSnapshot] = await Promise.all([
            db.collection('products').get(),
            rtdb.ref('orders').once('value'),
            rtdb.ref('users').once('value')
        ]);

        const products = productsSnapshot.size;
        const ordersData = ordersSnapshot.val() || {};
        const orders = Object.values(ordersData);
        const users = Object.keys(usersSnapshot.val() || {}).length;

        const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const cardPayments = orders.filter(o => o.paymentMethod === 'card').length;
        const whatsappPayments = orders.filter(o => o.paymentMethod === 'whatsapp').length;
        const pickupOrders = orders.filter(o => o.deliveryInfo?.type === 'pickup').length;
        const deliveryOrders = orders.filter(o => o.deliveryInfo?.type === 'delivery').length;

        // Update stats
        document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('totalOrdersStat').textContent = orders.length;
        document.getElementById('totalCustomersStat').textContent = users;
        document.getElementById('totalProductsStat').textContent = products;

        // Update header stats
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalRevenue').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('totalUsers').textContent = users;

        // Create charts
        createSalesChart(orders);
        await createCategoryChart(orders);
        createTopProductsChart(orders);
        createPaymentMethodChart(cardPayments, whatsappPayments);
        createDeliveryChart(pickupOrders, deliveryOrders);
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

function createSalesChart(orders) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    // Group by month
    const monthlySales = {};
    orders.forEach(order => {
        const date = new Date(order.timestamp);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = 0;
        }
        monthlySales[monthKey] += order.total || 0;
    });

    const labels = Object.keys(monthlySales).sort();
    const data = labels.map(key => monthlySales[key]);

    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas',
                data: data,
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                }
            }
        }
    });
}

async function createCategoryChart(orders) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    try {
        // Fetch products to map items to categories
        const productsSnapshot = await db.collection('products').get();
        const productsMap = {};
        productsSnapshot.forEach(doc => {
            productsMap[doc.id] = doc.data();
        });

        // Calculate sales by category
        const categoryData = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                const product = productsMap[item.productId];
                if (product && product.category) {
                    const category = product.category;
                    categoryData[category] = (categoryData[category] || 0) + (item.totalPrice || 0);
                }
            });
        });

        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);

        // Generate colors for categories
        const colors = ['#1B3A6B', '#FFD700', '#2C5F8D', '#FFC700', '#25D366', '#FF6B6B', '#4ECDC4', '#95E1D3'];
        const backgroundColors = labels.map((_, index) => colors[index % colors.length]);

        if (ctx.chart) {
            ctx.chart.destroy();
        }

        ctx.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['Sin datos'],
                datasets: [{
                    data: data.length > 0 ? data : [1],
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' },
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al crear gráfico de categorías:', error);
    }
}

function createTopProductsChart(orders) {
    const ctx = document.getElementById('topProductsChart');
    if (!ctx) return;

    if (ctx.chart) {
        ctx.chart.destroy();
    }

    const productCounts = {};
    orders.forEach(order => {
        order.items?.forEach(item => {
            productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
        });
    });

    const sorted = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(([name]) => name),
            datasets: [{
                label: 'Cantidad vendida',
                data: sorted.map(([, count]) => count),
                backgroundColor: '#1B3A6B'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                }
            }
        }
    });
}

function createPaymentMethodChart(card, whatsapp) {
    const ctx = document.getElementById('paymentMethodChart');
    if (!ctx) return;

    if (ctx.chart) {
        ctx.chart.destroy();
    }

    ctx.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Tarjeta', 'WhatsApp'],
            datasets: [{
                data: [card, whatsapp],
                backgroundColor: ['#1B3A6B', '#25D366']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function createDeliveryChart(pickup, delivery) {
    // Check if chart canvas exists in HTML
    const canvas = document.getElementById('deliveryChart');
    if (!canvas) return;

    if (canvas.chart) {
        canvas.chart.destroy();
    }

    canvas.chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Recoger en tienda', 'Envío a domicilio'],
            datasets: [{
                data: [pickup, delivery],
                backgroundColor: ['#1B3A6B', '#FFD700']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

// Real-time updates for header stats
function setupRealtimeStats() {
    // Listen to orders changes
    rtdb.ref('orders').on('value', (snapshot) => {
        const ordersData = snapshot.val() || {};
        const orders = Object.values(ordersData);
        const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('totalRevenue').textContent = `$${totalSales.toFixed(2)}`;
    });

    // Listen to users changes
    rtdb.ref('users').on('value', (snapshot) => {
        const usersData = snapshot.val() || {};
        const usersCount = Object.keys(usersData).length;
        document.getElementById('totalUsers').textContent = usersCount;
    });
}

// Initialization is now handled in initializeApp() which is called on DOMContentLoaded

// Make functions global for onclick handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.changeOrderStatus = changeOrderStatus;
window.printOrderTicket = printOrderTicket;
window.closeTicketModal = closeTicketModal;
window.printTicket = printTicket;
