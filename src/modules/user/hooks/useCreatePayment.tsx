import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { MY_ORDERS_KEY } from './constants';

const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      const { data } = await Api.CreatePayment({ orderId });
      return Mappers.Payment(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ORDERS_KEY() });
    },
  });
};

export default useCreatePayment;
