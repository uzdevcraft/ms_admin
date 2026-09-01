import { ActionIcon, Badge, Group, Image, Text } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';

import type { TableColumn } from '@/components/Table';
import { formatDate } from '@/common/utils/format';
import mediaUrl from '@common/utils/mediaUrl';
import { categories as categoriesLocale, common } from '@/locale/uz';
import type * as Types from '@/modules/categories/types';
import dayjs from 'dayjs';

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
    render: category =>
      category.imageUrl ? (
        <Image src={mediaUrl(category.imageUrl)} alt={category.name} w={40} h={40} radius="sm" fit="cover" />
      ) : (
        <Text c="dimmed" size="sm">
          {common.dash}
        </Text>
      )
  },
  {
    key: 'name',
    title: categoriesLocale.category,
    render: category => (
      <div>
        <Text fw={500} size="sm">
          {category.name || common.dash}
        </Text>
        {category.description ? (
          <Text c="dimmed" size="xs" lineClamp={1} maw={240}>
            {category.description}
          </Text>
        ) : null}
      </div>
    )
  },
  {
    key: 'sortOrder',
    title: categoriesLocale.sortOrder,
    align: 'center'
  },
  {
    key: 'isActive',
    title: categoriesLocale.status,
    render: category => (
      <Badge color={category.isActive ? 'teal' : 'gray'} radius="sm" variant="outline">
        {category.isActive ? common.active : common.inactive}
      </Badge>
    )
  },
  {
    key: 'createdAt',
    title: categoriesLocale.created,
    render: category =>
      category.createdAt ? `${dayjs(`${category.createdAt}`).format('DD/MM/YYYY HH:mm')}` : common.dash
  },
  {
    key: 'actions',
    title: common.actions,
    render: category => (
      <Group gap={8} wrap="nowrap">
        <ActionIcon color="blue" aria-label={common.edit} onClick={() => onEdit(category)}>
          <IconPencil size={16} />
        </ActionIcon>
        <ActionIcon color="red" aria-label={common.delete} onClick={() => onDelete(category)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    )
  }
];
