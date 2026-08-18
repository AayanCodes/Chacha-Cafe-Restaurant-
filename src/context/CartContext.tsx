/**
 * Dine-In Shopping Cart State Provider
 * 
 * Manages customer dish selections, item quantities, cooking notes,
 * table assignment, subtotal/tax computations, and cart lifecycle.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItemCMS } from '../types/admin';
import { CartItem, PaymentMethod } from '../types/orders';

interface CartContextType {
  items: CartItem[];
  tableNumber: string;
  setTableNumber: (num: string) => void;
  tableId: string | null;
  setTableId: (id: string | null) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  addItem: (menuItem: MenuItemCMS, quantity?: number, notes?: string) => void;
  updateQuantity: (menuItemId: string, delta: number) => void;
  updateItemNotes: (menuItemId: string, notes: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('01');
  const [tableId, setTableId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState<string>('');

  const addItem = (menuItem: MenuItemCMS, quantity: number = 1, notes: string = '') => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.menuItem.id === menuItem.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (notes) {
          updated[existingIdx].notes = notes;
        }
        return updated;
      }
      return [...prev, { menuItem, quantity, notes }];
    });
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.menuItem.id === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateItemNotes = (menuItemId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, notes } : item
      )
    );
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  };

  const clearCart = () => {
    setItems([]);
    setOrderNotes('');
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.menuItem.price) * item.quantity;
  }, 0);

  // 5% Restaurant GST
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        items,
        tableNumber,
        setTableNumber,
        tableId,
        setTableId,
        customerName,
        setCustomerName,
        customerPhone,
        setCustomerPhone,
        orderNotes,
        setOrderNotes,
        addItem,
        updateQuantity,
        updateItemNotes,
        removeItem,
        clearCart,
        totalItemsCount,
        subtotal,
        taxAmount,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
