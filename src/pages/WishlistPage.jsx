import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { products } = useProducts();

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Your Saved Botanical Formulas
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          My Wishlist ({wishlistedProducts.length})
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Keep track of your favorite organic serums, cleansers, and herbal remedies.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-surface-container-high text-secondary rounded-full flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h3 className="font-serif font-semibold text-xl text-on-surface">Your wishlist is empty</h3>
          <p className="text-xs text-on-surface-variant">
            Explore our botanical catalog and click the heart icon on any product to save it here.
          </p>
          <Link
            to="/shop"
            className="bg-primary text-on-primary hover:bg-tertiary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow"
          >
            <span>Browse Formulas</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
