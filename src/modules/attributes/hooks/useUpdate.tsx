import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface UpdateVariables {
  id: number;
  values: Types.IForm.AttributeDefinition;
}

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateVariables) => {
      const { data } = await Api.Update(Mappers.UpdateRequest(id, values));
      return Mappers.AttributeDefinition(data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['attributes', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['attributes', 'single', id] });
    }
  });
};

export default useUpdate;
