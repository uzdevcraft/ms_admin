import type { CSSProperties } from 'react';
import { Badge, Group, Skeleton, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconChevronRight, IconFolders, IconPencil, IconPlus, IconTemplate, IconTrash } from '@tabler/icons-react';
import cx from 'clsx';

import { RowAction } from '@/components/RowAction';
import { Thumbnail } from '@/components/Thumbnail';
import mediaUrl from '@common/utils/mediaUrl';
import { categories as locale, common } from '@/locale/uz';
import { Tree } from '@/modules/categories';
import type { CategoryIndex } from '@/modules/categories/tree';
import type * as Types from '@/modules/categories/types';

import classes from './CategoryTree.module.css';

type IProps = {
  index: CategoryIndex;
  /** Ids to render; `null` — everything. Used by search (matches + their parents). */
  visible: Set<number> | null;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  loading?: boolean;
  /** Template name by id (`GET /attribute-templates`); falls back to "#id". */
  templateName: (templateId: number) => string;
  onAddChild: (parent: Types.IEntity.Category) => void;
  onEdit: (category: Types.IEntity.Category) => void;
  onDelete: (category: Types.IEntity.Category) => void;
};

const LEVEL_COLORS = ['violet', 'blue', 'teal'] as const;

/** Departament › Kategoriya › Subkategoriya, one row per category with its actions. */
const CategoryTree = ({
  index,
  visible,
  expanded,
  onToggle,
  loading,
  templateName,
  onAddChild,
  onEdit,
  onDelete
}: IProps) => {
  const childrenOf = (parentId: number | null) =>
    index.childrenOf(parentId).filter(child => !visible || visible.has(child.id));

  const renderNode = (category: Types.IEntity.Category, depth: number) => {
    const children = childrenOf(category.id);
    const isOpen = expanded.has(category.id);
    const canHaveChildren = category.categoryLevel < Tree.PRODUCT_LEVEL;
    const template = Tree.templateSource(index, category.id);

    return (
      <li key={category.id} role="treeitem" aria-expanded={children.length ? isOpen : undefined}>
        <div
          className={cx(classes.row, !category.isActive && classes.rowInactive)}
          style={{ '--depth': depth } as CSSProperties}
        >
          {children.length ? (
            <UnstyledButton
              className={cx(classes.toggle, isOpen && classes.toggleOpen)}
              onClick={() => onToggle(category.id)}
              aria-label={category.name}
            >
              <IconChevronRight size={16} />
            </UnstyledButton>
          ) : (
            <span className={classes.toggleSpacer} />
          )}

          <Thumbnail src={category.imageUrl ? mediaUrl(category.imageUrl) : ''} alt={category.name} size={32} />

          <div className={classes.name}>
            <Group gap={8} wrap="nowrap">
              <Text size="sm" fw={600} truncate>
                {category.name || common.dash}
              </Text>
              {category.code && <span className={classes.code}>{category.code}</span>}
            </Group>
            {category.nameRu && (
              <Text size="xs" c="dimmed" truncate>
                {category.nameRu}
              </Text>
            )}
          </div>

          <div className={classes.meta}>
            {!category.isActive && (
              <Badge color="gray" variant="dot" size="sm">
                {locale.inactive}
              </Badge>
            )}
            {template && (
              <Tooltip
                label={
                  template.inherited
                    ? locale.templateFrom(index.byId.get(template.sourceId)?.name ?? `#${template.sourceId}`)
                    : locale.templateOwnBadge
                }
              >
                <Badge
                  className={cx(template.inherited && classes.templateInherited)}
                  color="grape"
                  variant={template.inherited ? 'outline' : 'light'}
                  radius="sm"
                  tt="none"
                  fw={500}
                  leftSection={<IconTemplate size={12} />}
                >
                  {templateName(template.templateId)}
                </Badge>
              </Tooltip>
            )}
            {category.childCount > 0 && (
              <span className={classes.children}>
                <IconFolders size={14} />
                {locale.childCount(category.childCount)}
              </span>
            )}
            <Badge color={LEVEL_COLORS[category.categoryLevel]} variant="light" radius="sm" tt="none" fw={500}>
              {locale.levels[category.categoryLevel]}
            </Badge>
          </div>

          <Group gap={2} wrap="nowrap" className={classes.actions}>
            <RowAction
              label={locale.addChild}
              icon={<IconPlus size={16} />}
              onClick={() => onAddChild(category)}
              disabled={!canHaveChildren}
            />
            <RowAction label={common.edit} icon={<IconPencil size={16} />} onClick={() => onEdit(category)} />
            <RowAction label={common.delete} icon={<IconTrash size={16} />} onClick={() => onDelete(category)} danger />
          </Group>
        </div>

        {children.length > 0 && isOpen && (
          <ul role="group" className={classes.list}>
            {children.map(child => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (loading) {
    return (
      <div className={classes.skeleton}>
        {Array.from({ length: 6 }, (_, item) => (
          <Skeleton key={item} height={36} radius="sm" />
        ))}
      </div>
    );
  }

  const roots = childrenOf(null);

  if (!roots.length) {
    return <div className={classes.empty}>{locale.empty}</div>;
  }

  return (
    <ul role="tree" className={classes.list}>
      {roots.map(root => renderNode(root, 0))}
    </ul>
  );
};

export default CategoryTree;
