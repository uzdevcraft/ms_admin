import { ActionIcon, Badge, Group, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";

import type { TableColumn } from "@/components/Table";
import formatPrice from "@common/utils/formatPrice";
import { common, orderStatus, orders as ordersLocale } from "@/locale/uz";
import type * as Types from "@/modules/orders/types";

const STATUS_COLORS: Record<Types.OrderStatus, string> = {
  PENDING: "yellow",
  PAID: "teal",
  PROCESSING: "blue",
  SHIPPED: "cyan",
  DELIVERED: "green",
  CANCELLED: "red",
};

const STATUS_LABELS: Record<Types.OrderStatus, string> = {
  PENDING: orderStatus.pending,
  PAID: orderStatus.paid,
  PROCESSING: orderStatus.processing,
  SHIPPED: orderStatus.shipped,
  DELIVERED: orderStatus.delivered,
  CANCELLED: orderStatus.cancelled,
};

type OrderColumnsOptions = {
  onEdit: (order: Types.IEntity.Order) => void;
  onDelete: (order: Types.IEntity.Order) => void;
};

export const getOrderColumns = ({
  onEdit,
  onDelete,
}: OrderColumnsOptions): TableColumn<Types.IEntity.Order>[] => [
  {
    key: "id",
    title: ordersLocale.orderNumber,
    render: (order) => (
      <Text size="sm" fw={600}>
        #{order.id}
      </Text>
    ),
  },
  {
    key: "userFullName",
    title: ordersLocale.customer,
    render: (order) => order.userFullName || common.dash,
  },
  {
    key: "items",
    title: ordersLocale.items,
    render: (order) =>
      order.items.length > 0
        ? order.items
            .map((item) => `${item.productName} ×${item.quantity}`)
            .join(", ")
        : common.dash,
  },
  {
    key: "totalAmount",
    title: ordersLocale.total,
    render: (order) => formatPrice(order.totalAmount),
  },
  {
    key: "status",
    title: ordersLocale.status,
    render: (order) => (
      <Badge color={STATUS_COLORS[order.status]} radius="md">
        {STATUS_LABELS[order.status] || order.status}
      </Badge>
    ),
  },
  {
    key: "deliveryAddress",
    title: ordersLocale.delivery,
    render: (order) => (
      <Text size="sm" lineClamp={1} maw={200}>
        {order.deliveryAddress || common.dash}
      </Text>
    ),
  },
  {
    key: "createdAt",
    title: ordersLocale.date,
    render: (order) =>
      order.createdAt
        ? `${dayjs(`${order.createdAt}`).format("DD/MM/YYYY HH:mm")}`
        : common.dash,
  },
  {
    key: "actions",
    title: common.actions,
    render: (order) => (
      <Group gap={8} wrap="nowrap">
        <ActionIcon
          color="blue"
          aria-label={common.updateStatus}
          onClick={() => onEdit(order)}
        >
          <IconPencil size={16} />
        </ActionIcon>
        <ActionIcon
          color="red"
          aria-label={common.delete}
          onClick={() => onDelete(order)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    ),
  },
];
