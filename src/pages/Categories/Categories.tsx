import { useCallback, useMemo, useState } from 'react';
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { Table } from '@/components/Table';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { categories as categoriesLocale, common } from '@/locale/uz';
import { useDelete, useList } from '@/modules/categories/hooks';
import type * as Types from '@/modules/categories/types';
import { Create, Update } from '@/pages/Categories/Form';

import { getCategoryColumns } from './columns';

const Categories = () => {
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const remove = useDelete();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Category | null>(null);

  const categories = data?.data ?? [];

  const handleDelete = useCallback(
    (category: Types.IEntity.Category) => {
      modals.openConfirmModal({
        centered: true,
        title: categoriesLocale.deleteTitle,
        children: (
          <Text size="sm">
            <strong>{category.name}</strong> ni o&apos;chirasizmi? Bu kategoriyadagi mahsulotlar o&apos;z holida qoladi.
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
    [remove]
  );

  const columns = useMemo(
    () =>
      getCategoryColumns({
        onEdit: setEditing,
        onDelete: handleDelete
      }),
    [handleDelete]
  );

  return (
    <PageHeader
      title={categoriesLocale.title}
      description={categoriesLocale.description}
      actions={<Button onClick={() => setCreateOpen(true)}>{categoriesLocale.add}</Button>}
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          columns={columns}
          data={categories}
          loading={isLoading}
          emptyMessage="Kategoriyalar topilmadi"
          rowKey={category => category.id}
          minWidth={720}
        />
      )}

      <Create opened={createOpen} onClose={() => setCreateOpen(false)} />
      <Update opened={!!editing} category={editing} onClose={() => setEditing(null)} />
    </PageHeader>
  );
};

export default Categories;
