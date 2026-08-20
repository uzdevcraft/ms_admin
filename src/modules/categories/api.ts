import type { AxiosPromise } from "axios";
import { http } from "@common/services";
import type * as Types from "./types";

export const List = (): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get("/categories");

export const Single = ({
  id,
}: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/categories/${id}`);

export const Create = (
  values: Types.IApi.Create.Request,
): AxiosPromise<Types.IApi.Create.Response> =>
  http.request.post("/categories", values);

export const Update = ({
  id,
  newId,
  ...values
}: Types.IApi.Update.Request): AxiosPromise<Types.IApi.Update.Response> =>
  http.request.put(`/categories/${id}`, {
    ...values,
    ...(newId !== undefined ? { id: newId } : {}),
  });

export const Delete = ({ id }: Types.IQuery.Single): AxiosPromise<void> =>
  http.request.delete(`/categories/${id}`);
