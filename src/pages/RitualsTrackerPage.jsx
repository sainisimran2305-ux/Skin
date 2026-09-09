import React, { useState } from 'react';
import { Sun, Moon, CheckCircle2, Sparkles, Flame, Clock } from 'lucide-react';

export default function RitualsTrackerPage() {
  const [streak, setStreak] = useState(5);
  
  const [amSteps, setAmSteps] = useState([
    { id: 1, title: 'Purifying Sage & Neem Cleanser', desc: 'Massage 60s onto damp face, rinse lukewarm', done: true },
    { id: 2, title: 'Lavender & Wild Sage Toning Mist', desc: 'Mist 3 sprays to awaken & hydrate skin', done: true },
    { id: 3, title: 'Radiant Glow Face Serum', desc: 'Press 3 drops Kashmiri Saffron elixir into palms', done: true },
    { id: 4, title: 'Botanical Sun Drops', desc: 'Apply broad-spectrum organic UV shield', done: false },
  ]);

  const [pmSteps, setPmSteps] = useState([
    { id: 1, title: 'Herbal Oil Double Cleanse', desc: 'Dissolve makeup, city pollution & SPF', done: true },
    { id: 2, title: 'Botanical Toning Water', desc: 'Rebalance skin pH level', done: false },
    { id: 3, title: 'Cellular Renewal Night Cream', desc: 'Warm pea-sized Rosehip & Shorea balm', done: false },
    { id: 4, title: 'Bakuchiol Eye Concentrate', desc: 'Tap lightly around orbital bone', done: false },
  ]);

  const toggleAm = (id) => {
    setAmSteps(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const togglePm = (id) => {
    setPmSteps(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const amCompleted = amSteps.filter(s => s.done).length;
  const pmCompleted = pmSteps.filter(s => s.done).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Flame size={14} /> {streak} Day Skincare Ritual Streak
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Daily Skincare Ritual Tracker
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Consistency is the secret to cellular glow. Check off your daily morning and evening botanical steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* AM ROUTINE */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-2 text-amber-600 font-serif font-semibold text-xl">
              <Sun size={24} />
              <span>Morning Ritual</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
              {amCompleted}/{amSteps.length} Steps
            </span>
          </div>

          <div className="space-y-3">
            {amSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => toggleAm(step.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  step.done
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-surface-container-low border-outline-variant/40 hover:border-primary text-on-surface'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  step.done ? 'bg-primary text-white border-primary' : 'border-outline text-transparent'
                }`}>
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className={`font-serif font-semibold text-sm ${step.done ? 'line-through opacity-80' : ''}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PM ROUTINE */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div className="flex items-center gap-2 text-indigo-900 font-serif font-semibold text-xl">
              <Moon size={24} />
              <span>Evening Recovery</span>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-3 py-1 rounded-full">
              {pmCompleted}/{pmSteps.length} Steps
            </span>
          </div>

          <div className="space-y-3">
            {pmSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => togglePm(step.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  step.done
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-surface-container-low border-outline-variant/40 hover:border-primary text-on-surface'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  step.done ? 'bg-primary text-white border-primary' : 'border-outline text-transparent'
                }`}>
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h4 className={`font-serif font-semibold text-sm ${step.done ? 'line-through opacity-80' : ''}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
