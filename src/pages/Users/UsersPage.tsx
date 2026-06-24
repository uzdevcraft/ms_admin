import { ActionIcon, Group, Loader, Table, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ResponsiveTable } from '../../components/common/ResponsiveTable';
import { useUserMutations, useUsers } from '../../hooks/useUsers';
import { formatDate } from '../../utils/format';
import type { User } from '../../types';
import type { UserFormValues } from '../../schemas';
import { UserFormModal } from './UserFormModal';

export function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { create, update, remove } = useUserMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setModalOpen(true);
  };

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data: values });
        notifications.show({ message: 'Customer updated', color: 'green' });
      } else {
        await create.mutateAsync(values);
        notifications.show({ message: 'Customer created', color: 'green' });
      }
      setModalOpen(false);
    } catch {
      notifications.show({ message: 'Something went wrong', color: 'red' });
    }
  };

  const handleDelete = (user: User) => {
    modals.openConfirmModal({
      title: 'Delete customer',
      children: (
        <Text size="sm">
          Delete <strong>{user.fullName}</strong>? This cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        await remove.mutateAsync(user.id);
        notifications.show({ message: 'Customer deleted', color: 'green' });
      },
    });
  };

  if (isLoading) return <Loader color="violet" />;

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage marketplace customers who order products from abroad"
        actionLabel="Add customer"
        onAction={openCreate}
      />

      <ResponsiveTable striped highlightOnHover withTableBorder minWidth={760}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th w={90}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users?.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td>{user.fullName}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.phone}</Table.Td>
              <Table.Td>
                {user.city}, {user.country}
              </Table.Td>
              <Table.Td>{formatDate(user.createdAt)}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon variant="subtle" color="violet" onClick={() => openEdit(user)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(user)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </ResponsiveTable>

      <UserFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editing}
        onSubmit={handleSubmit}
        isLoading={create.isPending || update.isPending}
      />
    </>
  );
}
