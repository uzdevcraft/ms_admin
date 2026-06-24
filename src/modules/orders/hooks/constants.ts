export const LIST_KEY = ['orders', 'list'] as const;

export const MY_ORDERS_KEY = ['orders', 'my-orders'] as const;

export const singleKey = (id: number) => ['orders', 'single', id] as const;

export const listKey = (params?: { page?: number; size?: number }) =>
  [...LIST_KEY, params ?? {}] as const;
