import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { MY_ORDERS_KEY } from './constants';

const useMyOrders = () =>
  useQuery({
    queryKey: MY_ORDERS_KEY,
    queryFn: async () => {
      const { data } = await Api.MyOrders();
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
  });

export default useMyOrders;
