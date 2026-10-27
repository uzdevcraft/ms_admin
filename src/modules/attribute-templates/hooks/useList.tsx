import { keepPreviousData, useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import { LIST_QUERY_KEY } from '../constants';
import * as Mappers from '../mappers';

const useList = (enabled = true) =>
  useQuery({
    queryKey: LIST_QUERY_KEY,
    queryFn: async () => {
      const { data } = await Api.List();
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
    enabled
  });

export default useList;
