import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function ShopPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    { id: 'all', label: 'Shop All' },
    { id: 'serums', label: 'Serums & Elixirs' },
    { id: 'cleansers', label: 'Cleansers' },
    { id: 'moisturizers', label: 'Moisturizers' },
    { id: 'toners', label: 'Toners & Mists' },
    { id: 'masks', label: 'Detox Masks' },
    { id: 'eye-care', label: 'Eye Care' },
  ];

  const skinTypes = [
    { id: 'all', label: 'All Skin Types' },
    { id: 'dry', label: 'Dry / Dehydrated' },
    { id: 'oily', label: 'Oily & Acne-Prone' },
    { id: 'sensitive', label: 'Sensitive' },
    { id: 'mature', label: 'Mature / Aging' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSkin = selectedSkinType === 'all' || p.skinType.includes(selectedSkinType);
      return matchCategory && matchSkin;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, selectedSkinType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Prakriti Botanical Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Pure Herbal Alchemy & Formulas
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Crafted in small micro-batches from organic, wild-harvested botanicals to elevate your daily skincare rituals.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-outline-variant/30">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams(cat.id === 'all' ? {} : { category: cat.id })}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition ${
              selectedCategory === cat.id
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
        {/* Skin Type Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-outline shrink-0">Filter Skin:</span>
          <select
            value={selectedSkinType}
            onChange={(e) => setSelectedSkinType(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-medium w-full sm:w-auto"
          >
            {skinTypes.map((st) => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-outline shrink-0">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary font-medium w-full sm:w-auto"
          >
            <option value="featured">Featured Remedies</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-2xl p-8 space-y-4">
          <p className="text-base text-on-surface-variant font-medium">
            No botanical formulas match the selected filters.
          </p>
          <button
            onClick={() => {
              setSearchParams({});
              setSelectedSkinType('all');
            }}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block"
          >
            Reset Catalog Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
