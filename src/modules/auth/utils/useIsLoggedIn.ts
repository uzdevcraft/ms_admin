import { useAuthStore } from "@/modules/auth/store";

const useIsLoggedIn = (): { isLoggedIn: boolean } => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return { isLoggedIn: isAuthenticated };
};

export default useIsLoggedIn;
