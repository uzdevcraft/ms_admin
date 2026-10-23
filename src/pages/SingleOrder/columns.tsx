import { Group, Text } from '@mantine/core';
import type { TableColumn } from '@/components/Table';
import { Thumbnail } from '@/components/Thumbnail';
import formatPrice from '@common/utils/formatPrice';
import mediaUrl from '@common/utils/mediaUrl';
import { common, orders as ordersLocale } from '@/locale/uz';
import type * as Types from '@/modules/orders/types';

export const getOrderItemColumns = (): TableColumn<Types.IEntity.OrderItem>[] => [
  {
    key: 'productImage',
    title: ordersLocale.image,
    width: 72,
    render: item => (
      <Thumbnail src={item.productImage ? mediaUrl(item.productImage) : ''} alt={item.productName} size={48} />
    )
  },
  {
    key: 'productName',
    title: ordersLocale.product,
    render: item => (
      <Group gap={4} wrap="nowrap">
        <Text size="sm" fw={500}>
          {item.productName || common.dash}
        </Text>
      </Group>
    )
  },
  {
    key: 'quantity',
    title: ordersLocale.quantity,
    numeric: true,
    render: item => `×${item.quantity}`
  },
  {
    key: 'price',
    title: ordersLocale.price,
    numeric: true,
    render: item => formatPrice(item.price)
  },
  {
    key: 'totalPrice',
    title: ordersLocale.itemTotal,
    numeric: true,
    render: item => (
      <Text size="sm" fw={600}>
        {formatPrice(item.totalPrice)}
      </Text>
    )
  }
];
