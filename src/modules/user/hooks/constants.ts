import { getUserToken } from '@common/services';

export const tokenKey = () => ['user', 'token', getUserToken()] as const;

export const ME_KEY = () => [...tokenKey(), 'me'] as const;

export const MY_ORDERS_KEY = () => [...tokenKey(), 'my-orders'] as const;

export const PRODUCTS_KEY = () => [...tokenKey(), 'products'] as const;
