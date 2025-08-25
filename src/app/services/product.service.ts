import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Replace with your API later
  private data: Product[] = [
    {
      id: 'jacket-crystal',
      title: "Beyoncé x Levi's® '90s Shrunken Trucker — Crystal",
      price: 250,
      image: 'assets/demo/jacket-crystal.png',
      description: 'A cropped trucker jacket with subtle crystal pattern and classic Levi\'s® details.'
    },
    {
      id: 'jacket-laced',
      title: "Beyoncé x Levi's® '90s Shrunken Trucker — Laced Up",
      price: 230,
      image: 'assets/demo/jacket-laced.png',
      description: 'Denim trucker with laced seams and a fitted silhouette inspired by 90s cuts.'
    },
    {
      id: 'jeans-501',
      title: "Beyoncé x Levi's® 501® Curve — Western Crystal",
      price: 150,
      image: 'assets/demo/jeans-501.png',
      description: 'Iconic 501® with gentle western crystal motifs and a soft taper.'
    }
  ];

  all() { return this.data; }
  byId(id: string) { return this.data.find(p => p.id === id); }
}
