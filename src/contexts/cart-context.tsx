"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CartItem = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  img: string;
  qty: number;
  cor?: string;
  corHex?: string;
};

type AddItemPayload = {
  id: number;
  nome: string;
  sku: string;
  preco: number;
  img: string;
  cor?: string;
  corHex?: string;
};

/** Unique key for a cart line: same product + different color = different line */
function itemKey(id: number, cor?: string) {
  return cor ? `${id}__${cor}` : `${id}`;
}

type CartContextType = {
  items: CartItem[];
  addItem: (product: AddItemPayload) => void;
  removeItem: (id: number, cor?: string) => void;
  updateQty: (id: number, qty: number, cor?: string) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "hamecon-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback((product: AddItemPayload) => {
    setItems((prev) => {
      const key = itemKey(product.id, product.cor);
      const existing = prev.find(
        (i) => itemKey(i.id, i.cor) === key
      );
      if (existing) {
        return prev.map((i) =>
          itemKey(i.id, i.cor) === key ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: number, cor?: string) => {
    const key = itemKey(id, cor);
    setItems((prev) => prev.filter((i) => itemKey(i.id, i.cor) !== key));
  }, []);

  const updateQty = useCallback((id: number, qty: number, cor?: string) => {
    if (qty < 1) return;
    const key = itemKey(id, cor);
    setItems((prev) =>
      prev.map((i) => (itemKey(i.id, i.cor) === key ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.preco * i.qty, 0);
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, total, totalItems, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
