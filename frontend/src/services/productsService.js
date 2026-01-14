import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const getProducts = async () => {
    try {
        const productsRef = collection(db, 'products');
        // Default ordering by name or whatever is available, if createdAt doesn't exist it might filter out docs
        // Let's stick to no specific order or name for safety, or create specific index later
        const q = query(productsRef);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const searchProducts = (products, term) => {
    if (!term) return products;
    const lowerTerm = term.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowerTerm) ||
        product.category.toLowerCase().includes(lowerTerm)
    );
};

export const filterProducts = (products, filters) => {
    return products.filter(product => {
        // Price range
        if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;

        // Categories
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(product.category)) return false;
        }

        // Type (Wholesale)
        if (filters.type === 'wholesale') {
            if (!product.wholesalePrice || product.wholesalePrice >= product.price) return false;
        }

        return true;
    });
};
