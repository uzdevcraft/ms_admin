import * as yup from 'yup';
import { validation } from '@/locale/uz';
import type * as Types from '../types';

export const categoryFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  name: yup.string().required('Majburiy maydon'),
  nameUz: yup.string().required('Majburiy maydon'),
  nameRu: yup.string().required('Majburiy maydon'),
  description: yup.string().required('Majburiy maydon'),
  imageUrl: yup.string().required('Majburiy maydon'),
  isActive: yup.boolean().defined().required(),
  sortOrder: yup.number().integer().min(0).required('Majburiy maydon')
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
  sortOrder: null
};

export const updateDefaultValues: UpdateFormValues = {
  ...defaultValues,
  id: 0
};
