import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { useNavigate } from 'react-router-dom';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { Table } from '@/components/Table';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { common, orders as ordersLocale } from '@/locale/uz';
import { filterDefaultValues, type FilterFormValues } from '@/modules/orders/forms';
import { useDelete, useList } from '@/modules/orders/hooks';
import type * as Types from '@/modules/orders/types';
import { Filter, UpdateStatus } from '@/pages/Orders/Form';

import classes from './Orders.module.css';

import { getOrderColumns } from './columns';

const Orders = () => {
  const navigate = useNavigate();
  const { mutateAsync } = useDelete();
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const [editing, setEditing] = useState<Types.IEntity.Order | null>(null);
  const [filters, setFilters] = useState<FilterFormValues>(filterDefaultValues);

  const orders = useMemo(() => {
    const list = data?.data ?? [];
    return filters.status ? list.filter(order => order.status === filters.status) : list;
  }, [data?.data, filters.status]);

  const handleDelete = useCallback(
    (order: Types.IEntity.Order) => {
      modals.openConfirmModal({
        centered: true,
        title: ordersLocale.deleteTitle,
        children: (
          <Text size="sm">
            Buyurtma <strong>#{order.id}</strong> ni o&apos;chirasizmi? Bu amalni ortga qaytarib bo&apos;lmaydi.
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          try {
            await mutateAsync(order.id);
            toast.success(ordersLocale.deleted);
          } catch (error) {
            toast.error(getApiError(error).message || common.somethingWentWrong);
          }
        }
      });
    },
    [mutateAsync]
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        onOpen: order => navigate(`/orders/${order.id}`),
        onEdit: setEditing,
        onDelete: handleDelete
      }),
    [handleDelete, navigate]
  );

  return (
    <PageHeader title={ordersLocale.title} description={ordersLocale.description}>
      <div className={classes.container}>
        <div className={classes.content}>
          <Filter values={filters} onFilter={setFilters} />
        </div>
      </div>

      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          data={orders}
          minWidth={900}
          columns={columns}
          loading={isLoading}
          rowKey={order => order.id}
          emptyMessage="Buyurtmalar topilmadi"
        />
      )}

      <UpdateStatus opened={!!editing} order={editing} onClose={() => setEditing(null)} />
    </PageHeader>
  );
};

export default Orders;
