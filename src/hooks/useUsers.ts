import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api';
import type { User } from '../types';

const KEY = ['users'];

export function useUsers() {
  return useQuery({ queryKey: KEY, queryFn: usersApi.getAll });
}

export function useUserMutations() {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const create = useMutation({
    mutationFn: (data: Omit<User, 'id' | 'createdAt'>) => usersApi.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
