import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Api from '../api';
import { LIST_KEY, singleKey } from './constants';

const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await Api.Delete({ id });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
      queryClient.removeQueries({ queryKey: singleKey(id) });
    },
  });
};

export default useDelete;
