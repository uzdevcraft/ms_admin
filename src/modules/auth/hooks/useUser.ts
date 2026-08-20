import { useQuery } from '@tanstack/react-query';

import * as Api from '../api';
import * as Mappers from '../mappers';

import { useAuthStore } from '@/modules/auth/store';

const useUser = () => {
  const accessToken = useAuthStore(state => state.accessToken);

  return useQuery({
    queryKey: ['user', accessToken],
    enabled: !!accessToken,
    queryFn: async () => {
      const { data } = await Api.User();
      return Mappers.User(data);
    }
  });
};

export default useUser;
