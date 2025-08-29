import { create } from "zustand";
import type { CartItem, Vinyl } from "@app/types";

type CartState = {
  items: CartItem[];
  add: (p: Vinyl, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (p, qty = 1) =>
    set(s => {
      const exists = s.items.find(i => i.id === p.id);
      if (exists) {
        return {
          items: s.items.map(i =>
            i.id === p.id ? { ...i, qty: i.qty + qty } : i
          )
        };
      }
      return {
        items: [
          ...s.items,
          {
            id: p.id,
            name: p.title,
            price: p.price,
            image: p.coverPath,
            qty
          }
        ]
      };
    }),
  inc: id =>
    set(s => ({ items: s.items.map(i => (i.id === id ? { ...i, qty: i.qty + 1 } : i)) })),
  dec: id =>
    set(s => ({
      items: s.items
        .map(i => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0)
    })),
  remove: id => set(s => ({ items: s.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
  count: () => get().items.reduce((acc, i) => acc + i.qty, 0)
}));
