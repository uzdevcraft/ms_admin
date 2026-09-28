import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';

const useOptions = ({ attributeDefinitionId }: { attributeDefinitionId?: number }) =>
  useQuery({
    queryKey: ['attributes', 'options', attributeDefinitionId],
    queryFn: async () => {
      if (!attributeDefinitionId) throw new Error('Missing attribute definition id');
      const { data } = await Api.ListOptions({ attributeDefinitionId });
      return Mappers.OptionList(data);
    },
    enabled: !!attributeDefinitionId
  });

export default useOptions;
