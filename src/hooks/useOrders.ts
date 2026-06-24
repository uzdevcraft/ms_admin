import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api';
import type { Order } from '../types';

const KEY = ['orders'];

export function useOrders() {
  return useQuery({ queryKey: KEY, queryFn: ordersApi.getAll });
}

export function useOrderMutations() {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const create = useMutation({
    mutationFn: (data: Omit<Order, 'id' | 'createdAt'>) => ordersApi.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
      ordersApi.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
