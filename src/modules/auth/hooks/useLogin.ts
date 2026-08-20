import { useQuery } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

import { useAuthStore } from "@/modules/auth/store";
import { VITE_ADMIN_ID } from "@/common/services";

const TELEGRAM_ID = VITE_ADMIN_ID;

const useLogin = () => {
  const { data, isPending } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      try {
        const { data } = await Api.Login(TELEGRAM_ID);
        const mappedData = Mappers.Login(data);

        useAuthStore.setState({ accessToken: mappedData.accessToken });
        useAuthStore.setState({ isAuthenticated: true });

        cookieStore.set("refreshToken", mappedData.refreshToken);

        return mappedData;
      } catch (error: any) {
        useAuthStore.setState({ error: error.message });
        throw error;
      }
    },
  });

  return {
    isLoggingIn: isPending,
    data,
  };
};

export default useLogin;
