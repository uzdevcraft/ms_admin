import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { productSchema, type ProductFormValues } from '../../schemas';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

interface ProductFormModalProps {
  opened: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ProductFormModal({
  opened,
  onClose,
  product,
  onSubmit,
  isLoading,
}: ProductFormModalProps) {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      originCountry: '',
      categoryId: '',
      stock: 0,
      imageUrl: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (opened) {
      reset(
        product
          ? {
              name: product.name,
              description: product.description,
              price: product.price,
              currency: product.currency,
              originCountry: product.originCountry,
              categoryId: product.categoryId,
              stock: product.stock,
              imageUrl: product.imageUrl,
              isActive: product.isActive,
            }
          : {
              name: '',
              description: '',
              price: 0,
              currency: 'USD',
              originCountry: '',
              categoryId: '',
              stock: 0,
              imageUrl: '',
              isActive: true,
            },
      );
    }
  }, [opened, product, reset]);

  const categoryOptions =
    categories?.map((c) => ({ value: c.id, label: c.name })) ?? [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="sm">
          <TextInput label="Name" error={errors.name?.message} {...register('name')} />
          <Textarea
            label="Description"
            minRows={2}
            error={errors.description?.message}
            {...register('description')}
          />
          <Group grow>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Price"
                  decimalScale={2}
                  min={0}
                  error={errors.price?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(Number(v) || 0)}
                />
              )}
            />
            <TextInput
              label="Currency"
              error={errors.currency?.message}
              {...register('currency')}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Origin country"
              placeholder="e.g. Japan, Italy"
              error={errors.originCountry?.message}
              {...register('originCountry')}
            />
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  label="Category"
                  data={categoryOptions}
                  error={errors.categoryId?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(v ?? '')}
                />
              )}
            />
          </Group>
          <Group grow>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <NumberInput
                  label="Stock"
                  min={0}
                  error={errors.stock?.message}
                  value={field.value}
                  onChange={(v) => field.onChange(Number(v) || 0)}
                />
              )}
            />
            <TextInput
              label="Image URL"
              error={errors.imageUrl?.message}
              {...register('imageUrl')}
            />
          </Group>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                label="Active (visible in store)"
                checked={field.value}
                onChange={(e) => field.onChange(e.currentTarget.checked)}
              />
            )}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} color="violet">
              {product ? 'Save changes' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
