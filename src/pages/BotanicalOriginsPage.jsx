import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Sparkles, ArrowRight, ShieldCheck, Leaf, Compass } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { INGREDIENTS as STATIC_INGREDIENTS } from '../data/ingredients';

export default function BotanicalOriginsPage() {
  const { ingredients } = useProducts();
  const activeIngredients = STATIC_INGREDIENTS && STATIC_INGREDIENTS.length > 0 ? STATIC_INGREDIENTS : (ingredients || []);
  const [selectedIngredient, setSelectedIngredient] = useState(activeIngredients[0] || {});

  React.useEffect(() => {
    if (activeIngredients && activeIngredients.length > 0) {
      // Default to Neem or Turmeric if available
      const defaultItem = activeIngredients.find(i => i.id === 'neem') || activeIngredients[0];
      setSelectedIngredient(defaultItem);
    }
  }, []);

  // Hotspots positioned specifically on the India botanical map
  const INDIA_HOTSPOTS = [
    {
      id: 'saffron',
      region: 'Kashmir Valley',
      botanical: 'Kashmiri Mongra Saffron',
      top: '8%',
      left: '36%',
      badge: 'GI-Tagged Saffron'
    },
    {
      id: 'neem',
      region: 'Himalayan Foothills',
      botanical: 'Organic Neem',
      top: '20%',
      left: '42%',
      badge: 'High-Altitude Harvest'
    },
    {
      id: 'aloe-vera',
      region: 'Thar Desert, Rajasthan',
      botanical: 'Organic Aloe Vera Filet',
      top: '36%',
      left: '26%',
      badge: 'Desert Succulent'
    },
    {
      id: 'damask-rose',
      region: 'Kannauj, Uttar Pradesh',
      botanical: 'Kannauj Damask Rose',
      top: '36%',
      left: '50%',
      badge: 'Deg-Bhapka Steam Still'
    },
    {
      id: 'sandalwood',
      region: 'Mysore, Karnataka',
      botanical: 'Mysore White Sandalwood',
      top: '76%',
      left: '38%',
      badge: 'Sacred Heartwood'
    },
    {
      id: 'turmeric',
      region: 'Western Ghats, Kerala',
      botanical: 'Golden Wild Turmeric',
      top: '85%',
      left: '34%',
      badge: 'Sun-Dried Rhizomes'
    },
    {
      id: 'centella',
      region: 'Nilgiri Biosphere, Tamil Nadu',
      botanical: 'Centella (Gotu Kola / Cica)',
      top: '80%',
      left: '43%',
      badge: 'Wetland Bio-Reserve'
    }
  ];

  // International wildcrafting partners
  const GLOBAL_PARTNERS = [
    { id: 'lavender', region: 'Provence, France', name: 'High-Altitude Lavender' },
    { id: 'rosehip', region: 'Patagonia, Chile', name: 'Wild Andean Rosehip' },
    { id: 'tea-tree', region: 'Australia', name: 'Australian Tea Tree' },
    { id: 'chamomile', region: 'Bavaria, Germany', name: 'Blue Chamomile' },
    { id: 'sage', region: 'Mediterranean', name: 'Wild Clary Sage' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16 animate-fadeIn">

      {/* Header Banner */}
      <div className="bg-surface-container-low p-8 sm:p-14 rounded-3xl border border-outline-variant/30 text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Indigenous Sourcing Transparency & Taxonomy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Botanical Origins Map of India
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Explore where Prakriti wild-harvests sacred Indian botanicals—from Kashmir's saffron fields and the Himalayan foothills to the Western Ghats and Mysore sandalwood groves.
        </p>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xl space-y-8">

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* India Botanical Map Visual Container */}
          <div className="lg:w-7/12 relative bg-surface-container/60 rounded-3xl overflow-hidden border border-outline-variant/40 p-4 sm:p-6 flex flex-col justify-between min-h-[580px]">

            {/* Background Map Grid & Subtle Radial Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#bccca7_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

            {/* Top Map Header Badge */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="flex items-center gap-2 bg-surface-container-lowest/90 px-3.5 py-1.5 rounded-full border border-outline-variant/40 shadow-sm backdrop-blur-sm">
                <Compass size={16} className="text-secondary" />
                <span>Sacred Terroirs of India</span>
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px]">
                Interactive Botanical Map
              </span>
            </div>

            {/* Central India Map Graphic with Sourcing Hotspot Pins */}
            <div className="relative w-full h-[460px] sm:h-[500px] flex items-center justify-center my-2">
              {/* India Vector Map Outline */}
              <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
                <img
                  src="/images/india.svg"
                  alt="Botanical Map of India"
                  className="max-h-full max-w-full object-contain filter drop-shadow-md opacity-85 select-none"
                />
              </div>

              {/* Interactive Sourcing Hotspot Pins placed on India's geographic regions */}
              {INDIA_HOTSPOTS.map((spot) => {
                const isSelected = selectedIngredient?.id === spot.id;
                const ingredientData = activeIngredients.find(i => i.id === spot.id);

                return (
                  <div
                    key={spot.id}
                    style={{ top: spot.top, left: spot.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                  >
                    {/* Animated Pulsing Ring */}
                    {isSelected && (
                      <span className="absolute -inset-2 rounded-full bg-primary/30 animate-ping pointer-events-none" />
                    )}

                    {/* Hotspot Pin Button */}
                    <button
                      type="button"
                      onClick={() => ingredientData && setSelectedIngredient(ingredientData)}
                      className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 shadow-lg ${isSelected
                          ? 'bg-primary text-white scale-125 ring-4 ring-primary/30 shadow-primary/40'
                          : 'bg-surface-container-lowest text-secondary hover:bg-secondary hover:text-white hover:scale-110 border border-outline-variant/60'
                        }`}
                      title={`${spot.botanical} (${spot.region})`}
                    >
                      <MapPin size={16} />
                    </button>

                    {/* Hotspot Floating Label */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap pointer-events-none transition-all duration-200 z-30 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 scale-95'
                        }`}
                    >
                      <div className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 border border-primary-container">
                        <span>{spot.botanical}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Caption Notice */}
            <div className="relative z-10 text-center space-y-2 pt-2 border-t border-outline-variant/30">
              <p className="text-[11px] text-outline font-medium">
                Click any regional pin above to inspect harvesting seasons, traditional Ayurvedic extraction, and cellular efficacy.
              </p>
            </div>
          </div>

          {/* Detailed Botanical Ingredient Inspector Card */}
          <div className="lg:w-5/12 bg-surface-container-low p-6 sm:p-8 rounded-3xl border border-outline-variant/30 space-y-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
                  <MapPin size={15} /> {selectedIngredient?.originRegion || 'Indian Terroir'}
                </span>
                <span className="text-xs font-serif italic text-outline">
                  {selectedIngredient?.latinName}
                </span>
              </div>

              {/* Ingredient Hero Image */}
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-surface-container relative group border border-outline-variant/40">
                <img
                  src={selectedIngredient?.image}
                  alt={selectedIngredient?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-outline-variant/40">
                  100% Pure Origin
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-semibold text-primary">
                  {selectedIngredient?.name}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2 font-sans">
                  {selectedIngredient?.description}
                </p>
              </div>

              {/* Key Cellular Benefits */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-outline">
                  Cellular Skin Efficacy:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIngredient?.benefits?.map((b) => (
                    <span
                      key={b}
                      className="bg-surface-container-lowest text-primary text-xs font-semibold px-3 py-1 rounded-lg border border-outline-variant/40 shadow-xs"
                    >
                      🌿 {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Skin Type */}
              {selectedIngredient?.skinTypeSuitability && (
                <div className="pt-2">
                  <span className="text-[11px] text-outline font-semibold uppercase tracking-wider block mb-1">
                    Formulated For Skin Types:
                  </span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg inline-block border border-primary/20">
                    {selectedIngredient.skinTypeSuitability}
                  </span>
                </div>
              )}
            </div>

            <Link
              to="/ingredients"
              className="bg-primary text-on-primary hover:bg-tertiary w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-lift mt-4"
            >
              <span>Explore Ingredients Encyclopedia</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>

      </div>

      {/* Global & Sourcing Explorer Pills */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-2xl font-semibold text-on-surface">
            Prakriti Botanical Sourcing Hotspots
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Select any raw botanical below to highlight its terroir on the map and view extraction specifications.
          </p>
        </div>

        {/* Indian Heritage Botanicals */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary block text-center">
            — Pure Indian Terroirs —
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {INDIA_HOTSPOTS.map((spot) => {
              const ing = activeIngredients.find(i => i.id === spot.id);
              if (!ing) return null;
              const isSelected = selectedIngredient?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => setSelectedIngredient(ing)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition flex items-center gap-2 border ${isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-md'
                      : 'bg-surface-container-low border-outline-variant text-on-surface hover:border-primary hover:bg-surface-container'
                    }`}
                >
                  <Leaf size={14} className={isSelected ? 'text-on-primary' : 'text-primary'} />
                  <span>{spot.botanical}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-outline'}`}>
                    {spot.region}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global Wildcrafting Sourcing */}
        <div className="space-y-2 pt-4">
          <span className="text-xs font-bold uppercase tracking-wider text-outline block text-center">
            — Global Botanical Partners —
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {GLOBAL_PARTNERS.map((glob) => {
              const ing = activeIngredients.find(i => i.id === glob.id);
              if (!ing) return null;
              const isSelected = selectedIngredient?.id === glob.id;

              return (
                <button
                  key={glob.id}
                  type="button"
                  onClick={() => setSelectedIngredient(ing)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-medium transition flex items-center gap-2 border ${isSelected
                      ? 'bg-secondary text-white border-secondary shadow-md'
                      : 'bg-surface-container-low border-outline-variant/60 text-on-surface-variant hover:border-secondary hover:bg-surface-container'
                    }`}
                >
                  <Globe size={14} className={isSelected ? 'text-white' : 'text-secondary'} />
                  <span>{glob.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-container text-outline'}`}>
                    {glob.region}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
