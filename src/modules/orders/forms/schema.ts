import * as yup from 'yup';
import { orderStatusOptions, validation } from '@/locale/uz';
import type * as Types from '../types';

export const ORDER_STATUS_OPTIONS = orderStatusOptions as unknown as {
  value: Types.OrderStatus;
  label: string;
}[];

const orderItemSchema = yup.object({
  productId: yup
    .number()
    .integer()
    .min(1, validation.productRequired)
    .required(validation.productRequired),
  quantity: yup
    .number()
    .integer()
    .min(1, validation.quantityMin)
    .required(validation.quantityRequired),
});

export const createOrderSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  items: yup
    .array()
    .of(orderItemSchema)
    .min(1, validation.addAtLeastOneItem)
    .required(validation.addAtLeastOneItem),
  deliveryAddress: yup.string().required(validation.deliveryAddressRequired),
  comment: yup.string().default(''),
});

export const updateStatusSchema: yup.ObjectSchema<Types.IForm.UpdateStatus> = yup.object({
  status: yup
    .mixed<Types.OrderStatus>()
    .oneOf(ORDER_STATUS_OPTIONS.map((option) => option.value))
    .required(validation.statusRequired),
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
