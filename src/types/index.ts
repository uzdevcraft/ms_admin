export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  originCountry: string;
  categoryId: string;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  shippingCountry: string;
  shippingCity: string;
  shippingAddress: string;
  notes: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface AuthSession {
  adminId: string;
  username: string;
  name: string;
  token: string;
}
