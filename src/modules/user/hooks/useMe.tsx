import { useQuery } from '@tanstack/react-query';
import { getUserToken } from '@common/services';
import * as Api from '../api';
import * as Mappers from '../mappers';
import { ME_KEY } from './constants';

const useMe = () =>
  useQuery({
    queryKey: ME_KEY(),
    queryFn: async () => {
      const { data } = await Api.Me();
      return Mappers.Profile(data);
    },
    enabled: !!getUserToken(),
  });

export default useMe;
