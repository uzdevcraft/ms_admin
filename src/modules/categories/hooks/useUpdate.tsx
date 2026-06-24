import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { LIST_KEY, singleKey } from './constants';

interface UpdateVariables {
  id: number;
  values: Types.IForm.Update;
}

const useUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateVariables) => {
      const { data } = await Api.Update(Mappers.UpdateRequest(id, values));
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.invalidateQueries({ queryKey: singleKey(id) });
    },
  });
};

export default useUpdate;
