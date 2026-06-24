import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Types as OrderTypes } from '@modules/orders';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { MY_ORDERS_KEY } from './constants';

const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: OrderTypes.IForm.Create) => {
      const { data } = await Api.CreateOrder(Mappers.CreateOrderRequest(values));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_ORDERS_KEY() });
    },
  });
};

export default useCreateOrder;
