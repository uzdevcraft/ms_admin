import { http } from '@/common/services';

import type { IApi } from './types';

export const Login = (peerId: string) => {
  return http.pureRequest.get<IApi.Login>(`/auth/login-with-telegramId?telegramId=${peerId}`);
};

export const User = () => http.request.get<IApi.User>('/auth/me');
