import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles, Droplets, Sun, Wind, Sparkle, ShieldCheck, Heart } from 'lucide-react';
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
    { id: 'facewash', label: 'Face Wash' },
    { id: 'toners', label: 'Toner' },
    { id: 'serums', label: 'Serum' },
    { id: 'moisturizers', label: 'Moisturiser' },
    { id: 'sunscreens', label: 'Sunscreen' },
    { id: 'masks', label: 'De-Tan & Hydration Masks' },
    { id: 'bodywash', label: 'Body Wash' },
  ];

  const skinTypes = [
    { id: 'all', label: 'All Skin Types' },
    { id: 'oily', label: 'Oily & Acne-Prone' },
    { id: 'dry', label: 'Dry / Dehydrated' },
    { id: 'sensitive', label: 'Sensitive / Reactive' },
    { id: 'combination', label: 'Combination Skin' },
    { id: 'mature', label: 'Mature & Dull' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSkin =
        selectedSkinType === 'all' ||
        (Array.isArray(p.skinType) && p.skinType.includes(selectedSkinType)) ||
        (Array.isArray(p.skinType) && p.skinType.includes('all'));
      return matchCategory && matchSkin;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, selectedCategory, selectedSkinType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Prakriti Botanical Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Pure Herbal Alchemy & Targeted Formulas
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Crafted in small micro-batches from pure organic raw materials for every skin type. Complete your 5-step daily routine from purifying face washes to SPF shields and body rituals.
        </p>

        {/* Routine Steps Indicator */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-primary">
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40">Step 1: Face Wash</span>
          <span className="text-outline">→</span>
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40">Step 2: Toner</span>
          <span className="text-outline">→</span>
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40">Step 3: Serum</span>
          <span className="text-outline">→</span>
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40">Step 4: Moisturiser</span>
          <span className="text-outline">→</span>
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/40">Step 5: Sunscreen</span>
        </div>
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

      {/* Contextual Category Spotlight Banner */}
      {selectedCategory === 'facewash' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-primary animate-fadeIn">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-secondary">
              Formulation Formats For Every Skin Type:
            </span>
            <p className="text-on-surface-variant">
              Each face wash features a distinct texture format: <strong>Clarifying Gel Wash</strong> (Oily), <strong>Cream-to-Milk Wash</strong> (Dry), <strong>Micro-Cloud Foam</strong> (Sensitive), <strong>Balancing Gel</strong> (Combination), and <strong>Fruit Enzyme Wash</strong> (Dull/Mature).
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary text-white font-bold text-[11px] shrink-0 self-start sm:self-auto">
            pH 5.5 Balanced
          </span>
        </div>
      )}

      {selectedCategory === 'masks' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-secondary/10 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-secondary animate-fadeIn">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-primary">
              Targeted Mask Rituals:
            </span>
            <p className="text-on-surface-variant">
              Choose from <strong>Royal Wild Turmeric & Saffron De-Tan Masks</strong> to reverse deep sun tanning, or <strong>Tremella Snow Mushroom & Rose Jelly Masks</strong> for intense 72hr cellular hydration.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-secondary text-white font-bold text-[11px] shrink-0 self-start sm:self-auto">
            100% Non-Staining
          </span>
        </div>
      )}

      {selectedCategory === 'bodywash' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-tertiary animate-fadeIn">
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider block text-secondary">
              Specialized Botanical Body Cleansers:
            </span>
            <p className="text-on-surface-variant">
              Formulated with active raw materials for specific body skin concerns: <strong>Back Acne (Neem & Willow Bark)</strong>, <strong>Dry Flakes (Shea & Sweet Almond)</strong>, <strong>Sensitive/Eczema (Calendula & Oat)</strong>, <strong>Body De-Tan & KP (Wild Berry AHA)</strong>, <strong>Cedarwood Aromatherapy</strong>, and <strong>Coffee Detox</strong>.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary text-white font-bold text-[11px] shrink-0 self-start sm:self-auto">
            Sulfate-Free
          </span>
        </div>
      )}

      {/* Filter and Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30">
        
        {/* Skin Type Filter Buttons / Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter size={16} className="text-primary shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-outline shrink-0">Skin Type:</span>
          <select
            value={selectedSkinType}
            onChange={(e) => setSelectedSkinType(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary font-semibold w-full sm:w-auto"
          >
            {skinTypes.map((st) => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown & Results Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-outline font-semibold">
            {filteredProducts.length} Product{filteredProducts.length === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-primary shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary font-semibold"
            >
              <option value="featured">Featured Remedies</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-low rounded-3xl p-8 space-y-4 border border-outline-variant/30">
          <p className="text-base text-on-surface-variant font-medium">
            No botanical formulas match the selected filters.
          </p>
          <button
            onClick={() => {
              setSearchParams({});
              setSelectedSkinType('all');
            }}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block transition hover:bg-tertiary"
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
