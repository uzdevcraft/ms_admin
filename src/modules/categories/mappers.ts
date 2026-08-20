import { get } from "radash";
import type * as Types from "./types";

export const Category = (src: unknown): Types.IEntity.Category => ({
  id: get(src, "id", 0),
  name: get(src, "name", ""),
  nameUz: get(src, "nameUz", ""),
  nameRu: get(src, "nameRu", ""),
  description: get(src, "description", ""),
  imageUrl: get(src, "imageUrl", ""),
  isActive: get(src, "isActive", false),
  sortOrder: get(src, "sortOrder", 0),
  createdAt: get(src, "createdAt", ""),
});

export const List = (src: unknown): Types.IQuery.List => {
  const items = Array.isArray(src)
    ? src
    : get(src, "content", get(src, "data", get(src, "results", [])));

  return {
    data: (items as unknown[]).map(Category),
  };
};

export const CreateRequest = (
  values: Types.IForm.Create,
): Types.IApi.Create.Request => ({
  name: values.name,
  nameUz: values.nameUz,
  nameRu: values.nameRu,
  description: values.description,
  imageUrl: values.imageUrl,
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
