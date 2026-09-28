import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const useUpdateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
      displayType
    }: {
      id: number;
      values: Types.IForm.AttributeOption;
      displayType: Types.IEntity.AttributeDisplayType;
    }) => {
      const { data } = await Api.UpdateOption({
        id,
        values: Mappers.OptionUpdateRequest(id, values, displayType)
      });
      return Mappers.AttributeOption(data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['attributes', 'options'] });
      queryClient.removeQueries({ queryKey: ['attributes', 'single', id] });
    }
  });
};

export default useUpdateOption;
