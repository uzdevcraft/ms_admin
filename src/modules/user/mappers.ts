import { get } from 'radash';
import { Mappers as OrderMappers } from '@modules/orders';
import { Mappers as ProductMappers } from '@modules/products';
import type * as Types from './types';

export const Profile = (src: unknown): Types.IEntity.Profile => ({
  id: get(src, 'id', 0),
  telegramId: get(src, 'telegramId', 0),
  firstName: get(src, 'firstName', ''),
  lastName: get(src, 'lastName', null),
  username: get(src, 'username', ''),
  phoneNumber: get(src, 'phoneNumber', ''),
  role: get(src, 'role', 'USER'),
  isActive: get(src, 'isActive', false),
  createdAt: get(src, 'createdAt', ''),
});

export const Payment = (src: unknown): Types.IEntity.Payment => ({
  id: get(src, 'id', 0),
  orderId: get(src, 'orderId', 0),
  merchantTransId: get(src, 'merchantTransId', ''),
  amount: get(src, 'amount', 0),
  status: get(src, 'status', ''),
  paymentUrl: get(src, 'paymentUrl', ''),
  createdAt: get(src, 'createdAt', ''),
});

export const MyOrders = (src: unknown) => OrderMappers.List(src);

export const Products = (src: unknown) => ProductMappers.List(src);

export const CreateOrderRequest = OrderMappers.CreateRequest;
