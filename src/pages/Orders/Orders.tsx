import { useCallback, useMemo, useState } from "react";
import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import { ErrorAlert } from "@/components/ErrorAlert";
import { PageHeader } from "@/components/PageHeader";
import { Table } from "@/components/Table";
import getApiError from "@common/utils/getApiError";
import { toast } from "@/common/utils/toast";
import { common, orders as ordersLocale } from "@/locale/uz";
import { useDelete, useList } from "@/modules/orders/hooks";
import type * as Types from "@/modules/orders/types";
import { UpdateStatus } from "@/pages/Orders/Form";

import { getOrderColumns } from "./columns";

const Orders = () => {
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const remove = useDelete();
  const [editing, setEditing] = useState<Types.IEntity.Order | null>(null);

  const orders = data?.data ?? [];

  const handleDelete = useCallback(
    (order: Types.IEntity.Order) => {
      modals.openConfirmModal({
        title: ordersLocale.deleteTitle,
        children: (
          <Text size="sm">
            Buyurtma <strong>#{order.id}</strong> ni o&apos;chirasizmi? Bu
            amalni ortga qaytarib bo&apos;lmaydi.
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          try {
            await remove.mutateAsync(order.id);
            toast.success(ordersLocale.deleted);
          } catch (error) {
            toast.error(
              getApiError(error).message || common.somethingWentWrong,
            );
          }
        },
      });
    },
    [remove],
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        onEdit: setEditing,
        onDelete: handleDelete,
      }),
    [handleDelete],
  );

  return (
    <PageHeader
      title={ordersLocale.title}
      description={ordersLocale.description}
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          columns={columns}
          data={orders}
          loading={isLoading}
          emptyMessage="Buyurtmalar topilmadi"
          rowKey={(order) => order.id}
          minWidth={900}
        />
      )}

      <UpdateStatus
        opened={!!editing}
        order={editing}
        onClose={() => setEditing(null)}
      />
    </PageHeader>
  );
};

export default Orders;
