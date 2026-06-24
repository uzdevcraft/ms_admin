import { Badge } from '@mantine/core';
import { Types } from '@modules/orders';

const STATUS_COLORS: Record<Types.OrderStatus, string> = {
  PENDING: 'yellow',
  PAID: 'teal',
  PROCESSING: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const STATUS_LABELS: Record<Types.OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export function OrderStatusBadge({ status }: { status: Types.OrderStatus }) {
  return (
    <Badge color={STATUS_COLORS[status]} variant="light">
      {STATUS_LABELS[status]}
    </Badge>
  );
}
