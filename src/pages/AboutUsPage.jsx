import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="bg-surface-container-low p-8 sm:p-16 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Prakriti Heritage & Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-6xl font-medium text-on-surface">
          Essential Nature, Pure Efficacy
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto font-sans leading-relaxed">
          Founded on the principle that skin health thrives when aligned with nature's raw botanical intelligence.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
            Our Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-on-surface">
            Born in the Himalayan Foothills
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Prakriti began in a small micro-distillery in the foothills of Uttarakhand. Inspired by generational herbalists who understood the potency of wild-harvested Neem, Kashmiri Saffron, and mountain Rosehip, we set out to create skincare free from synthetic adulterations.
          </p>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Today, every single formula is cold-pressed at low temperatures, locking in fragile phytonutrients, vitamins, and antioxidants.
          </p>
        </div>

        <div className="lg:col-span-6 aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
            alt="Organic Botanical Farm"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 space-y-8">
        <h2 className="font-serif text-3xl font-semibold text-center text-primary">
          Our Four Botanical Pledges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <Leaf size={24} />
            </div>
            <h4 className="font-serif font-semibold text-base text-on-surface">100% Wild Harvested</h4>
            <p className="text-xs text-on-surface-variant">Sourced directly from native ecological habitats.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-serif font-semibold text-base text-on-surface">Zero Toxins & Fillers</h4>
            <p className="text-xs text-on-surface-variant">Free from silicones, parabens, and artificial colors.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <Heart size={24} />
            </div>
            <h4 className="font-serif font-semibold text-base text-on-surface">Leaping Bunny Certified</h4>
            <p className="text-xs text-on-surface-variant">100% cruelty-free and vegan formulation.</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 space-y-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h4 className="font-serif font-semibold text-base text-on-surface">Sustainable Glass</h4>
            <p className="text-xs text-on-surface-variant">Housed in recyclable violet glass jars to prevent UV decay.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
