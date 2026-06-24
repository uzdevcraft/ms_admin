import {
  ActionIcon,
  Badge,
  Group,
  Image,
  Loader,
  Table,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import formatPrice from "@common/utils/formatPrice";
import getApiError from "@common/utils/getApiError";
import { PageHeader } from "../../components/common/PageHeader";
import { ResponsiveTable } from "../../components/common/ResponsiveTable";
import { Forms, Hooks, Types } from "@modules/products";

export function ProductsPage() {
  const { data, isLoading } = Hooks.useList();
  const remove = Hooks.useDelete();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Product | null>(null);

  const products = data?.data ?? [];

  const openEdit = (product: Types.IEntity.Product) => {
    setEditing(product);
    setUpdateOpen(true);
  };

  const handleDelete = (product: Types.IEntity.Product) => {
    modals.openConfirmModal({
      title: "Delete product",
      children: (
        <Text size="sm">
          Delete <strong>{product.name}</strong>? This cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await remove.mutateAsync(product.id);
          notifications.show({ message: "Product deleted", color: "green" });
        } catch (error) {
          const apiError = getApiError(error);
          notifications.show({
            message: apiError.message || "Something went wrong",
            color: "red",
          });
        }
      },
    });
  };

  if (isLoading) return <Loader color="violet" />;

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage international products sourced and shipped from abroad"
        actionLabel="Add product"
        onAction={() => setCreateOpen(true)}
      />

      <ResponsiveTable striped highlightOnHover withTableBorder minWidth={800}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Discount</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th w={90}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((product) => (
            <Table.Tr key={product.id}>
              <Table.Td>
                <Group gap="sm">
                  <Image
                    src={product.imageUrl}
                    w={40}
                    h={40}
                    radius="sm"
                    alt={product.name}
                  />
                  <div>
                    <Text size="sm" fw={500}>
                      {product.name}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1} maw={200}>
                      {product.description}
                    </Text>
                  </div>
                </Group>
              </Table.Td>
              <Table.Td>{product.categoryName || "—"}</Table.Td>
              <Table.Td>
                {formatPrice(product.effectivePrice || product.price)}
              </Table.Td>
              <Table.Td>
                {product.discountPrice > 0
                  ? formatPrice(product.discountPrice)
                  : "—"}
              </Table.Td>
              <Table.Td>{product.stockQuantity}</Table.Td>
              <Table.Td>
                <Badge
                  color={product.isActive ? "green" : "gray"}
                  variant="light"
                >
                  {product.isActive ? "Active" : "Inactive"}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => openEdit(product)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(product)}
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
        product={editing}
      />
    </>
  );
}
