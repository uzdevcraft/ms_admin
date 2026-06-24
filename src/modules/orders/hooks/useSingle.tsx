import { useQuery } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { singleKey } from './constants';

const useSingle = ({ id }: Types.IQuery.Single, enabled = true) =>
  useQuery({
    queryKey: singleKey(id),
    queryFn: async () => {
      const { data } = await Api.Single({ id });
      return Mappers.Order(data);
    },
    enabled: enabled && id > 0,
  });

export default useSingle;
