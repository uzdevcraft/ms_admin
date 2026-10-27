import { useCallback, useMemo, useState } from 'react';
import { Button, Group, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconFoldUp, IconPlus, IconSearch } from '@tabler/icons-react';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { categories as categoriesLocale, common, tables } from '@/locale/uz';
import { Hooks as TemplateHooks } from '@/modules/attribute-templates';
import { Tree } from '@/modules/categories';
import { useDelete, useList, useTree } from '@/modules/categories/hooks';
import type * as Types from '@/modules/categories/types';
import { Create, Update } from '@/pages/Categories/Form';

import { CategoryTree } from './components/tree';
import classes from './Categories.module.css';

const Categories = () => {
  const { data, isLoading, isError, refetch, isFetching } = useTree();
  const remove = useDelete();
  const [createParent, setCreateParent] = useState<Types.IEntity.Category | null | undefined>(undefined);
  const [editing, setEditing] = useState<Types.IEntity.Category | null>(null);
  const [query, setQuery] = useState('');
  // Toggled ids; departments start open, everything else closed.
  const [toggled, setToggled] = useState<Set<number>>(new Set());

  // `/categories/tree` has no `attributeTemplateId`; the flat list does — merge it for the template badges.
  const list = useList();
  const index = useMemo(() => {
    const ownTemplate = new Map((list.data?.data ?? []).map(item => [item.id, item.attributeTemplateId] as const));
    return Tree.buildIndex(
      (data?.data ?? []).map(category => ({
        ...category,
        attributeTemplateId: category.attributeTemplateId ?? ownTemplate.get(category.id) ?? null
      }))
    );
  }, [data, list.data]);

  const templates = TemplateHooks.useList();
  const templateNames = useMemo(
    () => new Map((templates.data?.data ?? []).map(template => [template.id, template.nameUz] as const)),
    [templates.data]
  );

  // ---- search: matches plus their parents, all expanded
  const visible = useMemo(() => {
    if (!query.trim()) return null;
    const ids = new Set<number>();
    Tree.search(index, query, Infinity).forEach(result => result.path.forEach(item => ids.add(item.id)));
    return ids;
  }, [index, query]);

  const expanded = useMemo(() => {
    if (visible) return visible;
    const ids = new Set(index.childrenOf(null).map(root => root.id));
    toggled.forEach(id => (ids.has(id) ? ids.delete(id) : ids.add(id)));
    return ids;
  }, [index, visible, toggled]);

  // Departments are open by default, so "closed" means every department toggled.
  const collapseAll = () => setToggled(new Set(index.childrenOf(null).map(root => root.id)));

  const toggle = (id: number) =>
    setToggled(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleDelete = useCallback(
    (category: Types.IEntity.Category) => {
      const descendants = Tree.descendantIds(index, category.id).length;
      modals.openConfirmModal({
        centered: true,
        title: categoriesLocale.deleteTitle,
        children: (
          <Text size="sm">
            <strong>{category.name}</strong> ni o&apos;chirasizmi?{' '}
            {descendants
              ? categoriesLocale.deleteWithChildren(descendants)
              : "Bu bo'limdagi mahsulotlar o'z holida qoladi."}
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          try {
            await remove.mutateAsync(category.id);
            toast.success(categoriesLocale.deleted);
          } catch (error) {
            toast.error(getApiError(error).message || common.somethingWentWrong);
          }
        }
      });
    },
    [index, remove]
  );

  const total = data?.data.length ?? 0;

  return (
    <PageHeader
      title={categoriesLocale.title}
      description={categoriesLocale.description}
      actions={
        <Button leftSection={<IconPlus size={16} stroke={2} />} onClick={() => setCreateParent(null)}>
          {categoriesLocale.add}
        </Button>
      }
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <div className={classes.card}>
          <div className={classes.header}>
            <Group gap={8}>
              <span className={classes.title}>{tables.categoryTree}</span>
              {!isLoading && <span className={classes.count}>{total}</span>}
            </Group>
            <div className={classes.toolbar}>
              <Button
                variant="default"
                leftSection={<IconFoldUp size={16} />}
                onClick={collapseAll}
                disabled={Boolean(visible) || expanded.size === 0}
              >
                {categoriesLocale.collapseAll}
              </Button>
              <TextInput
                className={classes.search}
                value={query}
                onChange={event => setQuery(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                placeholder={categoriesLocale.searchPlaceholder}
                aria-label={categoriesLocale.searchPlaceholder}
              />
            </div>
          </div>

          <CategoryTree
            index={index}
            visible={visible}
            expanded={expanded}
            onToggle={toggle}
            loading={isLoading}
            templateName={id => templateNames.get(id) ?? `#${id}`}
            onAddChild={setCreateParent}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Create
        opened={createParent !== undefined}
        parent={createParent ?? null}
        index={index}
        onClose={() => setCreateParent(undefined)}
      />
      <Update opened={!!editing} category={editing} index={index} onClose={() => setEditing(null)} />
    </PageHeader>
  );
};

export default Categories;
