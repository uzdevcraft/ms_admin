import { get } from "radash";
import type * as Types from "./types";

export const Product = (src: unknown): Types.IEntity.Product => ({
  id: get(src, "id", 0),
  categoryId: get(src, "categoryId", 0),
  categoryName: get(src, "categoryName", ""),
  name: get(src, "name", ""),
  nameUz: get(src, "nameUz", ""),
  nameRu: get(src, "nameRu", ""),
  description: get(src, "description", ""),
  descriptionUz: get(src, "descriptionUz", ""),
  descriptionRu: get(src, "descriptionRu", ""),
  price: get(src, "price", 0),
  discountPrice: get(src, "discountPrice", 0),
  effectivePrice: get(src, "effectivePrice", 0),
  imageUrl: get(src, "imageUrl", ""),
  stockQuantity: get(src, "stockQuantity", 0),
  isActive: get(src, "isActive", false),
  sortOrder: get(src, "sortOrder", 0),
  createdAt: get(src, "createdAt", ""),
});

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src)
    ? src
    : get(src, "content", get(src, "data", get(src, "results", [])));

  return {
    data: (items as unknown[]).map(Product),
  };
};

export const CreateRequest = (
  values: Types.IForm.Create,
): Types.IApi.Create.Request => ({
  categoryId: values.categoryId,
  name: values.name,
  nameUz: values.nameUz,
  nameRu: values.nameRu,
  description: values.description,
  descriptionUz: values.descriptionUz,
  descriptionRu: values.descriptionRu,
  price: values.price,
  discountPrice: values.discountPrice,
  imageUrl: values.imageUrl,
  stockQuantity: values.stockQuantity,
  isActive: values.isActive,
  sortOrder: values.sortOrder,
});

export const UpdateRequest = (
  id: number,
  values: Types.IForm.Update,
): Types.IApi.Update.Request => ({
  id,
  newId: values.id,
  ...CreateRequest(values),
});
