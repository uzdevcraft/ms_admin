import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';

const useDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await Api.Delete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
    }
  });
};

export default useDelete;
