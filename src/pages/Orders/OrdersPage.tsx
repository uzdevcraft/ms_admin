import { ActionIcon, Group, Loader, Table, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import formatPrice from '@common/utils/formatPrice';
import { Forms, Hooks, Types } from '@modules/orders';
import { OrderStatusBadge } from '../../components/common/StatusBadge';
import { PageHeader } from '../../components/common/PageHeader';
import { ResponsiveTable } from '../../components/common/ResponsiveTable';
import { formatDate } from '../../utils/format';

export function OrdersPage() {
  const { data, isLoading } = Hooks.useList();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Order | null>(null);

  const orders = data?.data ?? [];

  const openEdit = (order: Types.IEntity.Order) => {
    setEditing(order);
    setUpdateOpen(true);
  };

  if (isLoading) return <Loader color="violet" />;

  return (
    <>
      <PageHeader
        title="Orders"
        description="View and update order status. Customers place orders via the user app."
      />

      <ResponsiveTable striped highlightOnHover withTableBorder minWidth={900}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order #</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Delivery</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th w={60}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td>
                <Text size="sm" fw={600}>
                  #{order.id}
                </Text>
              </Table.Td>
              <Table.Td>{order.userFullName || '—'}</Table.Td>
              <Table.Td>
                {order.items.length > 0
                  ? order.items.map((item) => `${item.productName} ×${item.quantity}`).join(', ')
                  : '—'}
              </Table.Td>
              <Table.Td>{formatPrice(order.totalAmount)}</Table.Td>
              <Table.Td>
                <OrderStatusBadge status={order.status} />
              </Table.Td>
              <Table.Td>
                <Text size="sm" lineClamp={1} maw={200}>
                  {order.deliveryAddress || '—'}
                </Text>
              </Table.Td>
              <Table.Td>{formatDate(order.createdAt)}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => openEdit(order)}
                    aria-label="Update order status"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </ResponsiveTable>

      <Forms.UpdateStatus
        opened={updateOpen}
        onClose={() => {
          setUpdateOpen(false);
          setEditing(null);
        }}
        order={editing}
      />
    </>
  );
}
