import type { AuthSession, Category, Order, Product, User } from '../types';
import { apiClient } from './axios';
import { mockRequest } from './mockAdapter';

apiClient.defaults.adapter = async (config) => {
  try {
    const result = await mockRequest(config);
    return {
      data: result.data,
      status: result.status,
      statusText: 'OK',
      headers: {},
      config,
    };
  } catch (err: unknown) {
    const error = err as { response?: { status: number; data: unknown } };
    return Promise.reject({
      response: error.response ?? { status: 500, data: { message: 'Server error' } },
      config,
      isAxiosError: true,
    });
  }
};

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<AuthSession>('/auth/login', { username, password }).then((r) => r.data),
  me: () => apiClient.get<AuthSession>('/auth/me').then((r) => r.data),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
};

export const usersApi = {
  getAll: () => apiClient.get<User[]>('/users').then((r) => r.data),
  create: (data: Omit<User, 'id' | 'createdAt'>) =>
    apiClient.post<User>('/users', data).then((r) => r.data),
  update: (id: string, data: Partial<User>) =>
    apiClient.put<User>(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
};

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories').then((r) => r.data),
  create: (data: Omit<Category, 'id' | 'createdAt'>) =>
    apiClient.post<Category>('/categories', data).then((r) => r.data),
  update: (id: string, data: Partial<Category>) =>
    apiClient.put<Category>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`).then((r) => r.data),
};

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products').then((r) => r.data),
  create: (data: Omit<Product, 'id' | 'createdAt'>) =>
    apiClient.post<Product>('/products', data).then((r) => r.data),
  update: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/products/${id}`).then((r) => r.data),
};

export const ordersApi = {
  getAll: () => apiClient.get<Order[]>('/orders').then((r) => r.data),
  create: (data: Omit<Order, 'id' | 'createdAt'>) =>
    apiClient.post<Order>('/orders', data).then((r) => r.data),
  update: (id: string, data: Partial<Order>) =>
    apiClient.put<Order>(`/orders/${id}`, data).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/orders/${id}`).then((r) => r.data),
};
