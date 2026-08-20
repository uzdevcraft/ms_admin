import { useCallback, useMemo, useState } from "react";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

import { ErrorAlert } from "@/components/ErrorAlert";
import { PageHeader } from "@/components/PageHeader";
import { Table } from "@/components/Table";
import getApiError from "@common/utils/getApiError";
import { toast } from "@/common/utils/toast";
import { common, products as productsLocale } from "@/locale/uz";
import { useDelete, useList } from "@/modules/products/hooks";
import type * as Types from "@/modules/products/types";
import { Create, Update } from "@/pages/Products/Form";

import { getProductColumns } from "./columns";

const Products = () => {
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const remove = useDelete();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Types.IEntity.Product | null>(null);

  const products = data?.data ?? [];

  const handleDelete = useCallback(
    (product: Types.IEntity.Product) => {
      modals.openConfirmModal({
        title: productsLocale.deleteTitle,
        children: (
          <Text size="sm">
            <strong>{product.name}</strong> ni o&apos;chirasizmi? Bu amalni
            ortga qaytarib bo&apos;lmaydi.
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          try {
            await remove.mutateAsync(product.id);
            toast.success(productsLocale.deleted);
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
      getProductColumns({
        onEdit: setEditing,
        onDelete: handleDelete,
      }),
    [handleDelete],
  );

  return (
    <PageHeader
      title={productsLocale.title}
      description={productsLocale.description}
      actions={
        <Button onClick={() => setCreateOpen(true)}>
          {productsLocale.add}
        </Button>
      }
    >
      {isError ? (
        <ErrorAlert isFetching={isFetching} refetch={refetch} />
      ) : (
        <Table
          columns={columns}
          data={products}
          loading={isLoading}
          emptyMessage="Mahsulotlar topilmadi"
          rowKey={(product) => product.id}
          minWidth={860}
        />
      )}

      <Create opened={createOpen} onClose={() => setCreateOpen(false)} />
      <Update
        opened={!!editing}
        product={editing}
        onClose={() => setEditing(null)}
      />
    </PageHeader>
  );
};

export default Products;
