import type { AxiosPromise } from 'axios';

import { http } from '@common/services';

import type * as Types from './types';

export const List = (): AxiosPromise<Types.IApi.List.Response> => http.request.get('/attribute-templates');

export const Single = ({ id }: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/attribute-templates/${id}`);

export const Create = (values: Types.IApi.Create.Request): AxiosPromise<Types.IApi.Create.Response> =>
  http.request.post('/attribute-templates', values);

export const Update = ({ id, ...values }: Types.IApi.Update.Request): AxiosPromise<Types.IApi.Update.Response> =>
  http.request.put(`/attribute-templates/${id}`, values);

/** Answers 400 while the template is linked to a category. */
export const Delete = ({ id }: Types.IQuery.Single): AxiosPromise<void> =>
  http.request.delete(`/attribute-templates/${id}`);
