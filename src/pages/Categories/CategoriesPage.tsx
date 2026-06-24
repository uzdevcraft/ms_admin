import {
  ActionIcon,
  Badge,
  Group,
  Image,
  Loader,
  Table,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import getApiError from '@common/utils/getApiError';
import { Forms, Hooks, Types } from '@modules/categories';
import { PageHeader } from '../../components/common/PageHeader';
import { ResponsiveTable } from '../../components/common/ResponsiveTable';
import { formatDate } from '../../utils/format';

export function CategoriesPage() {
  const { data, isLoading } = Hooks.useList();
  const remove = Hooks.useDelete();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Category | null>(null);

  const categories = data?.data ?? [];

  const openEdit = (category: Types.IEntity.Category) => {
    setEditing(category);
    setUpdateOpen(true);
  };

  const handleDelete = (category: Types.IEntity.Category) => {
    modals.openConfirmModal({
      title: 'Delete category',
      children: (
        <Text size="sm">
          Delete <strong>{category.name}</strong>? Products in this category will keep their
          reference.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await remove.mutateAsync(category.id);
          notifications.show({ message: 'Category deleted', color: 'green' });
        } catch (error) {
          const apiError = getApiError(error);
          notifications.show({
            message: apiError.message || 'Something went wrong',
            color: 'red',
          });
        }
      },
    });
  };

  if (isLoading) return <Loader color="violet" />;

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize international products into browseable categories"
        actionLabel="Add category"
        onAction={() => setCreateOpen(true)}
      />

      <ResponsiveTable striped highlightOnHover withTableBorder minWidth={720}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Category</Table.Th>
            <Table.Th>Sort order</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th w={90}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {categories.map((category) => (
            <Table.Tr key={category.id}>
              <Table.Td>
                <Group gap="sm">
                  <Image
                    src={category.imageUrl}
                    w={40}
                    h={40}
                    radius="sm"
                    alt={category.name}
                  />
                  <div>
                    <Text size="sm" fw={500}>
                      {category.name}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1} maw={240}>
                      {category.description}
                    </Text>
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>{category.sortOrder}</Table.Td>
              <Table.Td>
                <Badge color={category.isActive ? 'green' : 'gray'} variant="light">
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td>{formatDate(category.createdAt)}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => openEdit(category)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(category)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </ResponsiveTable>

      <Forms.Create opened={createOpen} onClose={() => setCreateOpen(false)} />
      <Forms.Update
        opened={updateOpen}
        onClose={() => {
          setUpdateOpen(false);
          setEditing(null);
        }}
        category={editing}
      />
    </>
  );
}
