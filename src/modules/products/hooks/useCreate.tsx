import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as ProductAttributesApi from '@/modules/product-attributes/api';
import * as ProductAttributesMappers from '@/modules/product-attributes/mappers';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

/** Creates the product, then saves its generated variants (if any). */
const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Types.IForm.Create) => {
      const request = Mappers.CreateRequest(values);
      const { data } = await Api.Create(request);
      // The API returns only the new id; build the entity from what was sent.
      const product = Mappers.Product({ ...request, id: Mappers.Id(data) });

      if (values.variants.length && product.id) {
        await ProductAttributesApi.SaveProductVariants({
          productId: product.id,
          request: ProductAttributesMappers.SaveVariantsRequest(Mappers.VariantsRequest(values))
        });
      }

      return product;
    },
    onSuccess: product => {
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['product-attributes', product.id] });
    }
  });
};

export default useCreate;
