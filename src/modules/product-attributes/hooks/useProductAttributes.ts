import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';

export const useProductAttributes = ({ productId }: { productId?: number }) =>
  useQuery({
    queryKey: ['product-attributes', productId],
    queryFn: async () => {
      const { data } = await Api.GetProductAttributes({ productId: productId! });
      return Mappers.ProductAttributes(data);
    },
    enabled: !!productId
  });
