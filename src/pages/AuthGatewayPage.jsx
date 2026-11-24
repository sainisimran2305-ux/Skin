import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthGatewayPage() {
  const { login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupSkinType, setSignupSkinType] = useState('all');

  // Status & feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);
      if (!result.success) {
        setError(result.error || 'Failed to sign in. Please verify your email and password.');
      } else {
        setSuccessMsg(`Welcome, ${result.user.name}!`);
      }
    } catch (err) {
      setError('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        skinType: signupSkinType,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setSuccessMsg(`Account created successfully! Welcome to Prakriti, ${result.user.name}.`);
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-primary border border-outline-variant/40 shadow-sm">
            <Sparkles size={14} className="text-secondary" />
            <span>Prakriti Botanical Skincare</span>
          </div>

          <div className="pt-2">
            <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-primary block">
              PRAKRITI
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-secondary font-semibold -mt-1 block">
              Essential Botanicals
            </span>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto">
            Sign in to your member account or register to explore our wild-harvested botanical formulas and track your orders.
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/40 shadow-xl space-y-6">
          
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-surface-container rounded-2xl border border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'login'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'signup'
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Customer Account
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 border border-error/30 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-primary-container/20 text-primary text-xs flex items-center gap-2 border border-primary/30 animate-fadeIn font-semibold">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 1: SIGN IN                            */}
          {/* ========================================= */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={17} />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={17} />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-lift disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ========================================= */}
          {/* TAB 2: CREATE ACCOUNT (SIGN UP)           */}
          {/* ========================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={17} />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={17} />
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Password (minimum 4 characters) *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" size={17} />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Choose a secure password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Skin Type Preference
                </label>
                <select
                  value={signupSkinType}
                  onChange={(e) => setSignupSkinType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="all">All Skin Types</option>
                  <option value="dry">Dry / Dehydrated</option>
                  <option value="oily">Oily & Acne-Prone</option>
                  <option value="sensitive">Sensitive / Reactive</option>
                  <option value="combination">Combination Skin</option>
                  <option value="mature">Mature / Aging Skin</option>
                </select>
              </div>

              <div className="text-[11px] text-on-surface-variant flex items-start gap-2 pt-1">
                <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                <span>
                  Receive personalized botanical recommendations and track your orders.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-lift disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Sign Up & Enter'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Discrete Admin Portal Access Link */}
          <div className="pt-2 border-t border-outline-variant/30 text-center">
            <Link
              to="/admin/login"
              className="text-xs text-outline hover:text-primary transition inline-flex items-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-secondary" />
              <span>Store Administrator Login</span>
            </Link>
          </div>

        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-outline pt-2">
          <div className="flex flex-col items-center gap-1">
            <Leaf size={16} className="text-primary" />
            <span>100% Wild Harvested</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={16} className="text-secondary" />
            <span>Clean Formulations</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Lock size={16} className="text-tertiary" />
            <span>Secure Encryption</span>
          </div>
        </div>

      </div>
    </div>
  );
}
