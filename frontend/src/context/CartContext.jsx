
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (err) {
    console.error('Failed to parse cart from localStorage', err);
    return [];
  }
});

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId, name, price, image,quantity) => {
    const exists = cartItems.find(item => item.itemId === itemId);

    if (exists) {
      updateQuantity(itemId, quantity)
    } else {
      setCartItems(prev => [...prev, { itemId, name, price, image,quantity }]);
    }

  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.itemId !== itemId));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.itemId === itemId ? { ...item, quantity } : item
        )
      );
    }
  };



  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
