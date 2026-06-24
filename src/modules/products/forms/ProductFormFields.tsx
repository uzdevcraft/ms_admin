import {
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Hooks as CategoryHooks } from '@modules/categories';
import type { ProductFormValues } from './schema';

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function ProductFormFields({ register, control, errors }: ProductFormFieldsProps) {
  const { data: categories } = CategoryHooks.useList();

  const categoryOptions =
    categories?.data.map((category) => ({
      value: String(category.id),
      label: category.name,
    })) ?? [];

  return (
    <Stack gap="sm">
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <Select
            label="Category"
            data={categoryOptions}
            error={errors.categoryId?.message}
            value={field.value ? String(field.value) : null}
            onChange={(value) => field.onChange(Number(value) || 0)}
          />
        )}
      />

      <Group grow>
        <TextInput label="Name" error={errors.name?.message} {...register('name')} />
        <TextInput label="Name (UZ)" error={errors.nameUz?.message} {...register('nameUz')} />
        <TextInput label="Name (RU)" error={errors.nameRu?.message} {...register('nameRu')} />
      </Group>

      <Textarea
        label="Description"
        minRows={2}
        error={errors.description?.message}
        {...register('description')}
      />
      <Group grow>
        <Textarea
          label="Description (UZ)"
          minRows={2}
          error={errors.descriptionUz?.message}
          {...register('descriptionUz')}
        />
        <Textarea
          label="Description (RU)"
          minRows={2}
          error={errors.descriptionRu?.message}
          {...register('descriptionRu')}
        />
      </Group>

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
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
        <Controller
          name="discountPrice"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Discount price"
              decimalScale={2}
              min={0}
              error={errors.discountPrice?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
      </Group>

      <Group grow>
        <Controller
          name="stockQuantity"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Stock"
              min={0}
              error={errors.stockQuantity?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
        <Controller
          name="sortOrder"
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Sort order"
              min={0}
              error={errors.sortOrder?.message}
              value={field.value}
              onChange={(value) => field.onChange(Number(value) || 0)}
            />
          )}
        />
      </Group>

      <TextInput label="Image URL" error={errors.imageUrl?.message} {...register('imageUrl')} />

      <Controller
        name="isActive"
        control={control}
        render={({ field }) => (
          <Switch
            label="Active (visible in store)"
            checked={field.value}
            onChange={(event) => field.onChange(event.currentTarget.checked)}
          />
        )}
      />
    </Stack>
  );
}
