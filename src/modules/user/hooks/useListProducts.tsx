import { useQuery } from '@tanstack/react-query';
import { getUserToken } from '@common/services';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { PRODUCTS_KEY } from './constants';

const useListProducts = () =>
  useQuery({
    queryKey: PRODUCTS_KEY(),
    queryFn: async () => {
      const { data } = await Api.ListProducts();
      return Mappers.Products(data);
    },
    enabled: !!getUserToken(),
  });

export default useListProducts;
