import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const DEFAULT_ORDERS = [
  {
    id: "PRK-94821",
    date: "2026-11-03",
    status: "In Transit",
    currentStep: 3, // 1: Order Placed, 2: Formulating Botanicals, 3: In Transit, 4: Delivered
    trackingNumber: "TRK-HIM-884920",
    carrier: "EcoCourier Express",
    estimatedDelivery: "2026-11-07",
    paymentMethod: "cod",
    paymentMethodLabel: "Cash on Delivery",
    items: [
      {
        name: "Radiant Glow Face Serum",
        selectedVolume: "30ml",
        quantity: 1,
        price: 2499,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Purifying Sage & Neem Cleanser",
        selectedVolume: "150ml",
        quantity: 1,
        price: 1299,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Aria Sharma",
      address: "742 Botanical Avenue, Suite 4B",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001"
    },
    total: 3798.00,
    notes: "Complimentary wild rosehip mini enclosed with package."
  },
  {
    id: "PRK-91204",
    date: "2026-11-04",
    status: "Formulating Botanicals",
    currentStep: 2,
    trackingNumber: "TRK-BOT-519283",
    carrier: "EcoCourier Express",
    estimatedDelivery: "2026-11-09",
    paymentMethod: "card",
    paymentMethodLabel: "Prepaid (Card / UPI)",
    items: [
      {
        name: "Cellular Renewal Night Cream",
        selectedVolume: "50ml",
        quantity: 2,
        price: 2999,
        image: "https://images.unsplash.com/photo-1608248597263-00079e95a329?auto=format&fit=crop&w=800&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Devansh Patel",
      address: "18 Heritage Green Ridge, Flat 302",
      city: "Bengaluru",
      state: "Karnataka",
      zip: "560001"
    },
    total: 5998.00,
    notes: "Fragile glass jars - double insulation requested."
  },
  {
    id: "PRK-88510",
    date: "2026-10-28",
    status: "Delivered",
    currentStep: 4,
    trackingNumber: "TRK-EXP-109284",
    carrier: "EcoCourier Express",
    estimatedDelivery: "2026-11-01",
    paymentMethod: "cod",
    paymentMethodLabel: "Cash on Delivery",
    items: [
      {
        name: "Lavender & Wild Sage Toning Essence",
        selectedVolume: "100ml",
        quantity: 1,
        price: 999,
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80"
      }
    ],
    shippingAddress: {
      fullName: "Meera Sen",
      address: "52 Silver Oaks Enclave",
      city: "New Delhi",
      state: "Delhi",
      zip: "110025"
    },
    total: 999.00,
    notes: "Successfully delivered and signed by customer."
  }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'prakriti_orders_v2';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read orders from localStorage:', e);
    }
    return DEFAULT_ORDERS;
  });

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  };

  // Sync with backend on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/`);
        if (res.ok) {
          const dbOrders = await res.json();
          // If database has orders and local storage hasn't diverged, use dbOrders
          const hasCustom = localStorage.getItem(STORAGE_KEY);
          if (!hasCustom && Array.isArray(dbOrders) && dbOrders.length > 0) {
            setOrders(dbOrders);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dbOrders));
          }
        }
      } catch (err) {
        console.warn('Could not sync orders from backend API, using local orders:', err.message);
      }
    };
    fetchOrders();
  }, []);

  // Place a new order
  const placeOrder = async (orderDetails) => {
    const tempId = `PRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: tempId,
      date: new Date().toISOString().split('T')[0],
      status: "Formulating Botanicals",
      currentStep: 2,
      trackingNumber: `TRK-BOT-${Math.floor(100000 + Math.random() * 900000)}`,
      carrier: "EcoCourier Express",
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...orderDetails
    };

    const updated = [newOrder, ...orders];
    saveOrders(updated);

    try {
      await fetch(`${API_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.warn('Backend order placement failed, saved locally:', err.message);
    }

    return newOrder;
  };

  // Update order status and progress step
  const updateOrderStatus = async (orderId, newStatus, newStep, extraFields = {}) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          currentStep: newStep !== undefined ? newStep : order.currentStep,
          ...extraFields,
        };
      }
      return order;
    });

    saveOrders(updated);

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          currentStep: newStep,
          ...extraFields,
        }),
      });
    } catch (err) {
      console.warn('Could not sync status update to backend:', err.message);
    }

    return { success: true };
  };

  // Update entire order details (carrier, tracking number, delivery date, notes)
  const updateOrder = async (orderId, updatedFields) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, ...updatedFields };
      }
      return order;
    });

    saveOrders(updated);

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.warn('Could not sync order updates to backend:', err.message);
    }

    return { success: true };
  };

  // Delete / cancel order
  const deleteOrder = async (orderId) => {
    const updated = orders.filter((o) => o.id !== orderId);
    saveOrders(updated);

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not sync order deletion to backend:', err.message);
    }

    return { success: true };
  };

  // Reset to default orders
  const resetOrders = () => {
    saveOrders(DEFAULT_ORDERS);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        resetOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
