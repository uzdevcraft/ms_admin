import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { LIST_KEY } from './constants';

const useList = () =>
  useQuery({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const { data } = await Api.List();
      return Mappers.List(data);
    },
    placeholderData: keepPreviousData,
  });

export default useList;
