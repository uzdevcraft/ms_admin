import * as yup from "yup";
import { validation } from "@/locale/uz";
import type * as Types from "../types";

export const productFormSchema: yup.ObjectSchema<Types.IForm.Create> =
  yup.object({
    categoryId: yup
      .number()
      .integer()
      .min(1, validation.categoryRequired)
      .required(validation.categoryRequired),
    name: yup.string().required(validation.nameRequired),
    nameUz: yup.string().required(validation.nameUzRequired),
    nameRu: yup.string().required(validation.nameRuRequired),
    description: yup.string().required(validation.descriptionRequired),
    descriptionUz: yup.string().required(validation.descriptionUzRequired),
    descriptionRu: yup.string().required(validation.descriptionRuRequired),
    price: yup
      .number()
      .min(0, validation.pricePositive)
      .required(validation.priceRequired),
    discountPrice: yup
      .number()
      .min(0, validation.discountPositive)
      .required(validation.discountRequired),
    imageUrl: yup.string().required(validation.imageUrlRequired),
    stockQuantity: yup
      .number()
      .integer()
      .min(0)
      .required(validation.stockRequired),
    isActive: yup.boolean().defined().required(),
    sortOrder: yup
      .number()
      .integer()
      .min(0)
      .required(validation.sortOrderRequired),
  });

export const productUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> =
  productFormSchema.shape({
    id: yup
      .number()
      .integer()
      .min(1, validation.idPositive)
      .required(validation.idRequired),
  });

export type ProductFormValues = Types.IForm.Create & { id?: number };
export type ProductUpdateFormValues = Types.IForm.Update;

export const defaultValues: ProductFormValues = {
  categoryId: 0,
  name: "",
  nameUz: "",
  nameRu: "",
  description: "",
  descriptionUz: "",
  descriptionRu: "",
  price: 0,
  discountPrice: 0,
  imageUrl: "",
  stockQuantity: 0,
  isActive: true,
  sortOrder: 0,
};

export const updateDefaultValues: ProductUpdateFormValues = {
  ...defaultValues,
  id: 0,
};
