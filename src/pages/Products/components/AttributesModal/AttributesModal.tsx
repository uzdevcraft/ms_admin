import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

import getApiError from '@common/utils/getApiError';
import { toast } from '@/common/utils/toast';
import { common, products as productsLocale } from '@/locale/uz';
import { useProductAttributes, useSaveProductAttributes } from '@/modules/product-attributes';
import type { ProductAttributeGroup, ProductAttributes, VariantInput } from '@/modules/product-attributes';
import type * as ProductTypes from '@/modules/products/types';

interface IProps {
  product: ProductTypes.IEntity.Product | null;
  opened: boolean;
  onClose: () => void;
}

type VariantDraft = VariantInput & { key: string; effectivePrice?: number };

const createDraft = (): VariantDraft => ({
  key: crypto.randomUUID(),
  selectedOptions: {},
  sku: '',
  stockQuantity: 0
});

const optionLabel = (valueUz: string, valueRu: string) => (valueRu ? `${valueUz} / ${valueRu}` : valueUz);

const variantLabel = (variant: VariantDraft, groups: ProductAttributeGroup[]) =>
  groups
    .map(group => {
      const selectedId = variant.selectedOptions[group.attributeDefinitionId];
      const option = group.options.find(item => item.id === selectedId);
      return option ? `${group.nameUz}: ${option.valueUz}` : null;
    })
    .filter(Boolean)
    .join(', ');

interface IEditorProps {
  data: ProductAttributes;
  productId: number;
  onClose: () => void;
}

function VariantEditor({ data, productId, onClose }: IEditorProps) {
  const save = useSaveProductAttributes();
  const [variants, setVariants] = useState<VariantDraft[]>(() =>
    data.variants.length
      ? data.variants.map(variant => ({
          key: `variant-${variant.variantId}`,
          variantId: variant.variantId,
          selectedOptions: variant.selectedOptions,
          sku: variant.sku,
          stockQuantity: variant.stockQuantity,
          effectivePrice: variant.effectivePrice
        }))
      : [createDraft()]
  );
  const groups = data.variantGroups;

  const updateVariant = (index: number, patch: Partial<VariantDraft>) => {
    setVariants(current =>
      current.map((variant, itemIndex) => (itemIndex === index ? { ...variant, ...patch } : variant))
    );
  };

  const updateOption = (index: number, attributeDefinitionId: number, optionId: number | null) => {
    const selectedOptions = { ...variants[index].selectedOptions };
    if (optionId) selectedOptions[attributeDefinitionId] = optionId;
    else delete selectedOptions[attributeDefinitionId];
    updateVariant(index, { selectedOptions });
  };

  const handleSave = async () => {
    const invalidIndex = variants.findIndex(
      variant => !variant.sku.trim() || groups.some(group => !variant.selectedOptions[group.attributeDefinitionId])
    );

    if (invalidIndex >= 0) {
      toast.error(`${invalidIndex + 1}-variant uchun SKU va barcha variant xususiyatlarini tanlang`);
      return;
    }

    try {
      await save.mutateAsync({
        productId,
        variants: variants.map(variant => ({
          variantId: variant.variantId,
          selectedOptions: variant.selectedOptions,
          sku: variant.sku,
          priceOverride: variant.priceOverride,
          stockQuantity: variant.stockQuantity
        }))
      });
      toast.success(productsLocale.attributesSaved);
      onClose();
    } catch (error) {
      toast.error(getApiError(error).message || common.somethingWentWrong);
    }
  };

  return (
    <Stack gap="md">
      {!groups.length && <Text c="dimmed">Bu mahsulot uchun variant xususiyatlari topilmadi</Text>}

      {variants.map((variant, index) => (
        <Paper key={variant.key} withBorder p="md" radius="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fw={600}>Variant {index + 1}</Text>
              {variants.length > 1 && (
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => setVariants(items => items.filter((_, i) => i !== index))}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              )}
            </Group>

            <Group grow align="flex-start">
              {groups.map(group => (
                <Select
                  key={group.attributeDefinitionId}
                  label={group.nameUz}
                  data={group.options.map(option => ({
                    value: String(option.id),
                    label: optionLabel(option.valueUz, option.valueRu)
                  }))}
                  value={
                    variant.selectedOptions[group.attributeDefinitionId]
                      ? String(variant.selectedOptions[group.attributeDefinitionId])
                      : null
                  }
                  onChange={value => updateOption(index, group.attributeDefinitionId, value ? Number(value) : null)}
                  searchable
                  clearable
                  required
                />
              ))}
            </Group>

            <Group grow align="flex-start">
              <TextInput
                label="SKU"
                value={variant.sku}
                onChange={event => updateVariant(index, { sku: event.currentTarget.value })}
                required
              />
              <NumberInput
                label="Maxsus narx"
                description={variant.effectivePrice ? `Joriy narx: ${variant.effectivePrice}` : undefined}
                value={variant.priceOverride}
                onChange={value =>
                  updateVariant(index, { priceOverride: typeof value === 'number' ? value : undefined })
                }
                min={0}
                decimalScale={2}
              />
              <NumberInput
                label="Ombordagi soni"
                value={variant.stockQuantity}
                onChange={value => updateVariant(index, { stockQuantity: typeof value === 'number' ? value : 0 })}
                min={0}
                required
              />
            </Group>

            {variantLabel(variant, groups) && (
              <Text size="xs" c="dimmed">
                {variantLabel(variant, groups)}
              </Text>
            )}
          </Stack>
        </Paper>
      ))}

      <Button
        variant="light"
        leftSection={<IconPlus size={18} />}
        onClick={() => setVariants(items => [...items, createDraft()])}
      >
        Variant qo&apos;shish
      </Button>

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          {common.cancel}
        </Button>
        <Button onClick={handleSave} loading={save.isPending} disabled={!groups.length}>
          {common.save}
        </Button>
      </Group>
    </Stack>
  );
}

export default function AttributesModal({ product, opened, onClose }: IProps) {
  const productId = product?.id;
  const { data, isLoading, isError, refetch } = useProductAttributes({ productId });

  return (
    <Modal opened={opened} onClose={onClose} title={`${product?.name ?? ''} — variantlar`} centered size="xl">
      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : isError ? (
        <Stack align="center" py="lg">
          <Text c="red">Variantlarni yuklab bo&apos;lmadi</Text>
          <Button variant="light" onClick={() => void refetch()}>
            Qayta urinish
          </Button>
        </Stack>
      ) : data && productId ? (
        <VariantEditor key={productId} data={data} productId={productId} onClose={onClose} />
      ) : null}
    </Modal>
  );
}
