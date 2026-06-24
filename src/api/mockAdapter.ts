import type { InternalAxiosRequestConfig } from 'axios';
import { ADMINS } from '../config/admins';
import type { AuthSession, Category, Order, Product, User } from '../types';
import { AUTH_TOKEN_KEY } from './axios';
import { delay, generateId, loadDb, saveDb } from './mockDb';

const SESSION_KEY = 'magic_store_auth_session';

function getSession(): AuthSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

function requireAuth(): void {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const session = getSession();
  if (!token || !session || session.token !== token) {
    throw { response: { status: 401, data: { message: 'Unauthorized' } } };
  }
}

function parseBody(config: InternalAxiosRequestConfig): unknown {
  if (!config.data) return {};
  return typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
}

export async function mockRequest(
  config: InternalAxiosRequestConfig,
): Promise<{ data: unknown; status: number }> {
  await delay(200);

  const url = config.url ?? '';
  const method = (config.method ?? 'get').toLowerCase();
  const body = parseBody(config);

  // Auth
  if (url === '/auth/login' && method === 'post') {
    const { username, password } = body as { username: string; password: string };
    const admin = ADMINS.find(
      (a) => a.username === username && a.password === password,
    );
    if (!admin) {
      throw { response: { status: 401, data: { message: 'Invalid credentials' } } };
    }
    const session: AuthSession = {
      adminId: admin.id,
      username: admin.username,
      name: admin.name,
      token: `ms-token-${admin.id}-${Date.now()}`,
    };
    sessionStorage.setItem(AUTH_TOKEN_KEY, session.token);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { data: session, status: 200 };
  }

  if (url === '/auth/me' && method === 'get') {
    requireAuth();
    return { data: getSession(), status: 200 };
  }

  if (url === '/auth/logout' && method === 'post') {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    return { data: { success: true }, status: 200 };
  }

  requireAuth();
  const db = loadDb();

  // Users
  if (url === '/users' && method === 'get') {
    return { data: db.users, status: 200 };
  }
  if (url === '/users' && method === 'post') {
    const user: User = {
      ...(body as Omit<User, 'id' | 'createdAt'>),
      id: generateId('user'),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDb(db);
    return { data: user, status: 201 };
  }
  const userMatch = url.match(/^\/users\/(.+)$/);
  if (userMatch) {
    const id = userMatch[1];
    if (method === 'put') {
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx === -1) throw { response: { status: 404, data: { message: 'Not found' } } };
      db.users[idx] = { ...db.users[idx], ...(body as Partial<User>) };
      saveDb(db);
      return { data: db.users[idx], status: 200 };
    }
    if (method === 'delete') {
      db.users = db.users.filter((u) => u.id !== id);
      saveDb(db);
      return { data: { success: true }, status: 200 };
    }
  }

  // Categories
  if (url === '/categories' && method === 'get') {
    return { data: db.categories, status: 200 };
  }
  if (url === '/categories' && method === 'post') {
    const category: Category = {
      ...(body as Omit<Category, 'id' | 'createdAt'>),
      id: generateId('cat'),
      createdAt: new Date().toISOString(),
    };
    db.categories.push(category);
    saveDb(db);
    return { data: category, status: 201 };
  }
  const catMatch = url.match(/^\/categories\/(.+)$/);
  if (catMatch) {
    const id = catMatch[1];
    if (method === 'put') {
      const idx = db.categories.findIndex((c) => c.id === id);
      if (idx === -1) throw { response: { status: 404, data: { message: 'Not found' } } };
      db.categories[idx] = { ...db.categories[idx], ...(body as Partial<Category>) };
      saveDb(db);
      return { data: db.categories[idx], status: 200 };
    }
    if (method === 'delete') {
      db.categories = db.categories.filter((c) => c.id !== id);
      saveDb(db);
      return { data: { success: true }, status: 200 };
    }
  }

  // Products
  if (url === '/products' && method === 'get') {
    return { data: db.products, status: 200 };
  }
  if (url === '/products' && method === 'post') {
    const product: Product = {
      ...(body as Omit<Product, 'id' | 'createdAt'>),
      id: generateId('prod'),
      createdAt: new Date().toISOString(),
    };
    db.products.push(product);
    saveDb(db);
    return { data: product, status: 201 };
  }
  const prodMatch = url.match(/^\/products\/(.+)$/);
  if (prodMatch) {
    const id = prodMatch[1];
    if (method === 'put') {
      const idx = db.products.findIndex((p) => p.id === id);
      if (idx === -1) throw { response: { status: 404, data: { message: 'Not found' } } };
      db.products[idx] = { ...db.products[idx], ...(body as Partial<Product>) };
      saveDb(db);
      return { data: db.products[idx], status: 200 };
    }
    if (method === 'delete') {
      db.products = db.products.filter((p) => p.id !== id);
      saveDb(db);
      return { data: { success: true }, status: 200 };
    }
  }

  // Orders
  if (url === '/orders' && method === 'get') {
    return { data: db.orders, status: 200 };
  }
  if (url === '/orders' && method === 'post') {
    const order: Order = {
      ...(body as Omit<Order, 'id' | 'createdAt'>),
      id: generateId('order'),
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    saveDb(db);
    return { data: order, status: 201 };
  }
  const orderMatch = url.match(/^\/orders\/(.+)$/);
  if (orderMatch) {
    const id = orderMatch[1];
    if (method === 'put') {
      const idx = db.orders.findIndex((o) => o.id === id);
      if (idx === -1) throw { response: { status: 404, data: { message: 'Not found' } } };
      db.orders[idx] = { ...db.orders[idx], ...(body as Partial<Order>) };
      saveDb(db);
      return { data: db.orders[idx], status: 200 };
    }
    if (method === 'delete') {
      db.orders = db.orders.filter((o) => o.id !== id);
      saveDb(db);
      return { data: { success: true }, status: 200 };
    }
  }

  throw { response: { status: 404, data: { message: 'Route not found' } } };
}
