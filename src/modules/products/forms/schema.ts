import * as yup from 'yup';

import { validation } from '@/locale/uz';

import { STATUS } from '../constants';
import type * as Types from '../types';

const REQUIRED = 'Majburiy maydon';

const variantSchema: yup.ObjectSchema<Types.IForm.Variant> = yup.object({
  key: yup.string().required(),
  variantId: yup.number().optional(),
  selectedOptions: yup.mixed<Record<number, number>>().required(),
  label: yup.string().defined(),
  sku: yup.string().trim().defined(),
  price: yup.number().min(0, validation.pricePositive).nullable().defined(),
  stockQuantity: yup.number().typeError(REQUIRED).integer().min(0).required(REQUIRED)
});

export const productFormSchema: yup.ObjectSchema<Types.IForm.Create> = yup.object({
  name: yup.string().trim().required(validation.nameRequired),
  // Empty → filled from `name` by Mappers.CreateRequest.
  nameUz: yup.string().defined(),
  nameRu: yup.string().trim().required(validation.nameRuRequired),
  description: yup.string().defined(),
  descriptionUz: yup.string().defined(),
  descriptionRu: yup.string().defined(),
  categoryId: yup.number().integer().min(1, validation.categoryRequired).required(validation.categoryRequired),

  specs: yup.mixed<Types.IForm.Create['specs']>().required(),
  variantOptions: yup.mixed<Types.IForm.Create['variantOptions']>().required(),

  purchasePrice: yup
    .number()
    .typeError(validation.purchasePriceRequired)
    .moreThan(0, validation.purchasePriceRequired)
    .required(validation.purchasePriceRequired),
  price: yup.number().typeError(validation.priceRequired).moreThan(0, validation.priceRequired).required(),
  discountEnabled: yup.boolean().required(),
  discountPrice: yup
    .number()
    .typeError(validation.discountRequired)
    .min(0, validation.discountPositive)
    .required()
    .when(['discountEnabled', 'price'], ([enabled, price], schema) =>
      enabled
        ? schema.moreThan(0, validation.discountRequired).lessThan(price || Infinity, validation.discountBelowPrice)
        : schema
    ),
  stockQuantity: yup.number().typeError(validation.stockRequired).integer().min(0).required(validation.stockRequired),
  variants: yup.array(variantSchema).required(),

  imageUrls: yup.array(yup.string().required()).min(1, validation.imageUrlRequired).required(),

  onlineEnabled: yup.boolean().required(),
  storeEnabled: yup
    .boolean()
    .required()
    .test(
      'channel',
      validation.channelRequired,
      (storeEnabled, context) => storeEnabled || context.parent.onlineEnabled
    ),

  status: yup.mixed<Types.IEntity.Status>().oneOf(Object.values(STATUS)).required(),
  sortOrder: yup.number().integer().min(0).required()
});

export const productUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> = productFormSchema.shape({
  id: yup.number().integer().min(1, validation.idPositive).required(REQUIRED)
});

export type CreateFormValues = Types.IForm.Create & { id?: number };
export type UpdateFormValues = Types.IForm.Update;

export const defaultValues: CreateFormValues = {
  name: '',
  nameUz: '',
  nameRu: '',
  description: '',
  descriptionUz: '',
  descriptionRu: '',
  categoryId: 0,
  specs: {},
  variantOptions: {},
  purchasePrice: 0,
  price: 0,
  discountEnabled: false,
  discountPrice: 0,
  stockQuantity: 10,
  variants: [],
  imageUrls: [],
  onlineEnabled: true,
  storeEnabled: false,
  status: STATUS.review,
  sortOrder: 0
};

export const updateDefaultValues: UpdateFormValues = {
  ...defaultValues,
  id: 0
};
