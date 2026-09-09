import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    appliedDiscount,
    discountCode,
    setDiscountCode,
    applyCoupon,
    discountError,
    discountSuccess,
    shippingCost,
    freeShippingThreshold,
    total,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-2 text-primary font-serif font-semibold text-xl">
              <ShoppingBag size={22} />
              <span>Your Botanical Cart</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-sans font-medium">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-on-surface-variant hover:text-primary rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-primary/5 px-6 py-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2 text-xs text-on-surface font-medium mb-1.5">
              <Truck size={16} className="text-primary" />
              {remainingForFreeShipping <= 0 ? (
                <span className="text-primary font-bold">🎉 You unlocked Complimentary Eco Shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-secondary">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for free shipping
                </span>
              )}
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-surface-container-high text-primary rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="font-serif font-semibold text-lg text-on-surface">Your cart is currently empty</h3>
                <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                  Explore our cold-pressed serums, natural cleansers, and organic skincare remedies.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary text-on-primary hover:bg-tertiary px-6 py-2.5 rounded-full font-medium text-xs uppercase tracking-wider inline-block shadow"
                >
                  Explore Formulas
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedVolume}`}
                  className="flex gap-4 pb-6 border-b border-outline-variant/30 last:border-none"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-surface-container shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-semibold text-sm text-on-surface line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedVolume)}
                          className="text-outline hover:text-error transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                        Volume: {item.selectedVolume}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-outline-variant rounded-md bg-surface-container-low">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedVolume, item.quantity - 1)}
                          className="p-1 text-on-surface hover:text-primary transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-xs font-semibold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedVolume, item.quantity + 1)}
                          className="p-1 text-on-surface hover:text-primary transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-serif font-bold text-sm text-primary">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low space-y-4">
              
              {/* Promo Code Input */}
              <div className="space-y-1">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyCoupon(discountCode);
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-3 text-outline" />
                    <input
                      type="text"
                      placeholder="Promo Code (NATURAL10)"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-xs w-full focus:outline-none focus:border-primary text-on-surface uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-secondary text-white hover:bg-secondary/90 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider shrink-0 transition"
                  >
                    Apply
                  </button>
                </form>
                {discountSuccess && <p className="text-[11px] text-primary font-medium flex items-center gap-1"><Check size={12}/> {discountSuccess}</p>}
                {discountError && <p className="text-[11px] text-error font-medium">{discountError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/30">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-on-surface">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-primary font-medium">
                    <span>Discount ({(appliedDiscount * 100).toFixed(0)}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Eco Delivery</span>
                  <span>{shippingCost === 0 ? <strong className="text-primary uppercase">Free</strong> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-on-surface pt-2 border-t border-outline-variant/40">
                  <span>Estimated Total</span>
                  <span className="text-primary text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-on-primary hover:bg-tertiary py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-lift uppercase tracking-wider font-sans font-semibold"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
