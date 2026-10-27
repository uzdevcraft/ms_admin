import { Badge, Group, Text } from '@mantine/core';
import { IconAlertTriangle, IconPencil, IconTrash } from '@tabler/icons-react';

import { RowAction } from '@/components/RowAction';
import type { TableColumn } from '@/components/Table';
import { attributeTemplates as locale, common } from '@/locale/uz';
import type * as Types from '@/modules/attribute-templates/types';

import classes from './AttributeTemplates.module.css';

type TemplateColumnsOptions = {
  /** attributeDefinitionId → is a variant axis (from `GET /attribute-definition`). */
  isVariant: (attributeDefinitionId: number) => boolean;
  onEdit: (template: Types.IEntity.Template) => void;
  onDelete: (template: Types.IEntity.Template) => void;
};

export const getTemplateColumns = ({
  isVariant,
  onEdit,
  onDelete
}: TemplateColumnsOptions): TableColumn<Types.IEntity.Template>[] => [
  {
    key: 'nameUz',
    title: locale.template,
    width: 220,
    render: template => (
      <div>
        <Text fw={600} size="sm" lineClamp={1}>
          {template.nameUz || common.dash}
        </Text>
        <Text c="dimmed" size="xs">
          ID {template.id}
        </Text>
      </div>
    )
  },
  {
    key: 'items',
    title: locale.attributes,
    render: template =>
      template.items.length ? (
        <div className={classes.chips}>
          {template.items.map(item => (
            <Badge
              key={item.id || item.attributeDefinitionId}
              variant={isVariant(item.attributeDefinitionId) ? 'light' : 'default'}
              color={isVariant(item.attributeDefinitionId) ? 'blue' : 'gray'}
              radius="sm"
              tt="none"
              fw={500}
            >
              {item.nameUz || item.code}
              {item.required && <span className={classes.required}>*</span>}
            </Badge>
          ))}
        </div>
      ) : (
        <Group gap={6} c="red" wrap="nowrap">
          <IconAlertTriangle size={16} />
          <Text size="sm" c="red" fw={500}>
            {locale.emptyItems}
          </Text>
        </Group>
      )
  },
  {
    key: 'actions',
    title: common.actions,
    align: 'right',
    width: 96,
    render: template => (
      <Group gap={2} wrap="nowrap" justify="flex-end">
        <RowAction label={common.edit} icon={<IconPencil size={16} />} onClick={() => onEdit(template)} />
        <RowAction label={common.delete} icon={<IconTrash size={16} />} onClick={() => onDelete(template)} danger />
      </Group>
    )
  }
];
