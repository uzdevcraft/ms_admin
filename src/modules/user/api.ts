import type { AxiosPromise } from 'axios';
import { userHttp } from '@common/services';
import type * as Types from './types';

export const Login = ({
  telegramId,
}: Types.IQuery.Login): AxiosPromise<Types.IApi.Login.Response> =>
  userHttp.pureRequest.get('/auth/login', { params: { telegramId } });

export const Me = (): AxiosPromise<Types.IApi.Me.Response> => userHttp.request.get('/auth/me');

export const MyOrders = (): AxiosPromise<Types.IApi.MyOrders.Response> =>
  userHttp.request.get('/orders/my-orders');

export const CreateOrder = (
  values: Types.IApi.CreateOrder.Request,
): AxiosPromise<Types.IApi.CreateOrder.Response> => userHttp.request.post('/orders', values);

export const ListProducts = (): AxiosPromise<Types.IApi.ListProducts.Response> =>
  userHttp.request.get('/products');

export const CreatePayment = ({
  orderId,
}: Types.IQuery.CreatePayment): AxiosPromise<Types.IApi.CreatePayment.Response> =>
  userHttp.request.post(`/payments/payments/create/${orderId}`);
