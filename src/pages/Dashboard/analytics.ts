import type { DonutChartCell } from "@mantine/charts";
import dayjs from "dayjs";

import { common, orderStatus } from "@/locale/uz";
import type * as OrderTypes from "@/modules/orders/types";
import type * as ProductTypes from "@/modules/products/types";

const ORDER_STATUSES: OrderTypes.OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_COLORS: Record<OrderTypes.OrderStatus, string> = {
  PENDING: "yellow.6",
  PAID: "teal.6",
  PROCESSING: "blue.6",
  SHIPPED: "cyan.6",
  DELIVERED: "green.6",
  CANCELLED: "red.6",
};

const STATUS_LABELS: Record<OrderTypes.OrderStatus, string> = {
  PENDING: orderStatus.pending,
  PAID: orderStatus.paid,
  PROCESSING: orderStatus.processing,
  SHIPPED: orderStatus.shipped,
  DELIVERED: orderStatus.delivered,
  CANCELLED: orderStatus.cancelled,
};

export type DashboardStats = {
  customers: number;
  products: number;
  categories: number;
  orders: number;
  activeProducts: number;
  totalRevenue: number;
  averageOrderValue: number;
};

export type OrdersTrendPoint = {
  date: string;
  orders: number;
  revenue: number;
};

export type ProductsByCategoryPoint = {
  category: string;
  products: number;
};

export type OrderStatusBarPoint = {
  status: string;
  orders: number;
};

export const buildDashboardStats = (
  products: ProductTypes.IEntity.Product[],
  categories: number,
  orders: OrderTypes.IEntity.Order[],
): DashboardStats => {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );
  const customers = new Set(
    orders.map((order) => order.userId).filter((id) => id > 0),
  ).size;

  return {
    customers,
    products: products.length,
    categories,
    orders: orders.length,
    activeProducts: products.filter((product) => product.isActive).length,
    totalRevenue,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
  };
};

export const buildOrderStatusData = (
  orders: OrderTypes.IEntity.Order[],
): DonutChartCell[] => {
  const counts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderTypes.OrderStatus, number>;

  for (const order of orders) {
    counts[order.status] += 1;
  }

  return ORDER_STATUSES.filter((status) => counts[status] > 0).map(
    (status) => ({
      name: STATUS_LABELS[status],
      value: counts[status],
      color: STATUS_COLORS[status],
    }),
  );
};

export const buildOrdersTrend = (
  orders: OrderTypes.IEntity.Order[],
  days = 14,
): OrdersTrendPoint[] => {
  const buckets = new Map<string, OrdersTrendPoint>();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = dayjs().subtract(index, "day").startOf("day");
    const key = date.format("YYYY-MM-DD");

    buckets.set(key, {
      date: date.format("DD MMM"),
      orders: 0,
      revenue: 0,
    });
  }

  for (const order of orders) {
    if (!order.createdAt) continue;

    const key = dayjs(order.createdAt).format("YYYY-MM-DD");
    const bucket = buckets.get(key);

    if (!bucket) continue;

    bucket.orders += 1;
    bucket.revenue += order.totalAmount;
  }

  return Array.from(buckets.values());
};

export const buildProductsByCategory = (
  products: ProductTypes.IEntity.Product[],
): ProductsByCategoryPoint[] => {
  const counts = new Map<string, number>();

  for (const product of products) {
    const category = product.categoryName || common.uncategorized;
    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([category, count]) => ({ category, products: count }));
};

export const buildOrderStatusBarData = (
  orders: OrderTypes.IEntity.Order[],
): OrderStatusBarPoint[] => {
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
};

export const getRecentOrders = (
  orders: OrderTypes.IEntity.Order[],
  limit = 6,
): OrderTypes.IEntity.Order[] =>
  [...orders]
    .sort(
      (left, right) =>
        dayjs(right.createdAt).valueOf() - dayjs(left.createdAt).valueOf(),
    )
    .slice(0, limit);
