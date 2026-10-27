import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

interface UpdateVariables {
  id: number;
  values: Types.IForm.Create;
}

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateVariables) => {
      const { data } = await Api.Update(Mappers.UpdateRequest(id, values));
      return Mappers.Saved(data, values, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
      // Categories using this template (directly or inherited) resolve new attributes.
      queryClient.invalidateQueries({ queryKey: ['attributes', 'category'] });
    }
  });
};

export default useUpdate;
