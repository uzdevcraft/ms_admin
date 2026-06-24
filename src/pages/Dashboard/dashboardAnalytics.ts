import type { Types as OrderTypes } from '@modules/orders';
import type { Types as ProductTypes } from '@modules/products';
import type { DonutChartCell } from '@mantine/charts';

const ORDER_STATUSES: OrderTypes.OrderStatus[] = [
  'PENDING',
  'PAID',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const STATUS_COLORS: Record<OrderTypes.OrderStatus, string> = {
  PENDING: 'yellow.6',
  PAID: 'teal.6',
  PROCESSING: 'blue.6',
  SHIPPED: 'cyan.6',
  DELIVERED: 'green.6',
  CANCELLED: 'red.6',
};

const STATUS_LABELS: Record<OrderTypes.OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export interface DashboardStats {
  customers: number;
  products: number;
  categories: number;
  orders: number;
  activeProducts: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrdersTrendPoint {
  date: string;
  orders: number;
  revenue: number;
}

export interface ProductsByCategoryPoint {
  category: string;
  products: number;
}

export function buildDashboardStats(
  customers: number,
  products: ProductTypes.IEntity.Product[],
  categories: number,
  orders: OrderTypes.IEntity.Order[],
): DashboardStats {
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return {
    customers,
    products: products.length,
    categories,
    orders: orders.length,
    activeProducts: products.filter((product) => product.isActive).length,
    totalRevenue,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
  };
}

export function buildOrderStatusData(
  orders: OrderTypes.IEntity.Order[],
): DonutChartCell[] {
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderTypes.OrderStatus, number>;

  for (const order of orders) {
    counts[order.status] += 1;
  }

  return ORDER_STATUSES.filter((status) => counts[status] > 0).map((status) => ({
    name: STATUS_LABELS[status],
    value: counts[status],
    color: STATUS_COLORS[status],
  }));
}

export function buildOrdersTrend(
  orders: OrderTypes.IEntity.Order[],
  days = 14,
): OrdersTrendPoint[] {
  const buckets = new Map<string, OrdersTrendPoint>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    const key = date.toISOString().slice(0, 10);
    buckets.set(key, {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      orders: 0,
      revenue: 0,
    });
  }

  for (const order of orders) {
    const key = order.createdAt.slice(0, 10);
    const bucket = buckets.get(key);

    if (!bucket) continue;

    bucket.orders += 1;
    bucket.revenue += order.totalAmount;
  }

  return Array.from(buckets.values());
}

export function buildProductsByCategory(
  products: ProductTypes.IEntity.Product[],
): ProductsByCategoryPoint[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    const category = product.categoryName || 'Uncategorized';
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([category, count]) => ({ category, products: count }));
}

export function buildOrderStatusBarData(orders: OrderTypes.IEntity.Order[]) {
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderTypes.OrderStatus, number>;

  for (const order of orders) {
    counts[order.status] += 1;
  }

  return ORDER_STATUSES.map((status) => ({
    status: STATUS_LABELS[status],
    orders: counts[status],
  }));
}
