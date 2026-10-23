import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { Table } from '@/components/Table';
import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { common, products as productsLocale, tables } from '@/locale/uz';
import { useDelete, useList } from '@/modules/products/hooks';
import type * as Types from '@/modules/products/types';
import { AttributesModal } from '@/pages/Products/components/AttributesModal';

import { getProductColumns } from './columns';

const Products = () => {
  const { data, isLoading, isError, refetch, isFetching } = useList();
  const remove = useDelete();
  const navigate = useNavigate();
  const [attributesProduct, setAttributesProduct] = useState<Types.IEntity.Product | null>(null);

  const products = data?.data ?? [];

  const handleDelete = useCallback(
    (product: Types.IEntity.Product) => {
      modals.openConfirmModal({
        centered: true,
        title: productsLocale.deleteTitle,
        children: (
          <Text size="sm">
            <strong>{product.name}</strong> ni o&apos;chirasizmi? Bu amalni ortga qaytarib bo&apos;lmaydi.
          </Text>
        ),
        labels: { confirm: common.delete, cancel: common.cancel },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          try {
            await remove.mutateAsync(product.id);
            toast.success(productsLocale.deleted);
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
      getProductColumns({
        onEdit: product => navigate(`/products/${product.id}/edit`),
        onDelete: handleDelete,
        onAttributes: setAttributesProduct
      }),
    [handleDelete, navigate]
  );

  return (
    <PageHeader
      title={productsLocale.title}
      description={productsLocale.description}
      actions={
        <Button leftSection={<IconPlus size={16} stroke={2} />} onClick={() => navigate('/products/new')}>
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
          rowKey={product => product.id}
          minWidth={860}
          title={tables.allProducts}
          count={isLoading ? undefined : products.length}
        />
      )}

      {attributesProduct && (
        <AttributesModal opened product={attributesProduct} onClose={() => setAttributesProduct(null)} />
      )}
    </PageHeader>
  );
};

export default Products;
