import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import type * as Types from '../types';
import { listKey } from './constants';

const useList = (params: Types.IQuery.ListParams = {}) =>
  useQuery({
    queryKey: listKey(params),
    queryFn: async () => {
      const { data } = await Api.List(params);
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
  });

export default useList;
