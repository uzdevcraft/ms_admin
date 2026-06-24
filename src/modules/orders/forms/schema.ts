import * as yup from 'yup';
import type * as Types from '../types';

export const ORDER_STATUS_OPTIONS: { value: Types.OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const orderItemSchema = yup.object({
  productId: yup
    .number()
    .integer()
    .min(1, 'Product is required')
    .required('Product is required'),
  quantity: yup
    .number()
    .integer()
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
});

export const createOrderSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  items: yup
    .array()
    .of(orderItemSchema)
    .min(1, 'Add at least one item')
    .required('Add at least one item'),
  deliveryAddress: yup.string().required('Delivery address is required'),
  comment: yup.string().default(''),
});

export const updateStatusSchema: yup.ObjectSchema<Types.IForm.UpdateStatus> = yup.object({
  status: yup
    .mixed<Types.OrderStatus>()
    .oneOf(ORDER_STATUS_OPTIONS.map((option) => option.value))
    .required('Status is required'),
});

export type CreateOrderFormValues = Types.IForm.Create;
export type UpdateStatusFormValues = Types.IForm.UpdateStatus;

export const createDefaultValues: CreateOrderFormValues = {
  items: [{ productId: 0, quantity: 1 }],
  deliveryAddress: '',
  comment: '',
};

export const updateStatusDefaultValues: UpdateStatusFormValues = {
  status: 'PENDING',
};
