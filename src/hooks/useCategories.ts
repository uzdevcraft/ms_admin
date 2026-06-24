import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api';
import type { Category } from '../types';

const KEY = ['categories'];

export function useCategories() {
  return useQuery({ queryKey: KEY, queryFn: categoriesApi.getAll });
}

export function useCategoryMutations() {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const create = useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'createdAt'>) => categoriesApi.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesApi.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
