export type Vinyl =  {
  id: string;
  title: string;
  artist: string;
  price: number;
  stock: number;
  coverPath: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  createdAt: string;
}
