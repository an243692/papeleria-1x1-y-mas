import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { db } from './services/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Context
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Components
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import CartModal from './components/CartModal';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Success from './pages/Success';
import BottomNav from './components/BottomNav';

const BACKEND_URL = 'https://papeleria-1x1-y-mas.onrender.com';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({});
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);

        // Extract unique categories from products
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) return false;
    }

    // Price filter
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;

    // Wholesale filter
    if (filters.type === 'wholesale' && !product.wholesalePrice) return false;

    return true;
  });

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen pt-[80px] flex flex-col">
            <Toaster position="bottom-right" />

            <Header
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
            />

            <FilterSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <Services onCategoryClick={(category) => {
                      setFilters({ ...filters, categories: [category] });
                      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                    }} />

                    {/* Catalog Section */}
                    <section id="catalog" className="container mx-auto px-4 sm:px-6 py-12">
                      <div className="text-center mb-12">
                        <h2 className="text-4xl font-secondary font-bold text-primary-blue drop-shadow-sm inline-block">
                          Nuestro Catálogo
                        </h2>
                        <div className="h-1 w-24 bg-primary-blue mx-auto mt-2 rounded-full"></div>
                      </div>

                      {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-xl text-gray-600">No se encontraron productos</p>
                        </div>
                      ) : (
                        <div className="space-y-12">
                          {/* Group products by category */}
                          {Object.entries(
                            filteredProducts.reduce((acc, product) => {
                              const category = product.category || 'Otros';
                              if (!acc[category]) acc[category] = [];
                              acc[category].push(product);
                              return acc;
                            }, {})
                          ).map(([category, items]) => (
                            <div key={category} className="space-y-6">
                              {/* Category Header */}
                              <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-bold text-primary-red uppercase tracking-wide">
                                  {category}
                                </h3>
                                <div className="h-px flex-gro bg-gray-200"></div>
                              </div>

                              {/* Products Grid for this category */}
                              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {items.map(product => (
                                  <ProductContainer
                                    key={product.id}
                                    product={product}
                                    onOpenDetail={setSelectedProduct}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  </>
                } />
                <Route path="/success" element={<Success />} />
                {/* Fallback to home for any other route like /cart */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <WhatsAppButton />

            {/* Modals */}
            <ProductDetailModal
              product={selectedProduct}
              isOpen={!!selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />

            <LoginModal
              isOpen={isLoginOpen}
              onClose={() => setIsLoginOpen(false)}
              onSwitchToRegister={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
            />

            <RegisterModal
              isOpen={isRegisterOpen}
              onClose={() => setIsRegisterOpen(false)}
              onSwitchToLogin={() => {
                setIsRegisterOpen(false);
                setIsLoginOpen(true);
              }}
            />

            <CartModal
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            <BottomNav
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onOpenLogin={() => setIsLoginOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
            />

          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// Wrapper to use the hook for the direct "Add" button
const ProductContainer = ({ product, onOpenDetail }) => {
  const { addToCart } = useCart();
  return (
    <ProductCard
      product={product}
      onOpenDetail={onOpenDetail}
      onAddToCart={() => addToCart(product)}
    />
  );
};

export default App;
