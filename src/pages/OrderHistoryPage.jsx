import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, CheckCircle2, MapPin, ArrowRight, Banknote } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export default function OrderHistoryPage() {
  const { orders } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState(orders[0] || null);

  const steps = [
    { num: 1, title: 'Order Placed', desc: 'Payment / COD verified' },
    { num: 2, title: 'Formulating Botanicals', desc: 'Cold-pressed batch compounding' },
    { num: 3, title: 'In Transit', desc: 'En route with EcoCourier' },
    { num: 4, title: 'Delivered', desc: 'Package arrived at destination' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-surface-container-low p-8 sm:p-12 rounded-3xl border border-outline-variant/30 text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-secondary block">
          Customer Portal & Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-medium text-on-surface">
          Order History & Live Tracking
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
          Monitor your botanical order progress from micro-batch compounding to final door delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Orders List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif text-lg font-semibold text-primary">Your Orders ({orders.length})</h3>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${
                  selectedOrder?.id === order.id
                    ? 'bg-surface-container-lowest border-primary shadow-md ring-2 ring-primary/20'
                    : 'bg-surface-container-low border-outline-variant/30 hover:border-primary'
                }`}
              >
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-3">
                  <span className="font-serif font-semibold text-sm text-primary">{order.id}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    {order.status}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <p>Date: {order.date}</p>
                  <p>Payment: <strong className="text-secondary">{order.paymentMethodLabel || 'Cash on Delivery'}</strong></p>
                  <p>Total: <strong className="text-on-surface">₹{order.total.toLocaleString('en-IN')}</strong></p>
                  <p className="text-outline text-[11px]">Tracking: {order.trackingNumber}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Order Live Timeline */}
        {selectedOrder && (
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-10 rounded-3xl border border-outline-variant/30 shadow-xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant/30 pb-6 gap-4">
              <div>
                <span className="text-xs text-outline font-semibold uppercase tracking-wider block">Active Order:</span>
                <h2 className="font-serif text-2xl font-semibold text-primary">{selectedOrder.id}</h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-outline font-semibold uppercase tracking-wider block">Estimated Delivery:</span>
                <span className="text-sm font-bold text-secondary">{selectedOrder.estimatedDelivery}</span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">Live Delivery Progress</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {steps.map((step) => {
                  const isDone = selectedOrder.currentStep >= step.num;
                  const isCurrent = selectedOrder.currentStep === step.num;

                  return (
                    <div key={step.num} className="flex flex-col items-center text-center space-y-2 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-surface-container-high text-outline'
                        } ${isCurrent ? 'ring-4 ring-primary/30 scale-110' : ''}`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : step.num}
                      </div>
                      <span className={`text-xs font-semibold ${isDone ? 'text-primary' : 'text-outline'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-outline line-clamp-1">{step.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping & Payment Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <MapPin size={14} /> Shipping Address
                </h4>
                <p className="text-xs text-on-surface font-semibold">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-xs text-on-surface-variant">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
              </div>

              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Banknote size={14} /> Payment Option
                </h4>
                <p className="text-xs text-on-surface font-semibold">{selectedOrder.paymentMethodLabel || 'Cash on Delivery (COD)'}</p>
                <p className="text-xs text-secondary font-bold">Total: ₹{selectedOrder.total.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Order Items list */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Items in Shipment:</h4>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-surface-container" />
                  <div className="flex-1">
                    <h5 className="font-serif font-semibold text-xs text-on-surface">{item.name}</h5>
                    <p className="text-[10px] text-outline">Qty: {item.quantity} | {item.selectedVolume}</p>
                  </div>
                  <span className="font-serif font-bold text-xs text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
