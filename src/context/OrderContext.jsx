import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const DEFAULT_ORDERS = [
  {
    id: "PRK-94821",
    date: "2026-08-14",
    status: "In Transit",
    currentStep: 3, // 1: Order Placed, 2: Formulating Botanicals, 3: In Transit, 4: Delivered
    trackingNumber: "TRK-HIM-884920",
    carrier: "EcoCourier Express",
    estimatedDelivery: "2026-08-21",
    paymentMethod: "cod", // cod or card
    paymentMethodLabel: "Cash on Delivery",
    items: [
      { name: "Radiant Glow Face Serum", selectedVolume: "30ml", quantity: 1, price: 2499, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" },
      { name: "Purifying Sage & Neem Cleanser", selectedVolume: "150ml", quantity: 1, price: 1299, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" }
    ],
    shippingAddress: {
      fullName: "Aria Sharma",
      address: "742 Botanical Avenue, Suite 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001"
    },
    total: 3798.00
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('prakriti_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  // Sync with backend on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/`);
        if (res.ok) {
          const dbOrders = await res.json();
          // Sort descending by date or keep database order (assuming database returns in order)
          setOrders(dbOrders.length > 0 ? dbOrders : DEFAULT_ORDERS);
        }
      } catch (err) {
        console.warn('Could not sync orders from backend, using local orders:', err.message);
      }
    };
    fetchOrders();
  }, []);

  // Save to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('prakriti_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (orderDetails) => {
    const tempId = `PRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const tempOrder = {
      id: tempId,
      date: new Date().toISOString().split('T')[0],
      status: "Formulating Botanicals",
      currentStep: 2,
      trackingNumber: `TRK-BOT-${Math.floor(100000 + Math.random() * 900000)}`,
      carrier: "EcoCourier Express",
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...orderDetails
    };

    try {
      // Try to save to MongoDB backend
      const res = await fetch(`${API_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tempOrder)
      });
      
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders(prev => [savedOrder, ...prev]);
        return savedOrder;
      }
    } catch (err) {
      console.warn('Backend order placement failed, saving locally:', err.message);
    }

    // Local fallback
    setOrders(prev => [tempOrder, ...prev]);
    return tempOrder;
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
