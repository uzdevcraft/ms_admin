import { Badge, Group, Text } from '@mantine/core';
import { IconPencil, IconTags, IconTrash } from '@tabler/icons-react';

import { RowAction } from '@/components/RowAction';
import type { TableColumn } from '@/components/Table';
import { Thumbnail } from '@/components/Thumbnail';
import formatPrice from '@common/utils/formatPrice';
import mediaUrl from '@common/utils/mediaUrl';
import { common, products as productsLocale } from '@/locale/uz';
import type * as Types from '@/modules/products/types';

import classes from './Products.module.css';

type ProductColumnsOptions = {
  onEdit: (product: Types.IEntity.Product) => void;
  onDelete: (product: Types.IEntity.Product) => void;
  onAttributes: (product: Types.IEntity.Product) => void;
};

const hasDiscount = (product: Types.IEntity.Product) =>
  product.discountPrice > 0 && product.discountPrice < product.price;

export const getProductColumns = ({
  onEdit,
  onDelete,
  onAttributes
}: ProductColumnsOptions): TableColumn<Types.IEntity.Product>[] => [
  {
    key: 'imageUrl',
    title: '',
    width: 64,
    render: product => <Thumbnail src={product.imageUrl ? mediaUrl(product.imageUrl) : ''} alt={product.name} />
  },
  {
    key: 'name',
    title: productsLocale.product,
    render: product => (
      <div className={classes.primaryCell}>
        <Text className={classes.primaryText} lineClamp={1} title={product.name}>
          {product.name || common.dash}
        </Text>
        {product.nameUz && product.nameUz !== product.name ? (
          <Text className={classes.secondaryText} lineClamp={1}>
            {product.nameUz}
          </Text>
        ) : null}
      </div>
    )
  },
  {
    key: 'categoryName',
    title: productsLocale.category,
    render: product =>
      product.categoryName ? (
        <Text size="sm" className={classes.mutedText} lineClamp={1}>
          {product.categoryName}
        </Text>
      ) : (
        <Text size="sm" c="dimmed">
          {common.uncategorized}
        </Text>
      )
  },
  {
    key: 'price',
    title: productsLocale.price,
    numeric: true,
    render: product => (
      <div className={classes.priceCell}>
        <span className={classes.price}>{formatPrice(product.effectivePrice || product.price)}</span>
        {hasDiscount(product) ? <span className={classes.oldPrice}>{formatPrice(product.price)}</span> : null}
      </div>
    )
  },
  {
    key: 'stockQuantity',
    title: productsLocale.stock,
    numeric: true,
    render: product => (
      <span className={product.stockQuantity > 0 ? classes.stock : classes.stockEmpty}>{product.stockQuantity}</span>
    )
  },
  {
    key: 'isActive',
    title: productsLocale.status,
    nowrap: true,
    render: product => (
      <Badge color={product.isActive ? 'teal' : 'gray'} variant="dot" size="md">
        {product.isActive ? common.active : common.inactive}
      </Badge>
    )
  },
  {
    key: 'actions',
    title: common.actions,
    align: 'right',
    width: 128,
    render: product => (
      <Group gap={2} wrap="nowrap" justify="flex-end">
        <RowAction label={common.edit} icon={<IconPencil size={16} />} onClick={() => onEdit(product)} />
        <RowAction
          label={productsLocale.attributes}
          icon={<IconTags size={16} />}
          onClick={() => onAttributes(product)}
        />
        <RowAction label={common.delete} icon={<IconTrash size={16} />} onClick={() => onDelete(product)} danger />
      </Group>
    )
  }
];
