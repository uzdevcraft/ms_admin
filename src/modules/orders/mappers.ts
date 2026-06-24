import { get } from 'radash';
import type * as Types from './types';

export const OrderItem = (src: unknown): Types.IEntity.OrderItem => ({
  id: get(src, 'id', 0),
  productId: get(src, 'productId', 0),
  productName: get(src, 'productName', ''),
  productImage: get(src, 'productImage', ''),
  quantity: get(src, 'quantity', 0),
  price: get(src, 'price', 0),
  totalPrice: get(src, 'totalPrice', 0),
});

export const Payment = (src: unknown): Types.IEntity.Payment => ({
  id: get(src, 'id', 0),
  orderId: get(src, 'orderId', 0),
  merchantTransId: get(src, 'merchantTransId', ''),
  amount: get(src, 'amount', 0),
  status: get(src, 'status', 'WAITING'),
  paymentUrl: get(src, 'paymentUrl', ''),
  createdAt: get(src, 'createdAt', ''),
});

export const Order = (src: unknown): Types.IEntity.Order => {
  const payment = get(src, 'payment', null);
  const items = get(src, 'items', []);

  return {
    id: get(src, 'id', 0),
    userId: get(src, 'userId', 0),
    userFullName: get(src, 'userFullName', ''),
    status: get(src, 'status', 'PENDING'),
    totalAmount: get(src, 'totalAmount', 0),
    deliveryAddress: get(src, 'deliveryAddress', ''),
    comment: get(src, 'comment', ''),
    items: Array.isArray(items) ? items.map(OrderItem) : [],
    payment: payment ? Payment(payment) : null,
    createdAt: get(src, 'createdAt', ''),
  };
};

export const List = (src: unknown): Types.IQuery.List => {
  if (Array.isArray(src)) {
    return { data: src.map(Order) };
  }

  const content = get(src, 'content', get(src, 'data', get(src, 'results', [])));

  return {
    data: (content as unknown[]).map(Order),
    totalElements: get(src, 'totalElements', undefined),
    totalPages: get(src, 'totalPages', undefined),
    page: get(src, 'number', get(src, 'page', undefined)),
    size: get(src, 'size', undefined),
  };
};

export const CreateRequest = (values: Types.IForm.Create): Types.IApi.Create.Request => ({
  items: values.items,
  deliveryAddress: values.deliveryAddress,
  comment: values.comment,
});
