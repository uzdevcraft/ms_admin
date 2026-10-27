import { useMemo } from 'react';
import { Group, SimpleGrid, Stack } from '@mantine/core';
import { useFormContext, useWatch } from 'react-hook-form';

import * as Fields from '@/containers/Fields';
import { categories as locale, forms } from '@/locale/uz';
import { Hooks as AttributeHooks } from '@/modules/attributes';
import { Hooks as TemplateHooks } from '@/modules/attribute-templates';
import { Tree } from '@/modules/categories';
import type { CreateFormValues } from '@/modules/categories/forms';
import type { CategoryIndex } from '@/modules/categories/tree';

// Hints under the inputs keep the two selects aligned.
const HINT_BELOW: ('label' | 'input' | 'description' | 'error')[] = ['label', 'input', 'description', 'error'];

type IProps = {
  index: CategoryIndex;
  /** Edited category: it and its descendants can't become its parent. */
  categoryId?: number;
};

export default function Form({ index, categoryId = 0 }: IProps) {
  const { control } = useFormContext<CreateFormValues>();
  const [parentId, attributeTemplateId] = useWatch({ control, name: ['parentId', 'attributeTemplateId'] });

  // ---- parent: departments and categories (a subcategory can't have children)
  const parentOptions = useMemo(() => {
    const excluded = new Set(categoryId ? [categoryId, ...Tree.descendantIds(index, categoryId)] : []);
    return [...index.byId.values()]
      .filter(category => category.categoryLevel < Tree.PRODUCT_LEVEL && !excluded.has(category.id))
      .map(category => ({ value: String(category.id), label: Tree.pathLabel(Tree.pathTo(index, category.id)) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [index, categoryId]);

  // ---- template: own one, or what the category / its parent resolves to now
  const templates = TemplateHooks.useList();
  const templateOptions = (templates.data?.data ?? []).map(template => ({
    value: String(template.id),
    label: `${template.nameUz} (${template.items.length})`
  }));
  // Empty template = inherit: show what the chosen parent resolves to.
  const inherited = AttributeHooks.useForCategory(parentId ?? 0, !attributeTemplateId);

  let templateHint = '';
  if (!attributeTemplateId) {
    const data = parentId ? inherited.data : undefined;
    if (data?.templateId) {
      const source = data.templateSourceCategoryId ?? parentId ?? 0;
      templateHint = locale.templateInherited(data.templateName, index.byId.get(source)?.name ?? `#${source}`);
    } else if (!parentId || data) {
      templateHint = locale.templateNone;
    }
  }

  return (
    <Stack>
      <Fields.Text name="name" label={forms.name} placeholder="Bo'lim nomini kiriting" withAsterisk />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Fields.Text name="nameUz" label={forms.nameUz} placeholder={locale.nameUzHint} />
        <Fields.Text name="nameRu" label={forms.nameRu} placeholder="Название категории" />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Fields.Select
          name="parentId"
          numeric
          label={locale.parent}
          placeholder={locale.parentPlaceholder}
          description={locale.parentHint}
          inputWrapperOrder={HINT_BELOW}
          data={parentOptions}
          searchable
          clearable
        />
        <Fields.Select
          name="attributeTemplateId"
          numeric
          label={locale.template}
          placeholder={locale.templatePlaceholder}
          description={templateHint || undefined}
          inputWrapperOrder={HINT_BELOW}
          data={templateOptions}
          searchable
          clearable
        />
      </SimpleGrid>

      <Fields.Textarea name="description" label={forms.description} placeholder="Bo'lim tavsifi" />

      <Fields.Image name="imageUrl" label={forms.imageUrl} placeholder={forms.imagePlaceholder} />

      <Group grow align="flex-start">
        <Fields.Number name="sortOrder" label={forms.sortOrder} placeholder="Bo'sh qoldirilsa avtomatik tartiblash" />
        <Stack gap={4} pt={28}>
          <Fields.Switch name="isActive" label={forms.activeVisible} size="md" />
        </Stack>
      </Group>
    </Stack>
  );
}
