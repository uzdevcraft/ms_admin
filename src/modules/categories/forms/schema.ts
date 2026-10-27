import * as yup from 'yup';
import { validation } from '@/locale/uz';
import type * as Types from '../types';

const optionalText = () => yup.string().defined().default('');
const optionalId = () => yup.number().integer().min(0).nullable().defined().default(null);

export const categoryFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  name: yup.string().trim().required('Majburiy maydon'),
  // Empty UZ name falls back to `name` in the mapper; RU, description and image are optional (API doc §6.1).
  nameUz: optionalText(),
  nameRu: optionalText(),
  description: optionalText(),
  imageUrl: optionalText(),
  isActive: yup.boolean().defined().required(),
  sortOrder: yup.number().integer().min(0).nullable().defined().default(null),
  parentId: optionalId(),
  attributeTemplateId: optionalId()
});

export const categoryUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> = categoryFormSchema.shape({
  id: yup.number().integer().min(1, validation.idPositive).required(validation.idRequired)
});

export type CreateFormValues = Types.IForm.Create & { id?: number };
export type UpdateFormValues = Types.IForm.Update;

export const defaultValues: CreateFormValues = {
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  imageUrl: '',
  isActive: true,
  sortOrder: null,
  parentId: null,
  attributeTemplateId: null
};

export const updateDefaultValues: UpdateFormValues = {
  ...defaultValues,
  id: 0
};
