import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { LIST_KEY } from './constants';

const useCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Types.IForm.Create) => {
      const { data } = await Api.Create(Mappers.CreateRequest(values));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LIST_KEY });
    },
  });
};

export default useCreate;
