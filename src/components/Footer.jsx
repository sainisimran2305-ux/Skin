import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, RefreshCw, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-surface-container-high text-on-surface mt-20 border-t border-outline-variant/30">
      {/* Brand Values Banner */}
      <div className="border-b border-outline-variant/40 py-10 px-4 sm:px-8 bg-surface-container">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Leaf size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">100% Wild Harvested</h4>
              <p className="text-xs text-on-surface-variant">Sustainably sourced botanicals</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Dermatologist Verified</h4>
              <p className="text-xs text-on-surface-variant">Clean, toxin-free formulas</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Free Eco Shipping</h4>
              <p className="text-xs text-on-surface-variant">On all orders over ₹1,499</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">30-Day Ritual Guarantee</h4>
              <p className="text-xs text-on-surface-variant">Love it or easy return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand Bio */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-semibold tracking-tight text-primary">PRAKRITI</span>
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-semibold">Essential Botanical Skincare</p>
          </Link>
          <p className="text-sm text-on-surface-variant leading-relaxed pr-4">
            Prakriti bridges ancient herbal wisdom with modern cellular science. We cold-press wild-harvested botanicals into pure, potent skincare rituals for radiant natural health.
          </p>

          {/* Newsletter Box */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Join the Botanical Journal</h4>
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary-container/20 p-3 rounded-lg border border-primary/20">
                <CheckCircle2 size={18} /> Welcome to the Prakriti inner circle! Check your inbox for 15% off.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 text-sm w-full focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary hover:bg-tertiary px-5 py-2.5 rounded-lg font-medium text-sm transition flex items-center shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links Column 1 */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-primary mb-4">Shop Formulas</h4>
          <ul className="space-y-2.5 text-sm text-on-surface-variant">
            <li><Link to="/shop?category=serums" className="hover:text-primary transition">Face Serums & Elixirs</Link></li>
            <li><Link to="/shop?category=cleansers" className="hover:text-primary transition">Herbal Cleansers</Link></li>
            <li><Link to="/shop?category=moisturizers" className="hover:text-primary transition">Restorative Moisturisers</Link></li>
            <li><Link to="/shop?category=toners" className="hover:text-primary transition">Toning Essences</Link></li>
            <li><Link to="/shop?category=masks" className="hover:text-primary transition">Detoxifying Clay Masks</Link></li>
          </ul>
        </div>

        {/* Quick Links Column 2 */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-primary mb-4">Botanical Knowledge</h4>
          <ul className="space-y-2.5 text-sm text-on-surface-variant">
            <li><Link to="/botanical-origins" className="hover:text-primary transition">World Sourcing Map</Link></li>
            <li><Link to="/ingredients" className="hover:text-primary transition">Ingredients Encyclopedia</Link></li>
            <li><Link to="/skin-quiz" className="hover:text-primary transition">3-Step Routine Quiz</Link></li>
            <li><Link to="/rituals" className="hover:text-primary transition">AM/PM Skincare Tracker</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">Sustainable Farm Partners</Link></li>
          </ul>
        </div>

        {/* Quick Links Column 3 */}
        <div>
          <h4 className="font-serif text-lg font-semibold text-primary mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm text-on-surface-variant">
            <li><Link to="/orders" className="hover:text-primary transition">Track Live Order</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary transition">Saved Wishlist</Link></li>
            <li><Link to="/reviews" className="hover:text-primary transition">Verified Customer Reviews</Link></li>
            <li><a href="#faq" className="hover:text-primary transition">Shipping & Eco Packaging</a></li>
            <li><a href="#contact" className="hover:text-primary transition">Contact Botanical Care Team</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant/30 py-6 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-outline font-medium gap-4">
        <p>© {new Date().getFullYear()} Prakriti Natural Skincare Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition">Terms of Service</a>
          <a href="#" className="hover:text-primary transition">Sustainability Report</a>
        </div>
      </div>
    </footer>
  );
}
