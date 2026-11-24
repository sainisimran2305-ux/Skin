import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Key, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isOwner } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as admin/owner, direct to admin
  React.useEffect(() => {
    if (isOwner) {
      navigate('/admin');
    }
  }, [isOwner, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.role === 'owner') {
        navigate('/admin');
      } else {
        setError('Invalid administrator credentials. Access restricted to the store admin.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-2 border border-primary/20 shadow-sm">
            <Lock size={28} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary block">
            Store Management Portal
          </span>
          <h1 className="font-serif text-3xl font-semibold text-on-surface">
            Administrator Sign In
          </h1>
          <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
            Authorized management access for product prices, formulation catalog, and live order tracking.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/40 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2 border border-error/30 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sainisimran2304@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface focus:outline-none focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-on-primary hover:bg-tertiary text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-lift disabled:opacity-50"
            >
              <Key size={16} />
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate as Admin'}</span>
            </button>
          </form>
        </div>

        {/* Back to Customer Storefront */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-secondary hover:text-primary transition inline-flex items-center gap-1.5"
          >
            <span>Return to Customer Storefront</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
