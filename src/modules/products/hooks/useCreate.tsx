import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

import saveExtras from './saveExtras';

/** Creates the product, then saves its generated variants and spec values (if any). */
const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Types.IForm.Create) => {
      const request = Mappers.CreateRequest(values);
      const { data } = await Api.Create(request);
      // The API returns only the new id; build the entity from what was sent.
      const product = Mappers.Product({ ...request, id: Mappers.Id(data) });

      if (product.id) await saveExtras(product.id, values);

      return product;
    },
    onSettled: product => {
      // Also after a partial failure: the product exists either way.
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
      if (product) queryClient.invalidateQueries({ queryKey: ['product-attributes', product.id] });
    }
  });
};

export default useCreate;
