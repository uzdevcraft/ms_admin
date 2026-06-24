import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Api from '../api';
import type * as Types from '../types';
import { LIST_KEY, MY_ORDERS_KEY, singleKey } from './constants';

interface UpdateStatusVariables {
  id: number;
  status: Types.OrderStatus;
}

const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusVariables) => {
      const { data } = await Api.UpdateStatus({ id, status });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.invalidateQueries({ queryKey: MY_ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: singleKey(id) });
    },
  });
};

export default useUpdateStatus;
