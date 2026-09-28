import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';

const useDeleteOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await Api.DeleteOption({ id });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['attributes', 'options'] });
      queryClient.removeQueries({ queryKey: ['attributes', 'single', id] });
    }
  });
};

export default useDeleteOption;
