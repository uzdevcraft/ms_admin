import { Avatar, Badge, Group, Text } from '@mantine/core';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';

import { DateTime } from '@/components/DateTime';
import { RowAction } from '@/components/RowAction';
import type { TableColumn } from '@/components/Table';
import formatPrice from '@common/utils/formatPrice';
import { common, orderStatus, orders as ordersLocale } from '@/locale/uz';
import type * as Types from '@/modules/orders/types';

import classes from './Orders.module.css';

export const STATUS_COLORS: Record<Types.OrderStatus, string> = {
  PENDING: 'yellow',
  PAID: 'teal',
  PROCESSING: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red'
};

export const STATUS_LABELS: Record<Types.OrderStatus, string> = {
  PENDING: orderStatus.pending,
  PAID: orderStatus.paid,
  PROCESSING: orderStatus.processing,
  SHIPPED: orderStatus.shipped,
  DELIVERED: orderStatus.delivered,
  CANCELLED: orderStatus.cancelled
};

type OrderColumnsOptions = {
  onOpen: (order: Types.IEntity.Order) => void;
  onEdit: (order: Types.IEntity.Order) => void;
  onDelete: (order: Types.IEntity.Order) => void;
};

export const getOrderColumns = ({
  onOpen,
  onEdit,
  onDelete
}: OrderColumnsOptions): TableColumn<Types.IEntity.Order>[] => [
  {
    key: 'id',
    title: ordersLocale.orderNumber,
    nowrap: true,
    width: 88,
    render: order => (
      <Text size="sm" className={classes.orderId}>
        #{order.id}
      </Text>
    )
  },
  {
    key: 'userFullName',
    title: ordersLocale.customer,
    render: order =>
      order.userFullName ? (
        <Group gap={10} wrap="nowrap">
          <Avatar name={order.userFullName} color="initials" size={28} radius="xl" />
          <Text size="sm" fw={500} lineClamp={1} maw={180}>
            {order.userFullName}
          </Text>
        </Group>
      ) : (
        common.dash
      )
  },
  {
    key: 'items',
    title: ordersLocale.items,
    render: order => {
      const summary = order.items.map(item => `${item.productName} ×${item.quantity}`).join(', ');
      return order.items.length > 0 ? (
        <Text size="sm" className={classes.secondary} lineClamp={1} maw={260} title={summary}>
          {summary}
        </Text>
      ) : (
        common.dash
      );
    }
  },
  {
    key: 'totalAmount',
    title: ordersLocale.total,
    numeric: true,
    render: order => (
      <Text size="sm" fw={600} span>
        {formatPrice(order.totalAmount)}
      </Text>
    )
  },
  {
    key: 'status',
    title: ordersLocale.status,
    nowrap: true,
    render: order => (
      <Badge color={STATUS_COLORS[order.status]} variant="dot" size="md">
        {STATUS_LABELS[order.status] || order.status}
      </Badge>
    )
  },
  {
    key: 'deliveryAddress',
    title: ordersLocale.delivery,
    render: order => (
      <Text size="sm" className={classes.secondary} lineClamp={1} maw={200} title={order.deliveryAddress || undefined}>
        {order.deliveryAddress || common.dash}
      </Text>
    )
  },
  {
    key: 'createdAt',
    title: ordersLocale.date,
    render: order => <DateTime value={order.createdAt} />
  },
  {
    key: 'actions',
    title: common.actions,
    align: 'right',
    width: 128,
    render: order => (
      <Group gap={2} wrap="nowrap" justify="flex-end">
        <RowAction label={ordersLocale.open} icon={<IconEye size={16} />} onClick={() => onOpen(order)} />
        <RowAction label={common.updateStatus} icon={<IconPencil size={16} />} onClick={() => onEdit(order)} />
        <RowAction label={common.delete} icon={<IconTrash size={16} />} onClick={() => onDelete(order)} danger />
      </Group>
    )
  }
];
