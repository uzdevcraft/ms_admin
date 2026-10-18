import { get } from 'radash';

import type * as Types from './types';

export const AttributeDefinition = (src: unknown): Types.IEntity.AttributeDefinition => ({
  id: get(src, 'id', 0),
  code: get(src, 'code', ''),
  nameUz: get(src, 'nameUz', ''),
  nameRu: get(src, 'nameRu', null),
  attributeType: get(src, 'attributeType', 'SELECT') as Types.IEntity.AttributeType,
  displayType: get(src, 'displayType', 'DROPDOWN') as Types.IEntity.AttributeDisplayType,
  variant: get(src, 'variant', false),
  filterable: get(src, 'filterable', false)
});

export const AttributeOption = (src: unknown): Types.IEntity.AttributeOption => ({
  id: get(src, 'id', 0),
  attributeDefinitionId: get(src, 'attributeDefinitionId', 0),
  valueUz: get(src, 'valueUz', ''),
  valueRu: get(src, 'valueRu', null),
  sortOrder: get(src, 'sortOrder', 0),
  metaJson: get(src, 'metaJson', null) as { colorHex?: string; iconUrl?: string } | null
});

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src) ? src : get(src, 'data', []);

  return {
    data: (items as unknown[]).map(AttributeDefinition)
  };
};

export const OptionList = (src: unknown): Types.IEntity.AttributeOption[] => {
  const items = Array.isArray(src) ? src : get(src, 'data', []);
  return (items as unknown[]).map(AttributeOption).sort((a, b) => a.sortOrder - b.sortOrder);
};

export const CreateRequest = (values: Types.IForm.AttributeDefinition): Types.IApi.Create.Request => ({
  code: values.code.trim().replace(/\s+/g, '_').toUpperCase(),
  nameUz: values.nameUz.trim(),
  nameRu: values.nameRu?.trim() || null,
  attributeType: values.attributeType,
  displayType: values.displayType,
  variant: values.variant,
  filterable: values.filterable
});

export const UpdateRequest = (id: number, values: Types.IForm.AttributeDefinition): Types.IApi.Update.Request => ({
  id,
  ...CreateRequest(values)
});

export const OptionCreateRequest = (
  values: Types.IForm.AttributeOption,
  displayType: Types.IEntity.AttributeDisplayType
): Types.IApi.OptionCreate.Request => ({
  valueUz: values.valueUz.trim(),
  valueRu: values.valueRu?.trim() || null,
  sortOrder: values.sortOrder,
  metaJson: displayType === 'SWATCH' && values.colorHex ? { colorHex: values.colorHex } : null
});

export const OptionUpdateRequest = (
  id: number,
  values: Types.IForm.AttributeOption,
  displayType: Types.IEntity.AttributeDisplayType
): Types.IApi.OptionUpdate.Request => ({
  id,
  ...OptionCreateRequest(values, displayType)
});

export const CategoryAttribute = (src: unknown): Types.IEntity.CategoryAttribute => ({
  ...AttributeDefinition(src),
  required: get(src, 'required', false),
  options: OptionList(get(src, 'options', []))
});

export const CategoryAttributes = (
  items: Types.IEntity.CategoryAttribute[],
  source: Types.IQuery.CategoryAttributes['source']
): Types.IQuery.CategoryAttributes => ({
  specs: items.filter(item => !item.variant),
  variants: items.filter(item => item.variant),
  source
});
