export const LIST_KEY = ['categories', 'list'] as const;

export const singleKey = (id: number) => ['categories', 'single', id] as const;
