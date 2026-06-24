import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api';
import type { Product } from '../types';

const KEY = ['products'];

export function useProducts() {
  return useQuery({ queryKey: KEY, queryFn: productsApi.getAll });
}

export function useProductMutations() {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const create = useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'createdAt'>) => productsApi.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
