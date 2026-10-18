import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';

const useSingle = (id: number, enabled = true) =>
  useQuery({
    queryKey: ['products', 'single', id],
    queryFn: async () => {
      const { data } = await Api.Single({ id });
      return Mappers.Product(data);
    },
    enabled: enabled && id > 0
  });

export default useSingle;
