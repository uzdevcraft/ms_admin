import { get } from 'radash';

import type * as Types from './types';

export const TemplateItem = (src: unknown): Types.IEntity.TemplateItem => ({
  id: get(src, 'id', 0),
  attributeDefinitionId: get(src, 'attributeDefinitionId', 0),
  code: get(src, 'code', ''),
  nameUz: get(src, 'nameUz', ''),
  nameRu: get(src, 'nameRu', '') ?? '',
  required: get(src, 'required', false),
  sortOrder: get(src, 'sortOrder', 0)
});

export const Template = (src: unknown): Types.IEntity.Template => ({
  id: get(src, 'id', 0),
  nameUz: get(src, 'nameUz', ''),
  items: (get(src, 'items', []) as unknown[]).map(TemplateItem).sort((a, b) => a.sortOrder - b.sortOrder)
});

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src) ? src : get(src, 'content', get(src, 'data', []));

  return {
    data: (items as unknown[]).map(Template)
  };
};

/** Create/update answer with the template or just its id. */
export const Saved = (src: unknown, values: Types.IForm.Create, id = 0): Types.IEntity.Template =>
  typeof src === 'object' && src
    ? Template(src)
    : Template({ ...CreateRequest(values), id: typeof src === 'number' ? src : id });

export const CreateRequest = (values: Types.IForm.Create): Types.IApi.Create.Request => ({
  nameUz: values.nameUz.trim(),
  items: values.items.map((item, index) => ({
    attributeDefinitionId: item.attributeDefinitionId,
    required: item.required,
    sortOrder: index + 1
  }))
});

export const UpdateRequest = (id: number, values: Types.IForm.Create): Types.IApi.Update.Request => ({
  id,
  ...CreateRequest(values)
});

export const FormValues = (template: Types.IEntity.Template): Types.IForm.Update => ({
  id: template.id,
  nameUz: template.nameUz,
  items: template.items.map(item => ({ attributeDefinitionId: item.attributeDefinitionId, required: item.required }))
});
