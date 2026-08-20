import { useAuthStore } from '@/modules/auth/store';

const useIsLoggedIn = (): { isLoggedIn: boolean } => {
  const { isAuthenticated, accessToken } = useAuthStore.getState();
  const isLoggedIn = isAuthenticated && !!accessToken;
  return { isLoggedIn };
};

export default useIsLoggedIn;
