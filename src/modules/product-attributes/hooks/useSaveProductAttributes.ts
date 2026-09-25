import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type { VariantInput } from '../types';

export const useSaveProductAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variants }: { productId: number; variants: VariantInput[] }) =>
      Api.SaveProductVariants({ productId, request: Mappers.SaveVariantsRequest(variants) }),
    onSuccess: (_response, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['product-attributes', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', 'list'] });
    }
  });
};
