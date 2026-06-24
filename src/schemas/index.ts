import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const userSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
});

export const categorySchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and hyphens'),
  description: yup.string().required('Description is required'),
});

export const productSchema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  currency: yup.string().required('Currency is required'),
  originCountry: yup.string().required('Origin country is required'),
  categoryId: yup.string().required('Category is required'),
  stock: yup.number().integer().min(0).required('Stock is required'),
  imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
  isActive: yup.boolean().required(),
});

export const orderSchema = yup.object({
  orderNumber: yup.string().required('Order number is required'),
  userId: yup.string().required('Customer is required'),
  userName: yup.string().required('Customer name is required'),
  totalAmount: yup.number().positive().required('Total is required'),
  currency: yup.string().required('Currency is required'),
  status: yup
    .string()
    .oneOf(['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'])
    .required('Status is required'),
  shippingCountry: yup.string().required('Shipping country is required'),
  shippingCity: yup.string().required('Shipping city is required'),
  shippingAddress: yup.string().required('Shipping address is required'),
  notes: yup.string().default(''),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type UserFormValues = yup.InferType<typeof userSchema>;
export type CategoryFormValues = yup.InferType<typeof categorySchema>;
export type ProductFormValues = yup.InferType<typeof productSchema>;
export type OrderFormValues = yup.InferType<typeof orderSchema>;
