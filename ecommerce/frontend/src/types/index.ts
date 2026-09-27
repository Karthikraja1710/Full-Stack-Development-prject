export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image_url?: string | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image_url?: string | null;
  stock_quantity: number;
}

export interface ProductUpdate {
  name?: string;
  description?: string | null;
  price?: number;
  category?: string;
  image_url?: string | null;
  stock_quantity?: number;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product: Product;
}

export interface CartSummary {
  items: CartItem[];
  total_quantity: number;
  subtotal: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number | null;
  quantity: number;
  unit_price: number;
  product?: Product | null;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderCreate {
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
}

export interface AdminStats {
  total_products: number;
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  total_users: number;
  total_revenue: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
