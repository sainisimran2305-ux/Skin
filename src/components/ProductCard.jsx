import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="group bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/30 transition-lift flex flex-col justify-between h-full">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md text-on-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            isWishlisted
              ? 'bg-secondary text-white shadow-md'
              : 'bg-surface-container-lowest/80 text-on-surface hover:text-secondary'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="uppercase tracking-widest font-semibold text-secondary text-[11px]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-xs">
              <Star size={14} fill="currentColor" />
              <span>{product.rating}</span>
              <span className="text-outline text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="block group-hover:text-primary transition">
            <h3 className="font-serif font-semibold text-lg text-on-surface line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5 font-normal">
              {product.subtitle}
            </p>
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary font-serif">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="text-xs text-outline line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <span className="text-[11px] text-outline">{product.selectedVolume || '30ml'}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-primary text-on-primary hover:bg-tertiary px-3.5 py-2 rounded-lg font-medium text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <ShoppingBag size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
