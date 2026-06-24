import * as yup from 'yup';
import type * as Types from '../types';

export const categoryFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  name: yup.string().required('Name is required'),
  nameUz: yup.string().required('Uzbek name is required'),
  nameRu: yup.string().required('Russian name is required'),
  description: yup.string().required('Description is required'),
  imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
  isActive: yup.boolean().defined().required(),
  sortOrder: yup.number().integer().min(0).required('Sort order is required'),
});

export type CategoryFormValues = Types.IForm.Create;

export const defaultValues: CategoryFormValues = {
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  imageUrl: '',
  isActive: true,
  sortOrder: 0,
};
