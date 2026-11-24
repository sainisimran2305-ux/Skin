import React from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Printer,
  ShieldCheck,
  Clock,
  Sparkles,
  Leaf,
  ExternalLink
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { orders } = useOrder();

  // Try retrieving the order from navigation state or context by ID
  const orderFromState = location.state?.order;
  const order = orderFromState || orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto text-outline">
          <Package size={32} />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-on-surface">No Order Details Found</h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          We could not locate this order reference. Please check your active orders in your account dashboard.
        </p>
        <Link
          to="/orders"
          className="px-6 py-3 rounded-full bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider inline-block shadow-md hover:bg-tertiary transition"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Order Confirmed', desc: 'Payment / COD confirmed' },
    { num: 2, label: 'Formulating Botanicals', desc: 'Active in lab' },
    { num: 3, label: 'In Transit', desc: 'Handed to courier' },
    { num: 4, label: 'Delivered', desc: 'Arrived at destination' },
  ];

  const currentStep = order.currentStep || 2;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb */}
      <nav className="text-xs text-outline flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link to="/checkout" className="hover:text-primary transition">Checkout</Link>
        <span>/</span>
        <span className="text-on-surface font-semibold">Order Confirmation #{order.id}</span>
      </nav>

      {/* Confirmation Hero Banner */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-4 shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
          <CheckCircle2 size={44} className="text-emerald-700" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Order Verified & In Production
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-on-surface">
          Thank You! Your Botanical Order is Confirmed
        </h1>
        <p className="text-sm text-on-surface-variant max-w-lg mx-auto font-sans leading-relaxed">
          Order reference <span className="font-mono font-bold text-primary">{order.id}</span> has been received. Our herbalists are freshly preparing your micro-batch botanicals.
        </p>

        {/* Live Admin Dispatch Notice */}
        <div className="pt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-medium">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Synced with Store Owner Portal for Real-Time Dispatch Control</span>
        </div>
      </div>

      {/* 4-Step Dispatch Status Timeline */}
      <div className="bg-surface-container p-6 sm:p-8 rounded-3xl border border-outline-variant/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/30 pb-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-primary flex items-center gap-2">
              <Truck size={20} />
              <span>Dispatch & Formulation Progress</span>
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live status controlled directly by the store administrator.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-on-primary self-start sm:self-auto shadow-sm">
            Current Stage: {order.status}
          </span>
        </div>

        {/* Timeline Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((st) => {
            const isCompleted = currentStep >= st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div
                key={st.num}
                className={`p-4 rounded-2xl border transition text-center space-y-2 ${
                  isCurrent
                    ? 'bg-primary text-on-primary border-primary shadow-md ring-2 ring-primary/20'
                    : isCompleted
                    ? 'bg-surface-container-lowest border-emerald-300 text-on-surface'
                    : 'bg-surface-container-low border-outline-variant/40 text-outline'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    isCurrent
                      ? 'bg-on-primary text-primary'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-surface-container text-outline'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : st.num}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{st.label}</h4>
                  <p className={`text-[10px] mt-0.5 ${isCurrent ? 'text-on-primary/80' : 'text-outline'}`}>
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Order Details & Purchased Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Details, Address, Dispatch) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tracking & Carrier Info */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-base font-semibold text-primary flex items-center gap-2">
              <Package size={18} />
              <span>Shipping & Tracking Overview</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-outline block">
                  Carrier Partner
                </span>
                <p className="font-bold font-sans text-on-surface text-sm">{order.carrier || 'EcoCourier Express'}</p>
                <p className="text-[10px] text-outline font-sans">100% Carbon-Neutral Ground Transit</p>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-outline block">
                  Tracking Number
                </span>
                <p className="font-bold text-secondary text-sm">{order.trackingNumber}</p>
                <p className="text-[10px] text-outline font-sans">Trackable via courier dispatch</p>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-outline block">
                  Order Date
                </span>
                <p className="font-bold font-sans text-on-surface">{order.date}</p>
              </div>

              <div className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-outline block">
                  Estimated Delivery
                </span>
                <p className="font-bold font-sans text-emerald-700">{order.estimatedDelivery || 'Within 4-5 business days'}</p>
              </div>
            </div>
          </div>

          {/* Destination Address & Payment Method */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-4">
            <h3 className="font-serif text-base font-semibold text-primary flex items-center gap-2">
              <MapPin size={18} />
              <span>Delivery & Payment Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-on-surface-variant">
              <div className="space-y-1.5">
                <h4 className="font-bold uppercase tracking-wider text-outline text-[11px]">Shipping Destination:</h4>
                <p className="font-semibold text-on-surface text-sm">
                  {order.shippingAddress?.fullName || 'Valued Customer'}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zip}
                </p>
                {order.shippingAddress?.phone && <p>Contact: {order.shippingAddress?.phone}</p>}
                {order.shippingAddress?.email && <p>Email: {order.shippingAddress?.email}</p>}
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold uppercase tracking-wider text-outline text-[11px]">Payment Mode:</h4>
                <div className="p-3 bg-surface-container rounded-xl border border-outline-variant/30 space-y-1">
                  <p className="font-bold text-on-surface flex items-center gap-1.5 text-xs">
                    <CreditCard size={14} className="text-secondary" />
                    <span>{order.paymentMethodLabel || (order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Prepaid Online')}</span>
                  </p>
                  <p className="text-[11px] text-outline">
                    {order.paymentMethod === 'cod'
                      ? 'Please keep cash ready upon arrival of courier.'
                      : 'Payment captured securely via gateway.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Itemized Summary) */}
        <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <h3 className="font-serif text-base font-semibold text-primary">
              Purchased Botanicals ({order.items?.length || 0})
            </h3>
            <span className="text-xs text-outline font-mono">Invoice Summary</span>
          </div>

          {/* Items List */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-lg bg-surface-container shrink-0 border border-outline-variant/30"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-xs text-on-surface truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-outline mt-0.5">
                    Qty: {item.quantity} | {item.selectedVolume || 'Standard'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-serif font-bold text-xs text-primary">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Price Calculation */}
          <div className="space-y-2 text-xs text-on-surface-variant pt-3 border-t border-outline-variant/30">
            <div className="flex justify-between">
              <span>Botanical Subtotal</span>
              <span>₹{(order.total || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Carbon-Neutral Eco Shipping</span>
              <span className="font-semibold uppercase tracking-wider text-[11px]">Free</span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-on-surface pt-3 border-t border-outline-variant/40">
              <span>Total Amount</span>
              <span className="text-primary text-xl">₹{(order.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link
              to="/orders"
              className="w-full bg-primary text-on-primary hover:bg-tertiary py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-lift"
            >
              <Truck size={16} />
              <span>Track All Orders</span>
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 rounded-xl border border-outline-variant/60 hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition"
              >
                <Printer size={14} />
                <span>Print Receipt</span>
              </button>

              <Link
                to="/shop"
                className="py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition text-center"
              >
                <ShoppingBag size={14} />
                <span>Continue Shop</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
