/** React Query key of a category's resolved attribute template. */
export const categoryAttributesKey = (categoryId: number) => ['attributes', 'category', categoryId] as const;
