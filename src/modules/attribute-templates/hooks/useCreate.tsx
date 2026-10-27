import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Types.IForm.Create) => {
      const { data } = await Api.Create(Mappers.CreateRequest(values));
      return Mappers.Saved(data, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attribute-templates'] });
    }
  });
};

export default useCreate;
