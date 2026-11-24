import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BotanicalOriginsPage from './pages/BotanicalOriginsPage';
import IngredientsGuidePage from './pages/IngredientsGuidePage';
import SkinQuizPage from './pages/SkinQuizPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import RitualsTrackerPage from './pages/RitualsTrackerPage';
import AboutUsPage from './pages/AboutUsPage';
import MyReviewsPage from './pages/MyReviewsPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AuthGatewayPage from './pages/AuthGatewayPage';
import FallingLeavesBackground from './components/FallingLeavesBackground';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';
import { ProductProvider } from './context/ProductContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // If user navigates explicitly to owner admin login
  if (location.pathname === '/admin/login') {
    return <AdminLoginPage />;
  }

  // Mandatory Authentication: Must sign in or sign up before checking any info on the website
  if (!isAuthenticated) {
    return <AuthGatewayPage />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface relative">
      {/* Soft falling botanical leaves transition in the background */}
      <FallingLeavesBackground />

      <div className="relative z-10">
        <Header onOpenSearch={() => setIsSearchOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/botanical-origins" element={<BotanicalOriginsPage />} />
            <Route path="/ingredients" element={<IngredientsGuidePage />} />
            <Route path="/skin-quiz" element={<SkinQuizPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/rituals" element={<RitualsTrackerPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/reviews" element={<MyReviewsPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminProductsPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
          </Routes>
        </main>
      </div>

      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <BrowserRouter>
                <ScrollToTop />
                <AppContent />
              </BrowserRouter>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
