export const LIST_KEY = ['products', 'list'] as const;

export const singleKey = (id: number) => ['products', 'single', id] as const;
