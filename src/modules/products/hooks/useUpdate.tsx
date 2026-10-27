import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

import saveExtras, { type SavedExtras } from './saveExtras';

interface UpdateVariables {
  id: number;
  values: Types.IForm.Update;
  /** What the product had before editing (so removing every variant / spec is saved too). */
  saved?: SavedExtras;
}

/** Updates the product, then saves its variants and spec values. */
const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values, saved }: UpdateVariables) => {
      const request = Mappers.UpdateRequest(id, values);
      const { data } = await Api.Update(request);
      const productId = Mappers.Id(data) || id;

      await saveExtras(productId, values, saved);

      // The API returns only the id; build the entity from what was sent.
      return Mappers.Product({ ...request, id: productId });
    },
    onSettled: (_, __, { id, values }) => {
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
