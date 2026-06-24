import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Hooks as ProductHooks } from '@modules/products';
import type { CreateOrderFormValues } from './schema';

interface CreateOrderFormFieldsProps {
  register: UseFormRegister<CreateOrderFormValues>;
  control: Control<CreateOrderFormValues>;
  errors: FieldErrors<CreateOrderFormValues>;
}

export function CreateOrderFormFields({ register, control, errors }: CreateOrderFormFieldsProps) {
  const { data: products } = ProductHooks.useList();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const productOptions =
    products?.data.map((product) => ({
      value: String(product.id),
      label: product.name,
    })) ?? [];

  return (
    <Stack gap="sm">
      {fields.map((field, index) => (
        <Group key={field.id} align="flex-end" grow>
          <Controller
            name={`items.${index}.productId`}
            control={control}
            render={({ field: productField }) => (
              <Select
                label={index === 0 ? 'Product' : undefined}
                data={productOptions}
                searchable
                error={errors.items?.[index]?.productId?.message}
                value={productField.value ? String(productField.value) : null}
                onChange={(value) => productField.onChange(Number(value) || 0)}
              />
            )}
          />
          <Controller
            name={`items.${index}.quantity`}
            control={control}
            render={({ field: quantityField }) => (
              <NumberInput
                label={index === 0 ? 'Quantity' : undefined}
                min={1}
                error={errors.items?.[index]?.quantity?.message}
                value={quantityField.value}
                onChange={(value) => quantityField.onChange(Number(value) || 1)}
              />
            )}
          />
          {fields.length > 1 && (
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => remove(index)}
              aria-label="Remove item"
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      ))}

      {typeof errors.items?.message === 'string' && (
        <Text size="sm" c="red">
          {errors.items.message}
        </Text>
      )}

      <Button
        variant="light"
        color="violet"
        leftSection={<IconPlus size={16} />}
        onClick={() => append({ productId: 0, quantity: 1 })}
      >
        Add item
      </Button>

      <TextInput
        label="Delivery address"
        error={errors.deliveryAddress?.message}
        {...register('deliveryAddress')}
      />

      <Textarea label="Comment" minRows={2} error={errors.comment?.message} {...register('comment')} />
    </Stack>
  );
}
