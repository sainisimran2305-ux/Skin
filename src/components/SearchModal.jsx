import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function SearchModal({ isOpen, onClose }) {
  const { products } = useProducts();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim() === '' ? [] : products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.keyIngredients.some(ing => ing.toLowerCase().includes(query.toLowerCase())) ||
    p.categoryLabel.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative max-w-2xl mx-auto bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex items-center gap-3">
          <Search size={22} className="text-primary" />
          <input
            type="text"
            autoFocus
            placeholder="Search serums, ingredients (Rosehip, Neem, Saffron), skin concerns..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base sm:text-lg bg-transparent border-none focus:outline-none text-on-surface placeholder:text-outline font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-outline hover:text-on-surface">
              <X size={18} />
            </button>
          )}
          <button onClick={onClose} className="text-xs font-semibold uppercase tracking-wider text-secondary px-2 py-1">
            Close
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        {query === '' && (
          <div className="p-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Sparkles size={14} /> Popular Botanical Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Rosehip', 'Saffron', 'Sage & Neem', 'Bakuchiol', 'Anti-aging', 'Hydration', 'Brightening'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="bg-surface-container-low hover:bg-primary hover:text-white text-on-surface-variant text-xs px-3.5 py-1.5 rounded-full font-medium transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query !== '' && (
          <div className="max-h-96 overflow-y-auto p-4 sm:p-6 space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-10 text-outline text-sm">
                No botanical formulas found for "{query}". Try searching for "serum", "cleaner", or "rosehip".
              </div>
            ) : (
              results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition group border border-transparent hover:border-outline-variant/30"
                >
                  <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-lg bg-surface-container shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{product.categoryLabel}</span>
                    <h4 className="font-serif font-semibold text-sm text-on-surface group-hover:text-primary transition">{product.name}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{product.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-primary">${product.price}</span>
                    <ArrowRight size={16} className="text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform ml-auto mt-1" />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
