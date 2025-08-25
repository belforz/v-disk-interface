import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private cart = inject(CartService);
  count = computed(() => this.cart.itemsSignal().reduce((n, i) => n + i.qty, 0));
}
