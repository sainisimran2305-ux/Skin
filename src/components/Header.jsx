import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Sparkles, User, MapPin, BookOpen, Clock, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Header({ onOpenSearch }) {
  const { totalItemCount, setIsCartOpen } = useCart();
  const { wishlistIds } = useWishlist();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'Botanical Origins', path: '/botanical-origins', icon: MapPin },
    { name: 'Ingredients Guide', path: '/ingredients', icon: BookOpen },
    { name: 'Skin Routine Quiz', path: '/skin-quiz', icon: Sparkles, highlight: true },
    { name: 'Daily Rituals', path: '/rituals', icon: Clock },
    { name: 'Our Story', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Announcement Bar */}
      <div className="bg-primary text-on-primary text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>✨ Complimentary wild-harvested botanical mini with orders over ₹1,499</span>
        <span className="hidden sm:inline opacity-70">|</span>
        <span className="hidden sm:inline bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold">Code: NATURAL10</span>
      </div>

      {/* Main Navbar */}
      <div className="glass-nav border-b border-outline-variant/30 px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-on-surface hover:text-primary transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="group flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-primary group-hover:text-tertiary transition">
                PRAKRITI
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-secondary font-semibold -mt-1">
                Essential Botanicals
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition flex items-center gap-1.5 py-1 border-b-2 ${
                    isActive(link.path)
                      ? 'text-primary border-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary border-transparent'
                  } ${link.highlight ? 'bg-surface-container-high text-primary px-3 py-1 rounded-full border-none font-semibold shadow-sm hover:bg-primary hover:text-white' : ''}`}
                >
                  {Icon && <Icon size={15} className={isActive(link.path) ? 'text-primary' : 'text-secondary'} />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition"
              title="Search Botanicals & Products"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition relative"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Account / Track Order Button */}
            <Link
              to="/orders"
              className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition hidden sm:flex"
              title="My Orders & Tracking"
            >
              <User size={20} />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-primary text-on-primary hover:bg-tertiary px-4 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 shadow-sm transition-lift"
              title="Open Cart"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline font-semibold">Cart</span>
              <span className="bg-primary-container text-on-primary-container text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItemCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant px-6 py-6 space-y-4 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-base font-medium py-2 px-3 rounded-lg ${
                  isActive(link.path)
                    ? 'bg-surface-container text-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {Icon && <Icon size={18} className="text-primary" />}
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-primary flex items-center gap-2"
            >
              <User size={16} /> My Account & Track Order
            </Link>
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-secondary"
            >
              Customer Reviews ⭐
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
