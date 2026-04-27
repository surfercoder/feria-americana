"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface SoldNotification {
  productId: number;
  title: string;
}

interface CartContextType {
  cartItems: number[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  soldNotifications: SoldNotification[];
  dismissNotification: (productId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [soldNotifications, setSoldNotifications] = useState<SoldNotification[]>([]);
  const cartItemsRef = useRef<number[]>([]);

  // Keep ref in sync with state so the realtime callback always sees current cart
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Subscribe to realtime updates on the products table
  useEffect(() => {
    const channel = supabase
      .channel('products-status')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          const newRecord = payload.new as { id: number; status: string; title: string };
          if (
            newRecord.status === 'vendido' &&
            cartItemsRef.current.includes(newRecord.id)
          ) {
            // Remove the sold product from cart
            setCartItems((prev) => prev.filter((id) => id !== newRecord.id));
            // Show notification
            setSoldNotifications((prev) => [
              ...prev,
              { productId: newRecord.id, title: newRecord.title },
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToCart = (id: number) => {
    setCartItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const clearCart = () => setCartItems([]);

  const dismissNotification = useCallback((productId: number) => {
    setSoldNotifications((prev) => prev.filter((n) => n.productId !== productId));
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, soldNotifications, dismissNotification }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
} 