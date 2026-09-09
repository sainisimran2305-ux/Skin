import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('prakriti_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g. 0.15 for 15% off
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('prakriti_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, volume = null) => {
    const targetVolume = volume || product.selectedVolume || '30ml';
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedVolume === targetVolume
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, selectedVolume: targetVolume, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, volume) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedVolume === volume)));
  };

  const updateQuantity = (id, volume, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, volume);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedVolume === volume ? { ...item, quantity: newQty } : item
      )
    );
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NATURAL10') {
      setAppliedDiscount(0.10);
      setDiscountSuccess('10% Natural Botanicals discount applied!');
      setDiscountError('');
    } else if (cleanCode === 'GLOW20') {
      setAppliedDiscount(0.20);
      setDiscountSuccess('20% Radiance Glow discount applied!');
      setDiscountError('');
    } else {
      setDiscountError('Invalid promo code. Try "NATURAL10" or "GLOW20".');
      setDiscountSuccess('');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedDiscount(0);
    setDiscountCode('');
    setDiscountSuccess('');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const freeShippingThreshold = 1499;
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        clearCart,
        subtotal,
        discountAmount,
        appliedDiscount,
        discountCode,
        setDiscountCode,
        discountError,
        discountSuccess,
        shippingCost,
        freeShippingThreshold,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
