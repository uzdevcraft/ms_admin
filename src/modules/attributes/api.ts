import type { AxiosPromise } from 'axios';

import { http } from '@common/services';

import type * as Types from './types';

export const List = (): AxiosPromise<Types.IApi.List.Response> => http.request.get('/admin/attributes');

export const Single = ({ id }: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/admin/attributes/${id}`);

export const Create = (values: Types.IApi.Create.Request): AxiosPromise<Types.IApi.Create.Response> =>
  http.request.post('/admin/attributes', values);

export const Update = ({ id, ...values }: Types.IApi.Update.Request): AxiosPromise<Types.IApi.Update.Response> =>
  http.request.put(`/admin/attributes/${id}`, values);

export const Delete = ({ id }: Types.IQuery.Single): AxiosPromise<void> =>
  http.request.delete(`/admin/attributes/${id}`);

/** Attribute set of a category (definitions + options + `required`). */
export const ForCategory = ({ categoryId }: Types.IQuery.ForCategory): AxiosPromise<Types.IApi.ForCategory.Response> =>
  http.request.get(`/categories/${categoryId}/attributes`);

export const ListOptions = ({
  attributeDefinitionId
}: Types.IQuery.OptionList): AxiosPromise<Types.IApi.OptionList.Response> =>
  http.request.get(`/admin/attributes/${attributeDefinitionId}/options`);

export const CreateOption = ({
  attributeDefinitionId,
  values
}: {
  attributeDefinitionId: number;
  values: Types.IApi.OptionCreate.Request;
}): AxiosPromise<Types.IApi.OptionCreate.Response> =>
  http.request.post(`/admin/attributes/${attributeDefinitionId}/options`, values);

export const UpdateOption = ({
  id,
  values
}: {
  id: number;
  values: Types.IApi.OptionUpdate.Request;
}): AxiosPromise<Types.IApi.OptionUpdate.Response> => http.request.put(`/admin/attribute-options/${id}`, values);

export const DeleteOption = ({ id }: { id: number }): AxiosPromise<void> =>
  http.request.delete(`/admin/attribute-options/${id}`);
