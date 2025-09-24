export type Vinyl =  {
  id: string;
  title: string;
  artist: string;
  price: number;
  stock: number;
  coverPath: string;
  gallery: string[];
  isPrincipal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartOrder =  {
  id: string; 
  vinyls: [Vinyl[]]
  name: string;
  price: number; 
  qt: number; 
};

export type OrderItem = {
  vinylId: string;            // id do produto original
  quantity: number;          // quantidade desse item no pedido
  title?: string | null;     // snapshot do título no momento da compra
  artist?: string | null;    // snapshot do artista
  price?: string | null;     // snapshot do preço (string para evitar float impreciso)
  coverPath?: string | null; // snapshot do path da imagem
}

export type Order = {
  id: string;
  userId: string;
  vinylIds?: string[] | null;
  items?: OrderItem[] | null; // lista de items com qty por item (optional snapshot)
  qt?: number | null;         // soma das quantidades (opcional; backend pode preencher)
  paymentId?: string | null;
  isPaymentConfirmed?: boolean | null;
  orderStatus?: string | null; // ex: PENDING, CONFIRMED, FAILED, CANCELED
  createdAt?: string | null;   // ISO-8601
  updatedAt?: string | null;   // ISO-8601
}

export type CreateOrderRequest = {
  userId: string;
  items: Array<{
    vinylId: string;
    quantity?: number;
  }>;
  paymentId?: string;
  orderStatus?: string;
  
  qt?: number;
  isPaymentConfirmed?: boolean;
}


export interface UpdateOrderRequest {
  userId?: string;
  items?: Array<{
    vinylId: string;
    quantity?: number;
   
  }>;
  paymentId?: string;
  orderStatus?: string;
  qt?: number;
  isPaymentConfirmed?: boolean;
}

export interface OrderResponse {
  status: string; 
  data: Order;
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
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


export type CheckoutOrder = {
  paymentId: string;
  payload: Order;
};

export type EmailCorpus = {
  to: string;
  subject: string;
  body: string;
};

