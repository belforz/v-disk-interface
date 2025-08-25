import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe, NgIf } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  imports: [CurrencyPipe, NgIf],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private products = inject(ProductService);
  private cart = inject(CartService);

  product = this.products.byId(this.route.snapshot.paramMap.get('id')!);

  add() { if (this.product) this.cart.add(this.product); }
}
