import type { AxiosPromise } from 'axios';

import { http } from '@common/services';

import type * as Types from './types';

export const List = (): AxiosPromise<Types.IApi.List.Response> => http.request.get('/attribute-definition');

export const Single = ({ id }: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/attribute-definition/${id}`);

export const Create = (values: Types.IApi.Create.Request): AxiosPromise<Types.IApi.Create.Response> =>
  http.request.post('/attribute-definition', values);

export const Update = ({ id, ...values }: Types.IApi.Update.Request): AxiosPromise<Types.IApi.Update.Response> =>
  http.request.put(`/attribute-definition/${id}`, values);

export const Delete = ({ id }: Types.IQuery.Single): AxiosPromise<void> =>
  http.request.delete(`/attribute-definition/${id}`);

export const ListOptions = ({
  attributeDefinitionId
}: Types.IQuery.OptionList): AxiosPromise<Types.IApi.OptionList.Response> =>
  http.request.get(`/attribute-options/${attributeDefinitionId}`);

export const CreateOption = ({
  attributeDefinitionId,
  values
}: {
  attributeDefinitionId: number;
  values: Types.IApi.OptionCreate.Request;
}): AxiosPromise<Types.IApi.OptionCreate.Response> =>
  http.request.post(`/attribute-options/${attributeDefinitionId}`, values);

export const UpdateOption = ({
  id,
  values
}: {
  id: number;
  values: Types.IApi.OptionUpdate.Request;
}): AxiosPromise<Types.IApi.OptionUpdate.Response> => http.request.put(`/admin/attribute-options/${id}`, values);

export const DeleteOption = ({ id }: { id: number }): AxiosPromise<void> =>
  http.request.delete(`/admin/attribute-options/${id}`);

/** Attributes of a category's template (inherited from the nearest parent when not set on it). */
export const ForCategory = ({ categoryId }: Types.IQuery.ForCategory): AxiosPromise<Types.IApi.ForCategory.Response> =>
  http.request.get(`/categories/${categoryId}/attributes`);
