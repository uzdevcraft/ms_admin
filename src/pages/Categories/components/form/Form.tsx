import * as Fields from '@/containers/Fields';

import { forms } from '@/locale/uz';

import { Stack } from '@mantine/core';

export default function Form() {
  return (
    <Stack>
      <Fields.Text name="name" label={forms.name} placeholder="Bo'lim nomini kiriting" />

      <Fields.Textarea name="description" label={forms.description} placeholder="Bo'lim tavsifi" />

      <Fields.Image name="imageUrl" label={forms.imageUrl} placeholder={forms.imagePlaceholder} />

      <Fields.Number name="sortOrder" label={forms.sortOrder} placeholder="Bo'sh qoldirilsa avtomatik tartiblash" />

      <Fields.Switch name="isActive" label={forms.activeVisible} size="md" />
    </Stack>
  );
}
