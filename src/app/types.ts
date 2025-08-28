export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  caption?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};
