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

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <ProductProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col justify-between bg-background text-on-surface">
              <div>
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
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/rituals" element={<RitualsTrackerPage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/reviews" element={<MyReviewsPage />} />
                  </Routes>
                </main>
              </div>

              <Footer />

              {/* Overlays */}
              <CartDrawer />
              <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            </div>
          </BrowserRouter>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  </ProductProvider>
  );
}
