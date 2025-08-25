import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

interface CartItem { product: Product; qty: number; }

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);
  itemsSignal = this._items.asReadonly();

  add(product: Product) {
    const items = [...this._items()];
    const idx = items.findIndex(i => i.product.id === product.id);
    if (idx >= 0) items[idx] = { ...items[idx], qty: items[idx].qty + 1 };
    else items.push({ product, qty: 1 });
    this._items.set(items);
  }
  inc(id: string) { this._setQty(id, +1); }
  dec(id: string) { this._setQty(id, -1); }
  remove(id: string) { this._items.set(this._items().filter(i => i.product.id !== id)); }
  clear() { this._items.set([]); }

  private _setQty(id: string, delta: number) {
    const items = this._items().map(it => it.product.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it);
    this._items.set(items);
  }
}
