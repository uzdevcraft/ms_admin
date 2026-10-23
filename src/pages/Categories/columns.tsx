import { Badge, Group, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import { DateTime } from '@/components/DateTime';
import { RowAction } from '@/components/RowAction';
import type { TableColumn } from '@/components/Table';
import { Thumbnail } from '@/components/Thumbnail';
import mediaUrl from '@common/utils/mediaUrl';
import { categories as categoriesLocale, common } from '@/locale/uz';
import type * as Types from '@/modules/categories/types';

type CategoryColumnsOptions = {
  onEdit: (category: Types.IEntity.Category) => void;
  onDelete: (category: Types.IEntity.Category) => void;
};

export const getCategoryColumns = ({
  onEdit,
  onDelete
}: CategoryColumnsOptions): TableColumn<Types.IEntity.Category>[] => [
  {
    key: 'imageUrl',
    title: '',
    width: 64,
    render: category => <Thumbnail src={category.imageUrl ? mediaUrl(category.imageUrl) : ''} alt={category.name} />
  },
  {
    key: 'name',
    title: categoriesLocale.category,
    render: category => (
      <div>
        <Text fw={600} size="sm" lineClamp={1}>
          {category.name || common.dash}
        </Text>
        {category.description ? (
          <Text c="dimmed" size="xs" lineClamp={1} maw={320}>
            {category.description}
          </Text>
        ) : null}
      </div>
    )
  },
  {
    key: 'sortOrder',
    title: categoriesLocale.sortOrder,
    numeric: true
  },
  {
    key: 'isActive',
    title: categoriesLocale.status,
    nowrap: true,
    render: category => (
      <Badge color={category.isActive ? 'teal' : 'gray'} variant="dot" size="md">
        {category.isActive ? common.active : common.inactive}
      </Badge>
    )
  },
  {
    key: 'createdAt',
    title: categoriesLocale.created,
    render: category => <DateTime value={category.createdAt} />
  },
  {
    key: 'actions',
    title: common.actions,
    align: 'right',
    width: 96,
    render: category => (
      <Group gap={2} wrap="nowrap" justify="flex-end">
        <RowAction label={common.edit} icon={<IconPencil size={16} />} onClick={() => onEdit(category)} />
        <RowAction label={common.delete} icon={<IconTrash size={16} />} onClick={() => onDelete(category)} danger />
      </Group>
    )
  }
];
