import { Group, Image, Text } from '@mantine/core';

import type { TableColumn } from '@/components/Table';
import formatPrice from '@common/utils/formatPrice';
import { common, orders as ordersLocale } from '@/locale/uz';
import type * as Types from '@/modules/orders/types';

export const getOrderItemColumns = (): TableColumn<Types.IEntity.OrderItem>[] => [
  {
    key: 'productImage',
    title: ordersLocale.image,
    width: 72,
    render: item =>
      item.productImage ? (
        <Image src={item.productImage} alt={item.productName} w={56} h={56} radius="sm" fit="cover" />
      ) : (
        <Text c="dimmed" size="sm">
          {common.dash}
        </Text>
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
    align: 'center',
    render: item => `×${item.quantity}`
  },
  {
    key: 'price',
    title: ordersLocale.price,
    render: item => formatPrice(item.price)
  },
  {
    key: 'totalPrice',
    title: ordersLocale.itemTotal,
    render: item => (
      <Text size="sm" fw={600}>
        {formatPrice(item.totalPrice)}
      </Text>
    )
  }
];
