import type { AxiosPromise } from 'axios';
import { http } from '@common/services';
import type * as Types from './types';

export const List = (): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get('/products');

export const Single = ({ id }: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/products/${id}`);

export const Create = (
  values: Types.IApi.Create.Request,
): AxiosPromise<Types.IApi.Create.Response> => http.request.post('/products', values);

export const Update = ({
  id,
  ...values
}: Types.IApi.Update.Request): AxiosPromise<Types.IApi.Update.Response> =>
  http.request.put(`/products/${id}`, values);

export const Delete = ({ id }: Types.IQuery.Single): AxiosPromise<void> =>
  http.request.delete(`/products/${id}`);

export const Search = ({
  q,
}: Types.IApi.Search.Request): AxiosPromise<Types.IApi.Search.Response> =>
  http.request.get('/products/search', { params: { q } });

export const ByCategory = ({
  categoryId,
}: Types.IQuery.ByCategory): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get(`/products/category/${categoryId}`);
