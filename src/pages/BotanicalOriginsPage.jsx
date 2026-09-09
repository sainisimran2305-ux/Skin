import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Sparkles, ArrowRight, ShieldCheck, Leaf } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { INGREDIENTS as STATIC_INGREDIENTS } from '../data/ingredients';

export default function BotanicalOriginsPage() {
  const { ingredients } = useProducts();
  const activeIngredients = ingredients && ingredients.length > 0 ? ingredients : STATIC_INGREDIENTS;
  const [selectedIngredient, setSelectedIngredient] = useState(activeIngredients[0]);

  React.useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      setSelectedIngredient(ingredients[0]);
    }
  }, [ingredients]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-surface-container-low p-8 sm:p-14 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Global Sourcing Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Botanical Origins Sourcing Map
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Explore where Prakriti wild-harvests its active raw ingredients—from high-altitude Andean Rosehip to Himalayan Neem and Provencal Lavender.
        </p>
      </div>

      {/* Interactive Map Visual Section */}
      <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xl space-y-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* World Map Mock Illustration with Hotspots */}
          <div className="lg:w-7/12 relative aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/40 p-6 flex flex-col justify-between">
            
            {/* Background Graphic Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#bccca7_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="flex items-center gap-1.5"><Globe size={16} /> Global Sourcing Hotspots</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Interactive World Atlas</span>
            </div>

            {/* Clickable Map Hotspot Markers */}
            <div className="relative w-full h-full my-4">
              {/* Himalayas - Neem */}
              <button
                onClick={() => setSelectedIngredient(activeIngredients.find(i => i.id === 'neem'))}
                className={`absolute top-[35%] left-[68%] p-3 rounded-full transition-transform ${
                  selectedIngredient.id === 'neem' ? 'bg-primary text-white scale-125 shadow-lg ring-4 ring-primary/30' : 'bg-secondary text-white hover:scale-110'
                }`}
                title="Himalayas (Neem)"
              >
                <MapPin size={18} />
              </button>

              {/* Provence - Lavender */}
              <button
                onClick={() => setSelectedIngredient(activeIngredients.find(i => i.id === 'lavender'))}
                className={`absolute top-[32%] left-[46%] p-3 rounded-full transition-transform ${
                  selectedIngredient.id === 'lavender' ? 'bg-primary text-white scale-125 shadow-lg ring-4 ring-primary/30' : 'bg-secondary text-white hover:scale-110'
                }`}
                title="Provence (Lavender)"
              >
                <MapPin size={18} />
              </button>

              {/* Andes, Chile - Rosehip */}
              <button
                onClick={() => setSelectedIngredient(activeIngredients.find(i => i.id === 'rosehip'))}
                className={`absolute top-[75%] left-[28%] p-3 rounded-full transition-transform ${
                  selectedIngredient.id === 'rosehip' ? 'bg-primary text-white scale-125 shadow-lg ring-4 ring-primary/30' : 'bg-secondary text-white hover:scale-110'
                }`}
                title="Andes (Rosehip)"
              >
                <MapPin size={18} />
              </button>

              {/* Mediterranean - Sage */}
              <button
                onClick={() => setSelectedIngredient(activeIngredients.find(i => i.id === 'sage'))}
                className={`absolute top-[38%] left-[48%] p-3 rounded-full transition-transform ${
                  selectedIngredient.id === 'sage' ? 'bg-primary text-white scale-125 shadow-lg ring-4 ring-primary/30' : 'bg-secondary text-white hover:scale-110'
                }`}
                title="Mediterranean (Sage)"
              >
                <MapPin size={18} />
              </button>

              {/* Kerala - Turmeric */}
              <button
                onClick={() => setSelectedIngredient(activeIngredients.find(i => i.id === 'turmeric'))}
                className={`absolute top-[48%] left-[66%] p-3 rounded-full transition-transform ${
                  selectedIngredient.id === 'turmeric' ? 'bg-primary text-white scale-125 shadow-lg ring-4 ring-primary/30' : 'bg-secondary text-white hover:scale-110'
                }`}
                title="Kerala (Turmeric)"
              >
                <MapPin size={18} />
              </button>
            </div>

            <p className="text-[11px] text-outline text-center relative z-10">
              Click any pin on the map to inspect origin region, harvesting season, and cellular benefits.
            </p>
          </div>

          {/* Detailed Botanical Ingredient Card */}
          <div className="lg:w-5/12 bg-surface-container-low p-6 sm:p-8 rounded-2xl border border-outline-variant/30 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1">
                  <MapPin size={14} /> {selectedIngredient.originRegion}
                </span>
                <span className="text-[11px] font-serif italic text-outline">
                  {selectedIngredient.latinName}
                </span>
              </div>

              <div className="aspect-video rounded-xl overflow-hidden shadow">
                <img
                  src={selectedIngredient.image}
                  alt={selectedIngredient.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-serif text-2xl font-semibold text-primary">
                {selectedIngredient.name}
              </h3>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {selectedIngredient.description}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">Key Cellular Efficacy:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredient.benefits.map((b) => (
                    <span key={b} className="bg-surface-container-lowest text-primary text-xs font-medium px-3 py-1 rounded-full border border-outline-variant/40">
                      ✨ {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-outline font-semibold uppercase tracking-wider block mb-1">Recommended Skin Type:</span>
                <span className="text-xs font-medium text-on-surface bg-primary/10 px-3 py-1 rounded-lg inline-block">
                  {selectedIngredient.skinTypeSuitability}
                </span>
              </div>
            </div>

            <Link
              to="/ingredients"
              className="bg-primary text-on-primary hover:bg-tertiary w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <span>Explore Ingredients Encyclopedia</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>

      </div>

      {/* Ingredient Selector Pills */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-semibold text-primary text-center">
          Explore Botanical Hotspots
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {activeIngredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => setSelectedIngredient(ing)}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold transition flex items-center gap-2 border ${
                selectedIngredient.id === ing.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary'
              }`}
            >
              <Leaf size={14} className={selectedIngredient.id === ing.id ? 'text-white' : 'text-primary'} />
              <span>{ing.name}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
