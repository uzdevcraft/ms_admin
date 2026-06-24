import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, Modal } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import getApiError from '@common/utils/getApiError';
import type * as Types from '../types';
import useUpdate from '../hooks/useUpdate';
import { ProductFormFields } from './ProductFormFields';
import { defaultValues, productFormSchema, type ProductFormValues } from './schema';

interface UpdateProps {
  opened: boolean;
  onClose: () => void;
  product: Types.IEntity.Product | null;
}

const toFormValues = (product: Types.IEntity.Product): ProductFormValues => ({
  categoryId: product.categoryId,
  name: product.name,
  nameUz: product.nameUz,
  nameRu: product.nameRu,
  description: product.description,
  descriptionUz: product.descriptionUz,
  descriptionRu: product.descriptionRu,
  price: product.price,
  discountPrice: product.discountPrice,
  imageUrl: product.imageUrl,
  stockQuantity: product.stockQuantity,
  isActive: product.isActive,
  sortOrder: product.sortOrder,
});

export function Update({ opened, onClose, product }: UpdateProps) {
  const update = useUpdate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (opened && product) {
      reset(toFormValues(product));
    }
  }, [opened, product, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!product) return;

    try {
      await update.mutateAsync({ id: product.id, values });
      notifications.show({ message: 'Product updated', color: 'green' });
      handleClose();
    } catch (error) {
      const apiError = getApiError(error);
      notifications.show({
        message: apiError.message || 'Something went wrong',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Edit Product" size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProductFormFields register={register} control={control} errors={errors} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={update.isPending} color="violet">
            Save changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
