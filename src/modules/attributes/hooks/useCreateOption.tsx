import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';

const useCreateOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attributeDefinitionId,
      values,
      displayType
    }: {
      attributeDefinitionId: number;
      values: Types.IForm.AttributeOption;
      displayType: Types.IEntity.AttributeDisplayType;
    }) => {
      const { data } = await Api.CreateOption({
        attributeDefinitionId,
        values: Mappers.OptionCreateRequest(values, displayType)
      });
      return Mappers.AttributeOption(data);
    },
    onSuccess: (_, { attributeDefinitionId }) => {
      queryClient.invalidateQueries({ queryKey: ['attributes', 'options', attributeDefinitionId] });
    }
  });
};

export default useCreateOption;
