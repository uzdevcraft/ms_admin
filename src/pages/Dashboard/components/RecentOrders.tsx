import { Avatar, Badge, Group, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

import { DateTime } from '@/components/DateTime';
import { Table, type TableColumn } from '@/components/Table';
import formatPrice from '@common/utils/formatPrice';
import { common, dashboard, orderStatus, orders as ordersLocale } from '@/locale/uz';
import type * as Types from '@/modules/orders/types';

import classes from '../Dashboard.module.scss';

const STATUS_COLORS: Record<Types.OrderStatus, string> = {
  PENDING: 'yellow',
  PAID: 'teal',
  PROCESSING: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red'
};

const STATUS_LABELS: Record<Types.OrderStatus, string> = {
  PENDING: orderStatus.pending,
  PAID: orderStatus.paid,
  PROCESSING: orderStatus.processing,
  SHIPPED: orderStatus.shipped,
  DELIVERED: orderStatus.delivered,
  CANCELLED: orderStatus.cancelled
};

const columns: TableColumn<Types.IEntity.Order>[] = [
  {
    key: 'id',
    title: ordersLocale.orderNumber,
    nowrap: true,
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
          <Text size="sm" fw={500} lineClamp={1}>
            {order.userFullName}
          </Text>
        </Group>
      ) : (
        common.dash
      )
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
    key: 'createdAt',
    title: ordersLocale.date,
    render: order => <DateTime value={order.createdAt} />
  }
];

type IProps = {
  orders: Types.IEntity.Order[];
};

const RecentOrders = ({ orders }: IProps) => {
  return (
    <Table
      title={dashboard.recentOrders}
      description={dashboard.recentOrdersDesc}
      actions={
        <Text component={Link} to="/orders" size="sm" fw={600} className={classes.viewAll}>
          {dashboard.viewAllOrders}
          <IconArrowRight size={14} stroke={2} />
        </Text>
      }
      columns={columns}
      data={orders}
      loading={false}
      emptyMessage={dashboard.noOrders}
      rowKey={order => order.id}
      minWidth={640}
    />
  );
};

export default RecentOrders;
