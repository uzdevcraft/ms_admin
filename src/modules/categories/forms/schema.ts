import * as yup from "yup";
import { validation } from "@/locale/uz";
import type * as Types from "../types";

export const categoryFormSchema: yup.ObjectSchema<Types.IForm.Create> =
  yup.object({
    name: yup.string().required(validation.nameRequired),
    nameUz: yup.string().required(validation.nameUzRequired),
    nameRu: yup.string().required(validation.nameRuRequired),
    description: yup.string().required(validation.descriptionRequired),
    imageUrl: yup.string().required(validation.imageUrlRequired),
    isActive: yup.boolean().defined().required(),
    sortOrder: yup
      .number()
      .integer()
      .min(0)
      .required(validation.sortOrderRequired),
  });

export const categoryUpdateFormSchema: yup.ObjectSchema<Types.IForm.Update> =
  categoryFormSchema.shape({
    id: yup
      .number()
      .integer()
      .min(1, validation.idPositive)
      .required(validation.idRequired),
  });

export type CategoryFormValues = Types.IForm.Create & { id?: number };
export type CategoryUpdateFormValues = Types.IForm.Update;

export const defaultValues: CategoryFormValues = {
  name: "",
  nameUz: "",
  nameRu: "",
  description: "",
  imageUrl: "",
  isActive: true,
  sortOrder: 0,
};

export const updateDefaultValues: CategoryUpdateFormValues = {
  ...defaultValues,
  id: 0,
};
