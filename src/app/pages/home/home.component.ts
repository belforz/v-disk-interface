import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [NgFor, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private products = inject(ProductService);
  private cart = inject(CartService);
  items = this.products.all();

  addToCart(p: any) { this.cart.add(p); }
}
