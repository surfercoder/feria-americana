"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: number[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<number[]>([]);

  const addToCart = (id: number) => {
    setCartItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
} 