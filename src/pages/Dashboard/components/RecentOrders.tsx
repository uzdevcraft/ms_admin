import { Badge, Group, Paper, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

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
    render: order => (
      <Text size="sm" fw={600}>
        #{order.id}
      </Text>
    )
  },
  {
    key: 'userFullName',
    title: ordersLocale.customer,
    render: order => order.userFullName || common.dash
  },
  {
    key: 'totalAmount',
    title: ordersLocale.total,
    render: order => formatPrice(order.totalAmount)
  },
  {
    key: 'status',
    title: ordersLocale.status,
    render: order => (
      <Badge color={STATUS_COLORS[order.status]} radius="sm" variant="outline">
        {STATUS_LABELS[order.status] || order.status}
      </Badge>
    )
  },
  {
    key: 'createdAt',
    title: ordersLocale.date,
    render: order => (order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY HH:mm') : common.dash)
  }
];

type IProps = {
  orders: Types.IEntity.Order[];
};

const RecentOrders = ({ orders }: IProps) => {
  return (
    <Paper withBorder radius="md" p="md" className={classes.chartCard}>
      <Group justify="space-between" align="flex-start" mb="md">
        <div>
          <Title order={4} mb={4}>
            {dashboard.recentOrders}
          </Title>
          <Text size="sm" c="dimmed">
            {dashboard.recentOrdersDesc}
          </Text>
        </div>
        <Text component={Link} to="/orders" size="sm" fw={500} className={classes.viewAll}>
          {dashboard.viewAllOrders}
        </Text>
      </Group>

      <Table
        columns={columns}
        data={orders}
        loading={false}
        emptyMessage={dashboard.noOrders}
        rowKey={order => order.id}
        minWidth={640}
      />
    </Paper>
  );
};

export default RecentOrders;
