import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private cart = inject(CartService);
  items = this.cart.itemsSignal;
  total = computed(() => this.items().reduce((sum, it) => sum + it.product.price * it.qty, 0));

  inc(id: string) { this.cart.inc(id); }
  dec(id: string) { this.cart.dec(id); }
  remove(id: string) { this.cart.remove(id); }
  clear() { this.cart.clear(); }
}
