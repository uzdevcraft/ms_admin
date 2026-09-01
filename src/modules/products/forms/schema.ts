import * as yup from 'yup';
import { validation } from '@/locale/uz';
import type * as Types from '../types';

export const productFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  categoryId: yup.number().integer().min(1, validation.categoryRequired).required('Majburiy maydon'),
  name: yup.string().required('Majburiy maydon'),
  nameUz: yup.string().required('Majburiy maydon'),
  nameRu: yup.string().required('Majburiy maydon'),
  description: yup.string().required('Majburiy maydon'),
  descriptionUz: yup.string().required('Majburiy maydon'),
  descriptionRu: yup.string().required('Majburiy maydon'),
  price: yup.number().min(0, validation.pricePositive).required('Majburiy maydon'),
  discountPrice: yup.number().min(0, validation.discountPositive).required('Majburiy maydon'),
  imageUrl: yup.string().required('Majburiy maydon'),
  stockQuantity: yup.number().integer().min(0).required('Majburiy maydon'),
  isActive: yup.boolean().defined().required(),
  sortOrder: yup.number().integer().min(0).required('Majburiy maydon')
});

export const productUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> = productFormSchema.shape({
  id: yup.number().integer().min(1, validation.idPositive).required('Majburiy maydon')
});

export type CreateFormValues = Types.IForm.Create & { id?: number };
export type UpdateFormValues = Types.IForm.Update;

export const defaultValues: CreateFormValues = {
  categoryId: 0,
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  descriptionUz: '',
  descriptionRu: '',
  price: 0,
  discountPrice: 0,
  imageUrl: '',
  stockQuantity: 0,
  isActive: true,
  sortOrder: 0
};

export const updateDefaultValues: UpdateFormValues = {
  ...defaultValues,
  id: 0
};
