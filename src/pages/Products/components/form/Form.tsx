import { Group, Stack } from '@mantine/core';

import * as Fields from '@/containers/Fields';
import { forms } from '@/locale/uz';
import { Hooks as CategoryHooks } from '@modules/categories';

type IProps = {
  showId?: boolean;
};

export default function Form({ showId = false }: IProps) {
  const { data: categories } = CategoryHooks.useList();

  const categoryOptions =
    categories?.data.map(category => ({
      value: String(category.id),
      label: category.name
    })) ?? [];

  return (
    <Stack gap="sm">
      <Fields.Select name="categoryId" label={forms.category} data={categoryOptions} numeric placeholder={forms.category} />

      <Fields.Text name="name" label={forms.name} placeholder={forms.name} />

      <Fields.Textarea name="description" label={forms.description} minRows={2} placeholder={forms.description} />

      <Group grow>
        <Fields.Number name="price" label={forms.price} decimalScale={2} min={0} placeholder={forms.price} />
        <Fields.Number name="discountPrice" label={forms.discountPrice} decimalScale={2} min={0} placeholder={forms.discountPrice} />
      </Group>

      <Group grow>
        <Fields.Number name="stockQuantity" label={forms.stock} min={0} placeholder={forms.stock} />
        <Fields.Number name="sortOrder" label={forms.sortOrder} min={0} placeholder={forms.sortOrder} />
      </Group>

      <Fields.Image name="imageUrl" label={forms.imageUrl} placeholder={forms.imagePlaceholder} />

      <Fields.Switch name="isActive" label={forms.activeVisible} />
    </Stack>
  );
}
