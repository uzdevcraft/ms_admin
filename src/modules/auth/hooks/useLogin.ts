import { useMutation } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

import { useAuthStore } from "@/modules/auth/store";
import { storage } from "@/common/services";

const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      const { data } = await Api.Login(payload);
      const mappedData = Mappers.Login(data);

      useAuthStore.setState({
        accessToken: mappedData.accessToken,
        isAuthenticated: true,
      });

      storage.local.set("accessToken", mappedData.accessToken);
      storage.local.set("refreshToken", mappedData.refreshToken);

      return mappedData;
    },
  });
};

export default useLogin;
