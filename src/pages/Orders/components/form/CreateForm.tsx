import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import * as Fields from '@/containers/Fields';
import { forms, userTesting } from '@/locale/uz';
import type { CreateFormValues } from '@/modules/orders/forms';
import { Hooks as ProductHooks } from '@modules/products';

export default function CreateForm() {
  const {
    control,
    formState: { errors }
  } = useFormContext<CreateFormValues>();
  const { data: products } = ProductHooks.useList();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const productOptions =
    products?.data.map(product => ({
      value: String(product.id),
      label: product.name
    })) ?? [];

  return (
    <Stack gap="sm">
      {fields.map((field, index) => (
        <Group key={field.id} align="flex-end" grow>
          <Fields.Select
            name={`items.${index}.productId`}
            label={index === 0 ? forms.product : undefined}
            data={productOptions}
            searchable
            numeric
          />
          <Fields.Number
            name={`items.${index}.quantity`}
            label={index === 0 ? userTesting.quantity : undefined}
            min={1}
          />
          {fields.length > 1 && (
            <ActionIcon variant="subtle" color="red" onClick={() => remove(index)} aria-label={userTesting.removeItem}>
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
        {userTesting.addItem}
      </Button>

      <Fields.Text name="deliveryAddress" label={userTesting.deliveryAddress} />

      <Fields.Textarea name="comment" label={userTesting.comment} minRows={2} />
    </Stack>
  );
}
