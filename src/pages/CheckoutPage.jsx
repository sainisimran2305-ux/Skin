import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Truck, CreditCard, Banknote, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';

export default function CheckoutPage() {
  const { cartItems, total, subtotal, discountAmount, shippingCost, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'card'
  const [formData, setFormData] = useState({
    email: 'aria.sharma@example.in',
    fullName: 'Aria Sharma',
    address: '742 Botanical Avenue, Suite 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const createdOrder = placeOrder({
        items: cartItems,
        total: total,
        paymentMethod: paymentMethod,
        paymentMethodLabel: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Card / UPI',
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        }
      });
      clearCart();
      setIsSubmitting(false);
      setCompletedOrder(createdOrder);
    }, 1200);
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Thank you for choosing Prakriti. Your botanical remedies are being freshly formulated and packed in eco-friendly packaging.
        </p>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 text-left space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-outline-variant/30 pb-2 font-sans font-semibold">
            <span>Order Reference:</span>
            <span className="text-primary font-bold">{completedOrder.id}</span>
          </div>
          <div className="flex justify-between font-sans">
            <span>Payment Option:</span>
            <span className="text-secondary font-bold">{completedOrder.paymentMethodLabel}</span>
          </div>
          <div className="flex justify-between font-sans">
            <span>Tracking Number:</span>
            <span className="text-secondary">{completedOrder.trackingNumber}</span>
          </div>
          <div className="flex justify-between font-sans">
            <span>Est. Delivery:</span>
            <span>{completedOrder.estimatedDelivery}</span>
          </div>
          <div className="flex justify-between font-sans text-sm font-bold pt-2 border-t border-outline-variant/30">
            <span>Total Payable:</span>
            <span className="text-primary">₹{completedOrder.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/orders"
            className="bg-primary text-on-primary hover:bg-tertiary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow"
          >
            <Truck size={16} />
            <span>Track Order Status</span>
          </Link>
          <Link
            to="/shop"
            className="bg-surface-container-high text-on-surface hover:bg-surface-container-highest px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-xs text-outline">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      <div className="flex items-center gap-4">
        <Link to="/shop" className="p-2 text-outline hover:text-on-surface rounded-full border border-outline-variant">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-on-surface">
          Express Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
          
          {/* Contact Details */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
              <span>1. Contact Information</span>
            </h3>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Email Address</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
              <Truck size={18} />
              <span>2. Shipping Address (India)</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">State</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
              <CreditCard size={18} />
              <span>3. Payment Method</span>
            </h3>

            {/* Payment Options Toggle */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border flex items-center gap-3 text-left transition ${
                  paymentMethod === 'cod'
                    ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary text-on-surface'
                }`}
              >
                <Banknote size={24} className={paymentMethod === 'cod' ? 'text-white' : 'text-secondary'} />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider">Cash on Delivery</h4>
                  <p className={`text-[11px] ${paymentMethod === 'cod' ? 'text-white/80' : 'text-outline'}`}>Pay cash upon parcel delivery</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border flex items-center gap-3 text-left transition ${
                  paymentMethod === 'card'
                    ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/30'
                    : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary text-on-surface'
                }`}
              >
                <CreditCard size={24} className={paymentMethod === 'card' ? 'text-white' : 'text-secondary'} />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider">Online / Card / UPI</h4>
                  <p className={`text-[11px] ${paymentMethod === 'card' ? 'text-white/80' : 'text-outline'}`}>Instant digital payment</p>
                </div>
              </button>
            </div>

            {/* COD Explanation Box */}
            {paymentMethod === 'cod' && (
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-primary/20 flex items-start gap-3 text-xs text-on-surface-variant">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">Cash on Delivery Selected</p>
                  <p className="mt-0.5 text-[11px]">
                    You can pay the total amount of <strong className="text-on-surface">₹{total.toLocaleString('en-IN')}</strong> in cash to our courier partner when your botanical package arrives at your shipping address.
                  </p>
                </div>
              </div>
            )}

            {/* Card Inputs if Card method chosen */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">Expires</label>
                    <input
                      type="text"
                      required
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline block mb-1">CVC</label>
                    <input
                      type="text"
                      required
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleChange}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary hover:bg-tertiary py-4 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-lift"
          >
            {isSubmitting ? (
              <span>Confirming & Placing Order...</span>
            ) : (
              <>
                {paymentMethod === 'cod' ? <Banknote size={18} /> : <Lock size={16} />}
                <span>
                  {paymentMethod === 'cod' ? `Place Cash on Delivery Order — ₹${total.toLocaleString('en-IN')}` : `Pay & Place Order — ₹${total.toLocaleString('en-IN')}`}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Right Summary */}
        <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-6 sticky top-28">
          <h3 className="font-serif text-lg font-semibold text-primary">Order Summary ({cartItems.length} items)</h3>
          
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.selectedVolume}`} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-surface-container" />
                <div className="flex-1">
                  <h4 className="font-serif font-semibold text-xs text-on-surface">{item.name}</h4>
                  <p className="text-[10px] text-outline">Qty: {item.quantity} | {item.selectedVolume}</p>
                </div>
                <span className="font-serif font-bold text-xs text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-on-surface-variant pt-4 border-t border-outline-variant/30">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            {discountAmount > 0 && <div className="flex justify-between text-primary font-medium"><span>Discount</span><span>-₹{discountAmount.toLocaleString('en-IN')}</span></div>}
            <div className="flex justify-between"><span>Eco Delivery</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
            <div className="flex justify-between text-base font-serif font-bold text-on-surface pt-2 border-t border-outline-variant/40">
              <span>Total Payable</span>
              <span className="text-primary text-xl">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
