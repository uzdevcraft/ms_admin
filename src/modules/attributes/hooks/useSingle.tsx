import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';

const useSingle = ({ id }: { id?: number }) =>
  useQuery({
    queryKey: ['attributes', 'single', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing attribute id');
      const { data } = await Api.Single({ id });
      return Mappers.AttributeDefinition(data);
    },
    enabled: !!id
  });

export default useSingle;
