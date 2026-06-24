import * as yup from 'yup';
import type * as Types from '../types';

export const productFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  categoryId: yup
    .number()
    .integer()
    .min(1, 'Category is required')
    .required('Category is required'),
  name: yup.string().required('Name is required'),
  nameUz: yup.string().required('Uzbek name is required'),
  nameRu: yup.string().required('Russian name is required'),
  description: yup.string().required('Description is required'),
  descriptionUz: yup.string().required('Uzbek description is required'),
  descriptionRu: yup.string().required('Russian description is required'),
  price: yup.number().min(0, 'Price must be positive').required('Price is required'),
  discountPrice: yup
    .number()
    .min(0, 'Discount price must be positive')
    .required('Discount price is required'),
  imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
  stockQuantity: yup.number().integer().min(0).required('Stock is required'),
  isActive: yup.boolean().defined().required(),
  sortOrder: yup.number().integer().min(0).required('Sort order is required'),
});

export type ProductFormValues = Types.IForm.Create;

export const defaultValues: ProductFormValues = {
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
  sortOrder: 0,
};
