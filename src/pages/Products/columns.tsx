import { ActionIcon, Badge, Group, Image, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

import type { TableColumn } from "@/components/Table";
import formatPrice from "@common/utils/formatPrice";
import { common, products as productsLocale } from "@/locale/uz";
import type * as Types from "@/modules/products/types";

type ProductColumnsOptions = {
  onEdit: (product: Types.IEntity.Product) => void;
  onDelete: (product: Types.IEntity.Product) => void;
};

export const getProductColumns = ({
  onEdit,
  onDelete,
}: ProductColumnsOptions): TableColumn<Types.IEntity.Product>[] => [
  {
    key: "imageUrl",
    title: "",
    width: 64,
    render: (product) =>
      product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          w={40}
          h={40}
          radius="sm"
          fit="cover"
        />
      ) : (
        <Text c="dimmed" size="sm">
          {common.dash}
        </Text>
      ),
  },
  {
    key: "name",
    title: productsLocale.product,
    render: (product) => (
      <div>
        <Text fw={500} size="sm">
          {product.name || common.dash}
        </Text>
        {product.nameUz ? (
          <Text c="dimmed" size="xs">
            {product.nameUz}
          </Text>
        ) : null}
      </div>
    ),
  },
  {
    key: "categoryName",
    title: productsLocale.category,
    render: (product) => product.categoryName || common.uncategorized,
  },
  {
    key: "price",
    title: productsLocale.price,
    render: (product) => (
      <Group gap={6} wrap="nowrap">
        <Text size="sm" fw={500}>
          {formatPrice(product.effectivePrice || product.price)}
        </Text>
        {product.discountPrice > 0 && product.discountPrice < product.price ? (
          <Text size="xs" c="dimmed" td="line-through">
            {formatPrice(product.price)}
          </Text>
        ) : null}
      </Group>
    ),
  },
  {
    key: "stockQuantity",
    title: productsLocale.stock,
    align: "center",
  },
  {
    key: "isActive",
    title: productsLocale.status,
    render: (product) => (
      <Badge color={product.isActive ? "green" : "gray"} radius="md">
        {product.isActive ? common.active : common.inactive}
      </Badge>
    ),
  },
  {
    key: "actions",
    title: common.actions,
    render: (product) => (
      <Group gap={8} wrap="nowrap">
        <ActionIcon
          color="blue"
          aria-label={common.edit}
          onClick={() => onEdit(product)}
        >
          <IconPencil size={16} />
        </ActionIcon>
        <ActionIcon
          color="red"
          aria-label={common.delete}
          onClick={() => onDelete(product)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    ),
  },
];
