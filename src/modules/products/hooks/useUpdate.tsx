import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as ProductAttributesApi from '@/modules/product-attributes/api';
import * as ProductAttributesMappers from '@/modules/product-attributes/mappers';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface UpdateVariables {
  id: number;
  values: Types.IForm.Update;
}

/** Updates the product, then saves its variants (if any). */
const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateVariables) => {
      const request = Mappers.UpdateRequest(id, values);
      const { data } = await Api.Update(request);
      const productId = Mappers.Id(data) || id;

      if (values.variants.length) {
        await ProductAttributesApi.SaveProductVariants({
          productId,
          request: ProductAttributesMappers.SaveVariantsRequest(Mappers.VariantsRequest(values))
        });
      }

      // The API returns only the id; build the entity from what was sent.
      return Mappers.Product({ ...request, id: productId });
    },
    onSuccess: (_, { id, values }) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'single', id] });
      queryClient.invalidateQueries({ queryKey: ['product-attributes', id] });
      if (values.id !== id) {
        queryClient.invalidateQueries({ queryKey: ['products', 'single', values.id] });
      }
    }
  });
};

export default useUpdate;
