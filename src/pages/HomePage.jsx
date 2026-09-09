import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Leaf, Shield, Globe, Award, Star, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-primary border border-outline-variant/40">
              <Sparkles size={14} className="text-secondary" />
              <span>Prakriti Essential Nature — 100% Organic</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-on-surface leading-[1.1]">
              Glow with the wisdom of <span className="italic text-primary font-normal">essential nature.</span>
            </h1>

            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl font-sans font-normal leading-relaxed">
              Cold-pressed Himalayan botanicals, wild-harvested rosehip, and Kashmir saffron distilled into pure, high-efficacy skincare rituals.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-primary text-on-primary hover:bg-tertiary px-8 py-4 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-lift uppercase tracking-wider font-semibold"
              >
                <span>Shop Botanical Formulas</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/skin-quiz"
                className="bg-surface-container-high text-primary hover:bg-surface-container-highest px-8 py-4 rounded-full font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition border border-outline-variant/50 uppercase tracking-wider font-semibold"
              >
                <Sparkles size={18} className="text-secondary" />
                <span>Take 3-Step Routine Quiz</span>
              </Link>
            </div>

            {/* Micro proof badges */}
            <div className="pt-8 border-t border-outline-variant/30 flex items-center gap-6 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={16} className="text-primary" />
                <span>100% Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={16} className="text-primary" />
                <span>No Parabens & Toxins</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={16} className="text-primary" />
                <span>Zero Carbon Footprint</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-container-lowest">
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
                  alt="Prakriti Botanical Serum"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Accent Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-outline-variant/40 flex items-center gap-3.5 max-w-xs">
                <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-on-surface">Vogue Eco Beauty Award</h4>
                  <p className="text-[11px] text-outline">Best Clean Skincare Elixir 2026</p>
                </div>
              </div>

              {/* Floating Accent Card 2 */}
              <div className="absolute -top-4 -right-4 bg-primary text-on-primary p-3 rounded-2xl shadow-lg text-center">
                <span className="font-serif text-2xl font-bold block">4.9★</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-90">1,200+ Reviews</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary block mb-1">
              Curated Potions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
              Featured Botanical Remedies
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-primary hover:text-tertiary font-semibold text-sm mt-4 sm:mt-0"
          >
            <span>View All Formulas</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ESSENTIAL NATURE PHILOSOPHY BANNER */}
      <section className="bg-surface-container-low py-20 px-4 sm:px-8 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
              alt="Fresh Botanical Herbs Sourcing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
              Our Ethos & Origin
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface leading-tight">
              Bridging Ancient Herbal Wisdom with Modern Cellular Science.
            </h2>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Every drop of Prakriti skincare is derived from hand-picked wild botanicals. We bypass synthetic fillers and heat processing, using low-temperature cold extraction to preserve 99.4% active phytonutrients.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <span className="font-serif text-3xl font-bold text-primary">100%</span>
                <h4 className="font-semibold text-sm text-on-surface">Cold-Pressed Oils</h4>
                <p className="text-xs text-outline">Preserving molecular potency without chemical solvents.</p>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-3xl font-bold text-primary">5 Countries</span>
                <h4 className="font-semibold text-sm text-on-surface">Ethical Sourcing</h4>
                <p className="text-xs text-outline">Direct fair-trade partnerships with organic growers.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/botanical-origins"
                className="bg-primary text-on-primary hover:bg-tertiary px-6 py-3 rounded-full font-medium text-sm inline-flex items-center gap-2 transition"
              >
                <Globe size={16} />
                <span>Explore Sourcing World Map</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SKIN QUIZ CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-primary text-on-primary rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <span className="bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Personalized Regimen Finder
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-medium leading-tight">
              Uncertain which herbal elixir matches your skin type?
            </h3>
            <p className="text-on-primary/80 text-sm sm:text-base">
              Take our 60-second interactive Skin Routine Quiz. Answer 3 quick questions about your skin type, primary goals, and lifestyle to receive a tailored botanical regimen.
            </p>
          </div>

          <div className="z-10 shrink-0">
            <Link
              to="/skin-quiz"
              className="bg-secondary text-white hover:bg-secondary/90 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-lift"
            >
              <Sparkles size={18} />
              <span>Start 3-Step Quiz</span>
            </Link>
          </div>

          {/* Decorative background glow circle */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-tertiary-container/30 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* CUSTOMER REVIEWS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
            Loved by Conscious Minds
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
            Real Skin Transformations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-600">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "The Radiant Glow Serum completely transformed my skin tone in 3 weeks! My hyperpigmentation from past breakouts cleared up effortlessly."
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-semibold text-sm text-on-surface">Elena Rostova</h4>
                <p className="text-xs text-outline">Verified Buyer — San Francisco, CA</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-600">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "Finally a cleanser that doesn't strip my sensitive skin. The Neem & Sage smell divine—like a luxury Himalayan spa in my bathroom."
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-semibold text-sm text-on-surface">Marcus Vance</h4>
                <p className="text-xs text-outline">Verified Buyer — Austin, TX</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-600">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "The Rosehip Night Cream is velvet perfection. I wake up with dewy, plump skin every single morning."
              </p>
            </div>
            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-semibold text-sm text-on-surface">Sophia Lin</h4>
                <p className="text-xs text-outline">Verified Buyer — Seattle, WA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
