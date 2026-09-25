import { useEffect } from 'react';
import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import * as Fields from '@/containers/Fields';
import { forms, userTesting } from '@/locale/uz';
import { useProductAttributes } from '@/modules/product-attributes';
import type { CreateFormValues } from '@/modules/orders/forms';
import { Hooks as ProductHooks } from '@modules/products';

interface IOrderItemProps {
  index: number;
  showLabel: boolean;
  productOptions: { value: string; label: string }[];
  canRemove: boolean;
  onRemove: () => void;
}

function OrderItem({ index, showLabel, productOptions, canRemove, onRemove }: IOrderItemProps) {
  const { control, setValue } = useFormContext<CreateFormValues>();
  const productId = useWatch({ control, name: `items.${index}.productId` });
  const { data: attributes, isLoading } = useProductAttributes({ productId: productId || undefined });

  useEffect(() => {
    setValue(`items.${index}.productVariantId`, null);
  }, [index, productId, setValue]);

  const variantOptions =
    attributes?.variants.map(variant => {
      const selections = attributes.variantGroups
        .map(group => {
          const option = group.options.find(item => item.id === variant.selectedOptions[group.attributeDefinitionId]);
          return option?.valueUz;
        })
        .filter(Boolean)
        .join(' / ');

      return {
        value: String(variant.variantId),
        label: [variant.sku, selections].filter(Boolean).join(' — ')
      };
    }) ?? [];

  return (
    <Group align="flex-end" grow>
      <Fields.Select
        name={`items.${index}.productId`}
        label={showLabel ? forms.product : undefined}
        data={productOptions}
        searchable
        numeric
      />
      {!!productId && (isLoading || variantOptions.length > 0) && (
        <Fields.Select
          name={`items.${index}.productVariantId`}
          label={showLabel ? 'Variant' : undefined}
          data={variantOptions}
          placeholder={isLoading ? 'Yuklanmoqda...' : 'Variantni tanlang'}
          disabled={isLoading}
          required={variantOptions.length > 0}
          searchable
          numeric
        />
      )}
      <Fields.Number
        name={`items.${index}.quantity`}
        label={showLabel ? userTesting.quantity : undefined}
        min={1}
      />
      {canRemove && (
        <ActionIcon variant="subtle" color="red" onClick={onRemove} aria-label={userTesting.removeItem}>
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </Group>
  );
}

export default function CreateForm() {
  const { control, formState: { errors } } = useFormContext<CreateFormValues>();
  const { data: products } = ProductHooks.useList();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const productOptions = products?.data.map(product => ({ value: String(product.id), label: product.name })) ?? [];

  return (
    <Stack gap="sm">
      {fields.map((field, index) => (
        <OrderItem
          key={field.id}
          index={index}
          showLabel={index === 0}
          productOptions={productOptions}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        />
      ))}

      {typeof errors.items?.message === 'string' && <Text size="sm" c="red">{errors.items.message}</Text>}

      <Button
        variant="light"
        color="violet"
        leftSection={<IconPlus size={16} />}
        onClick={() => append({ productId: 0, productVariantId: null, quantity: 1 })}
      >
        {userTesting.addItem}
      </Button>

      <Fields.Text name="deliveryAddress" label={userTesting.deliveryAddress} />
      <Fields.Textarea name="comment" label={userTesting.comment} minRows={2} />
    </Stack>
  );
}
