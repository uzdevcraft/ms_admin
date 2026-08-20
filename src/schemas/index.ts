import * as yup from 'yup';
import { validation } from '@/locale/uz';

export const userSchema = yup.object({
  fullName: yup.string().required(validation.fullNameRequired),
  email: yup.string().email(validation.invalidEmail).required(validation.emailRequired),
  phone: yup.string().required(validation.phoneRequired),
  country: yup.string().required(validation.countryRequired),
  city: yup.string().required(validation.cityRequired),
});

export const categorySchema = yup.object({
  name: yup.string().required(validation.nameRequired),
  slug: yup
    .string()
    .required(validation.slugRequired)
    .matches(/^[a-z0-9-]+$/, validation.slugFormat),
  description: yup.string().required(validation.descriptionRequired),
});

export const productSchema = yup.object({
  name: yup.string().required(validation.nameRequired),
  description: yup.string().required(validation.descriptionRequired),
  price: yup.number().positive(validation.pricePositive).required(validation.priceRequired),
  currency: yup.string().required(validation.currencyRequired),
  originCountry: yup.string().required(validation.originCountryRequired),
  categoryId: yup.string().required(validation.categoryRequired),
  stock: yup.number().integer().min(0).required(validation.stockRequired),
  imageUrl: yup.string().url(validation.validUrl).required(validation.imageUrlRequired),
  isActive: yup.boolean().required(),
});

export const orderSchema = yup.object({
  orderNumber: yup.string().required(validation.orderNumberRequired),
  userId: yup.string().required(validation.customerRequired),
  userName: yup.string().required(validation.customerNameRequired),
  totalAmount: yup.number().positive().required(validation.totalRequired),
  currency: yup.string().required(validation.currencyRequired),
  status: yup
    .string()
    .oneOf(['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'])
    .required(validation.statusRequired),
  shippingCountry: yup.string().required(validation.shippingCountryRequired),
  shippingCity: yup.string().required(validation.shippingCityRequired),
  shippingAddress: yup.string().required(validation.shippingAddressRequired),
  notes: yup.string().default(''),
});

export type UserFormValues = yup.InferType<typeof userSchema>;
export type CategoryFormValues = yup.InferType<typeof categorySchema>;
export type ProductFormValues = yup.InferType<typeof productSchema>;
export type OrderFormValues = yup.InferType<typeof orderSchema>;
