import { useCallback, useMemo, useState } from 'react';
import { Badge, Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { get } from 'radash';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { Table } from '@/components/Table';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { attributeTemplates as locale, common, tables } from '@/locale/uz';
import { Hooks as AttributeHooks } from '@/modules/attributes';
import { Hooks } from '@/modules/attribute-templates';
import type * as Types from '@/modules/attribute-templates/types';

import { getTemplateColumns } from './columns';
import { Create, Update } from './Form';
import classes from './AttributeTemplates.module.css';

const AttributeTemplates = () => {
  const { data, isLoading, isError, refetch, isFetching } = Hooks.useList();
  const definitions = AttributeHooks.useList();
  const remove = Hooks.useDelete();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Template | null>(null);

  const templates = data?.data ?? [];

  const variantIds = useMemo(
    () => new Set((definitions.data?.data ?? []).filter(item => item.variant).map(item => item.id)),
    [definitions.data]
  );

  const handleDelete = useCallback(
    (template: Types.IEntity.Template) => {
      modals.openConfirmModal({
        centered: true,
        title: locale.deleteTitle,
        children: (
          <Text size="sm">
            <strong>{template.nameUz}</strong> {locale.deleteConfirm}
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          try {
            await remove.mutateAsync(template.id);
            toast.success(locale.deleted);
          } catch (error) {
            // 400 — the template is still linked to categories.
            const linked = get(error, 'response.status') === 400;
            toast.error(linked ? locale.deleteLinked : getApiError(error).message || common.somethingWentWrong);
          }
        }
      });
    },
    [remove]
  );

  const columns = useMemo(
    () =>
      getTemplateColumns({
        isVariant: id => variantIds.has(id),
        onEdit: setEditing,
        onDelete: handleDelete
      }),
    [variantIds, handleDelete]
  );

  return (
    <PageHeader
      title={locale.title}
      description={locale.description}
      actions={
        <Button leftSection={<IconPlus size={16} stroke={2} />} onClick={() => setCreateOpen(true)}>
          {locale.add}
        </Button>
      }
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          columns={columns}
          data={templates}
          loading={isLoading}
          emptyMessage={locale.empty}
          rowKey={template => template.id}
          minWidth={720}
          title={tables.allTemplates}
          count={isLoading ? undefined : templates.length}
          toolbar={
            <div className={classes.legend}>
              <Badge variant="light" color="blue" radius="sm" tt="none" fw={500}>
                {locale.variant}
              </Badge>
              <Badge variant="default" radius="sm" tt="none" fw={500}>
                {locale.spec}
              </Badge>
              <span>
                <span className={classes.required}>*</span> {locale.required}
              </span>
            </div>
          }
        />
      )}

      <Create opened={createOpen} onClose={() => setCreateOpen(false)} />
      <Update opened={!!editing} template={editing} onClose={() => setEditing(null)} />
    </PageHeader>
  );
};

export default AttributeTemplates;
