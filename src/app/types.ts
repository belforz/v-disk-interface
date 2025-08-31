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

export type CartOrder = {
  id: string; 
  vinylId: string;
  name: string;
  price: number; 
  qt: number; 
};

export type CartUser = {
  userId: string;
  cart: CartOrder[];
  vinyls: string [];
}

export type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  createdAt: string;
}

export type ApiError = {
  message: string;
  statusCode?: number;
};

export type Order = {
    id: string
    userId: string;
    vinylIds: string[];
};

export type CheckoutOrder = {
  paymentId: string;
  payload: Order;
};

export type EmailCorpus = {
  to: string;
  subject: string;
  body: string;
};

