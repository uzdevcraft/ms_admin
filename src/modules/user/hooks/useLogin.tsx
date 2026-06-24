import { useMutation } from '@tanstack/react-query';
import { setUserToken } from '@common/services';
import * as Api from '../api';

const useLogin = () =>
  useMutation({
    mutationFn: async (telegramId: number) => {
      const { data } = await Api.Login({ telegramId });
      setUserToken(data.token);
      return data;
    },
  });

export default useLogin;
