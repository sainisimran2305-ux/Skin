import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ShieldCheck, Leaf, Truck, CheckCircle2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id) || products[0];

  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(product.id);

  const [selectedVolume, setSelectedVolume] = useState(product.volumeOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [activeImage, setActiveImage] = useState(product.image);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-outline flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition">Shop</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container border border-outline-variant/30 shadow-xl relative">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {[product.image, product.secondaryImage].map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition ${
                  activeImage === img ? 'border-primary shadow-md' : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Buying Options & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary block mb-1">
              {product.categoryLabel}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
              {product.name}
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              {product.subtitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 text-amber-600 font-semibold text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-on-surface text-xs font-bold">{product.rating}</span>
              <span className="text-outline text-xs font-normal">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-outline-variant/30">
            <span className="font-serif text-3xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-outline line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xs bg-primary-container text-on-primary-container font-semibold px-2.5 py-1 rounded-md">
              In Stock & Ready to Ship
            </span>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Volume / Size Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-outline block">
              Select Volume Size:
            </label>
            <div className="flex gap-3">
              {product.volumeOptions.map((vol) => (
                <button
                  key={vol}
                  onClick={() => setSelectedVolume(vol)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition border ${
                    selectedVolume === vol
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary'
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/30">
            <div className="flex gap-4">
              <div className="flex items-center border border-outline-variant rounded-full bg-surface-container-low px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-on-surface hover:text-primary"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 text-sm font-semibold text-on-surface">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 text-on-surface hover:text-primary"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity, selectedVolume)}
                className="flex-1 bg-primary text-on-primary hover:bg-tertiary px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-lift"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-full border transition ${
                  isWishlisted
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-outline-variant hover:border-secondary text-on-surface'
                }`}
                title="Save to Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Key Ingredient Chips */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Leaf size={14} /> Active Botanical Highlights
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.keyIngredients.map((ing) => (
                <span key={ing} className="bg-surface-container-lowest text-primary text-xs font-medium px-3 py-1 rounded-full border border-outline-variant/40">
                  🌱 {ing}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* TABS: Ingredients, How to Use, Sustainability */}
      <div className="bg-surface-container-low rounded-3xl p-8 sm:p-12 border border-outline-variant/30 space-y-8">
        <div className="flex border-b border-outline-variant/40 gap-8 overflow-x-auto">
          {['ingredients', 'usage', 'benefits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold uppercase tracking-wider border-b-2 transition ${
                activeTab === tab
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-outline hover:text-on-surface'
              }`}
            >
              {tab === 'ingredients' ? 'Full Ingredients' : tab === 'usage' ? 'Application Ritual' : 'Proven Benefits'}
            </button>
          ))}
        </div>

        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-primary">Key Botanicals & Cellular Efficacy</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Formulated without synthetic silicones, parabens, phthalates, artificial fragrance, or mineral oil. 100% natural, ethically harvested botanicals cold-pressed to preserve cellular integrity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {product.keyIngredients.map((ing) => (
                <div key={ing} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary shrink-0" />
                  <span className="font-semibold text-sm text-on-surface">{ing}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-primary">Recommended Skincare Ritual</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {product.usage}
            </p>
            <div className="bg-primary/5 p-4 rounded-xl text-xs font-semibold text-primary inline-block">
              🕒 Ideal Timing: {product.ritualTime}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-semibold text-primary">Skin Results & Clinical Efficacy</h3>
            <ul className="space-y-3">
              {product.benefits.map((b, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
