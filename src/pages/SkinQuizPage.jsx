import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function SkinQuizPage() {
  const { products } = useProducts();
  const [step, setStep] = useState(1);
  const [skinType, setSkinType] = useState('');
  const [goal, setGoal] = useState('');
  const [lifestyle, setLifestyle] = useState('');

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const skinTypeOptions = [
    { id: 'dry', title: 'Dry & Tight', desc: 'Skin feels dehydrated, flaky, or experiences rough patches.' },
    { id: 'oily', title: 'Oily & Blemish-Prone', desc: 'Excess sebum, visible pores, or frequent breakouts.' },
    { id: 'combination', title: 'Combination', desc: 'Oily T-zone (forehead, nose) with dry or normal cheeks.' },
    { id: 'sensitive', title: 'Sensitive & Reactive', desc: 'Prone to redness, stinging, or environmental reactions.' },
  ];

  const goalOptions = [
    { id: 'glow', title: 'Restore Natural Glow', desc: 'Fade dark spots, balance hyperpigmentation & boost radiance.' },
    { id: 'acne', title: 'Clear & Unclog Pores', desc: 'Calm active blemishes and regulate sebum production.' },
    { id: 'antiaging', title: 'Smooth Fine Lines & Hydrate', desc: 'Boost cellular elasticity and deeply nourish lipid layers.' },
    { id: 'calm', title: 'Soothe Redness & Calm Barrier', desc: 'Repair damaged moisture barrier with gentle botanicals.' },
  ];

  const lifestyleOptions = [
    { id: 'urban', title: 'Urban City Living', desc: 'Exposed to city smog, blue light screen strain & pollution.' },
    { id: 'sunny', title: 'Sunny Outdoor Climate', desc: 'High UV index exposure requiring strong antioxidant defense.' },
    { id: 'minimalist', title: 'Quick 2-Step Routine', desc: 'Prefer high-efficacy, streamlined daily skincare.' },
  ];

  // Calculate recommended products
  const recommendedBundle = products.filter(p => {
    if (skinType === 'oily' && p.id === 'sage-neem-cleanser') return true;
    if (goal === 'glow' && p.id === 'radiant-glow-serum') return true;
    if (skinType === 'dry' && p.id === 'rosehip-night-cream') return true;
    if (p.id === 'botanical-toning-mist') return true;
    return false;
  }).slice(0, 3);

  const bundleTotal = recommendedBundle.reduce((acc, p) => acc + p.price, 0);

  const handleAddBundleToCart = () => {
    recommendedBundle.forEach(item => addToCart(item, 1));
    navigate('/shop');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Sparkles size={14} /> 60-Second Personal Routine Quiz
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Discover Your Tailored Botanical Regimen
        </h1>
      </div>

      {/* Quiz Progress Stepper */}
      {step <= 3 && (
        <div className="flex items-center justify-between max-w-md mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-outline-variant/40 -z-0 -translate-y-1/2" />
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all ${
                step >= num
                  ? 'bg-primary text-on-primary shadow-md scale-110'
                  : 'bg-surface-container-high text-outline'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: SKIN TYPE */}
      {step === 1 && (
        <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Step 1 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              What best describes your skin type?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skinTypeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSkinType(opt.id)}
                className={`p-6 rounded-2xl text-left border transition-all ${
                  skinType === opt.id
                    ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary text-on-surface'
                }`}
              >
                <h3 className="font-serif font-semibold text-lg mb-1">{opt.title}</h3>
                <p className={`text-xs ${skinType === opt.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              disabled={!skinType}
              onClick={() => setStep(2)}
              className="bg-primary text-on-primary disabled:opacity-40 hover:bg-tertiary px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition"
            >
              <span>Next Question</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: GOALS */}
      {step === 2 && (
        <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Step 2 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              What is your primary skincare goal?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goalOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGoal(opt.id)}
                className={`p-6 rounded-2xl text-left border transition-all ${
                  goal === opt.id
                    ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary text-on-surface'
                }`}
              >
                <h3 className="font-serif font-semibold text-lg mb-1">{opt.title}</h3>
                <p className={`text-xs ${goal === opt.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold uppercase tracking-wider text-outline hover:text-on-surface px-4 py-2"
            >
              Back
            </button>
            <button
              disabled={!goal}
              onClick={() => setStep(3)}
              className="bg-primary text-on-primary disabled:opacity-40 hover:bg-tertiary px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition"
            >
              <span>Next Question</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: LIFESTYLE */}
      {step === 3 && (
        <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 space-y-8 animate-fadeIn">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Step 3 of 3</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
              What environment or routine best describes you?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {lifestyleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLifestyle(opt.id)}
                className={`p-6 rounded-2xl text-left border transition-all ${
                  lifestyle === opt.id
                    ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest border-outline-variant/50 hover:border-primary text-on-surface'
                }`}
              >
                <h3 className="font-serif font-semibold text-lg mb-1">{opt.title}</h3>
                <p className={`text-xs ${lifestyle === opt.id ? 'text-white/80' : 'text-on-surface-variant'}`}>{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold uppercase tracking-wider text-outline hover:text-on-surface px-4 py-2"
            >
              Back
            </button>
            <button
              disabled={!lifestyle}
              onClick={() => setStep(4)}
              className="bg-secondary text-white disabled:opacity-40 hover:bg-secondary/90 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition shadow-lg"
            >
              <span>Reveal Custom Regimen</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RECOMMENDATION RESULT */}
      {step === 4 && (
        <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-3xl border border-outline-variant/30 shadow-2xl space-y-8 animate-fadeIn">
          <div className="text-center space-y-3">
            <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block">
              Your Custom Botanical Regimen
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
              Tailored for {skinType.toUpperCase()} Skin
            </h2>
            <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
              Based on your answers, our herbal formulations target your exact skin lipid balance with cold-pressed antioxidants.
            </p>
          </div>

          {/* Bundle Products List */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-primary">Your 3-Step Daily Bundle:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedBundle.map((product, idx) => (
                <div key={product.id} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Step {idx + 1}</span>
                    <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-xl my-2" />
                    <h4 className="font-serif font-semibold text-base text-on-surface">{product.name}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">{product.subtitle}</p>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                    <span className="font-serif font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-outline">Full Size</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bundle Action */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-outline font-semibold uppercase tracking-wider block">Bundle Price (Save 15%):</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-primary">₹{(bundleTotal * 0.85).toLocaleString('en-IN')}</span>
                <span className="text-sm text-outline line-through">₹{bundleTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setStep(1)}
                className="p-3 text-outline hover:text-on-surface rounded-full border border-outline-variant"
                title="Retake Quiz"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={handleAddBundleToCart}
                className="bg-primary text-on-primary hover:bg-tertiary px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-lift w-full sm:w-auto"
              >
                <ShoppingBag size={18} />
                <span>Add Complete Bundle to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
