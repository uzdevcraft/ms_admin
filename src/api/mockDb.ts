import type { Category, Order, Product, User } from '../types';

const STORAGE_KEY = 'magic_store_admin_db';

interface Database {
  users: User[];
  categories: Category[];
  products: Product[];
  orders: Order[];
}

const now = () => new Date().toISOString();

function seedDatabase(): Database {
  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets and tech from global markets',
      createdAt: now(),
    },
    {
      id: 'cat-2',
      name: 'Fashion',
      slug: 'fashion',
      description: 'International clothing and accessories',
      createdAt: now(),
    },
    {
      id: 'cat-3',
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home decor and garden items from abroad',
      createdAt: now(),
    },
  ];

  const products: Product[] = [
    {
      id: 'prod-1',
      name: 'Wireless Earbuds Pro',
      description: 'Premium noise-cancelling earbuds from South Korea',
      price: 89.99,
      currency: 'USD',
      originCountry: 'South Korea',
      categoryId: 'cat-1',
      stock: 120,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      isActive: true,
      createdAt: now(),
    },
    {
      id: 'prod-2',
      name: 'Italian Leather Handbag',
      description: 'Handcrafted leather bag shipped from Milan',
      price: 249.0,
      currency: 'USD',
      originCountry: 'Italy',
      categoryId: 'cat-2',
      stock: 45,
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      isActive: true,
      createdAt: now(),
    },
    {
      id: 'prod-3',
      name: 'Japanese Ceramic Tea Set',
      description: 'Traditional tea set from Kyoto artisans',
      price: 78.5,
      currency: 'USD',
      originCountry: 'Japan',
      categoryId: 'cat-3',
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1563822249360-3efb23a3ed1b?w=400',
      isActive: true,
      createdAt: now(),
    },
  ];

  const users: User[] = [
    {
      id: 'user-1',
      fullName: 'Amina Karimova',
      email: 'amina.k@email.com',
      phone: '+998 90 123 4567',
      country: 'Uzbekistan',
      city: 'Tashkent',
      createdAt: now(),
    },
    {
      id: 'user-2',
      fullName: 'James Mitchell',
      email: 'james.m@email.com',
      phone: '+1 555 234 5678',
      country: 'United States',
      city: 'New York',
      createdAt: now(),
    },
  ];

  const orders: Order[] = [
    {
      id: 'order-1',
      orderNumber: 'MS-2024-001',
      userId: 'user-1',
      userName: 'Amina Karimova',
      items: [
        {
          productId: 'prod-1',
          productName: 'Wireless Earbuds Pro',
          quantity: 1,
          unitPrice: 89.99,
        },
      ],
      totalAmount: 89.99,
      currency: 'USD',
      status: 'in_transit',
      shippingCountry: 'Uzbekistan',
      shippingCity: 'Tashkent',
      shippingAddress: '12 Navoi Street, Apt 5',
      notes: 'Deliver to reception desk',
      createdAt: now(),
    },
    {
      id: 'order-2',
      orderNumber: 'MS-2024-002',
      userId: 'user-2',
      userName: 'James Mitchell',
      items: [
        {
          productId: 'prod-2',
          productName: 'Italian Leather Handbag',
          quantity: 1,
          unitPrice: 249.0,
        },
        {
          productId: 'prod-3',
          productName: 'Japanese Ceramic Tea Set',
          quantity: 2,
          unitPrice: 78.5,
        },
      ],
      totalAmount: 406.0,
      currency: 'USD',
      status: 'processing',
      shippingCountry: 'United States',
      shippingCity: 'New York',
      shippingAddress: '88 Broadway, Floor 12',
      notes: '',
      createdAt: now(),
    },
  ];

  return { users, categories, products, orders };
}

export function loadDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedDatabase();
    saveDb(seeded);
    return seeded;
  }
  return JSON.parse(raw) as Database;
}

export function saveDb(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
