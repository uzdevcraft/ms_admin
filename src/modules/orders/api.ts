import type { AxiosPromise } from 'axios';
import { http } from '@common/services';
import type * as Types from './types';

export const List = ({
  page,
  size,
}: Types.IQuery.ListParams = {}): AxiosPromise<Types.IApi.List.Response> =>
  http.request.get('/orders', { params: { page, size } });

export const Single = ({ id }: Types.IQuery.Single): AxiosPromise<Types.IApi.Single.Response> =>
  http.request.get(`/orders/${id}`);

export const MyOrders = (): AxiosPromise<Types.IApi.MyOrders.Response> =>
  http.request.get('/orders/my-orders');

export const Create = (
  values: Types.IApi.Create.Request,
): AxiosPromise<Types.IApi.Create.Response> => http.request.post('/orders', values);

export const UpdateStatus = ({
  id,
  status,
}: Types.IApi.UpdateStatus.Request): AxiosPromise<Types.IApi.UpdateStatus.Response> =>
  http.request.patch(`/orders/${id}/status`, null, { params: { status } });
