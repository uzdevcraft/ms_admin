import * as yup from 'yup';

import { validation } from '@/locale/uz';

import type * as Types from '../types';

const itemSchema: yup.ObjectSchema<Types.IForm.Item> = yup.object({
  attributeDefinitionId: yup.number().integer().min(1).required(),
  required: yup.boolean().defined()
});

export const templateFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  nameUz: yup.string().trim().required(validation.templateNameRequired),
  items: yup
    .array(itemSchema)
    .required()
    .test('unique', validation.templateDuplicate, items => {
      const ids = (items ?? []).map(item => item.attributeDefinitionId);
      return new Set(ids).size === ids.length;
    })
});

export const templateUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> = templateFormSchema.shape({
  id: yup.number().integer().min(1).required()
});

export type CreateFormValues = Types.IForm.Create;
export type UpdateFormValues = Types.IForm.Update;

export const defaultValues: CreateFormValues = {
  nameUz: '',
  items: []
};

export const updateDefaultValues: UpdateFormValues = {
  ...defaultValues,
  id: 0
};
