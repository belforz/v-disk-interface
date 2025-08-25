import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Store' },
  { path: 'product/:id', component: ProductDetailComponent, title: 'Product' },
  { path: 'cart', component: CartComponent, title: 'Cart' },
  { path: '**', redirectTo: '' }
];
