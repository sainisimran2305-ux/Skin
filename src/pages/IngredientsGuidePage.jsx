import React, { useState } from 'react';
import { Search, Leaf, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

export default function IngredientsGuidePage() {
  const { ingredients } = useProducts();
  const [search, setSearch] = useState('');
  const [filterBenefit, setFilterBenefit] = useState('all');

  const filtered = ingredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.latinName.toLowerCase().includes(search.toLowerCase());
    const matchesBenefit = filterBenefit === 'all' || item.benefits.some(b => b.toLowerCase().includes(filterBenefit.toLowerCase()));
    return matchesSearch && matchesBenefit;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="bg-surface-container-low p-8 sm:p-14 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Botanical Science & Taxonomy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Botanical Ingredients Encyclopedia
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Discover the cellular properties, active plant compounds, and historical lineage behind every wild botanical in our formulations.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-outline" />
          <input
            type="text"
            placeholder="Search ingredient, benefit, or Latin name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-outline">Filter Benefit:</span>
          <select
            value={filterBenefit}
            onChange={(e) => setFilterBenefit(e.target.value)}
            className="bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-xs text-on-surface focus:outline-none focus:border-primary font-medium w-full sm:w-auto"
          >
            <option value="all">All Plant Benefits</option>
            <option value="antiseptic">Antiseptic & Clarifying</option>
            <option value="brighten">Brightening & Radiance</option>
            <option value="hydration">Deep Hydration & Soothing</option>
            <option value="inflammation">Anti-inflammatory</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 p-6 space-y-4 flex flex-col justify-between transition-lift"
          >
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-surface-container">
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[11px] font-serif italic text-secondary block">
                  {ingredient.latinName}
                </span>
                <h3 className="font-serif font-semibold text-xl text-on-surface">
                  {ingredient.name}
                </h3>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {ingredient.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-outline">Cellular Efficacy:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredient.benefits.map((b) => (
                    <span key={b} className="bg-surface-container-lowest text-primary text-[11px] font-semibold px-2.5 py-1 rounded-md border border-outline-variant/40">
                      🌿 {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-outline font-medium">
              <span>Origin: {ingredient.originRegion}</span>
              <span className="text-primary font-bold">100% Pure</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
