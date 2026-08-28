import { useMutation } from "@tanstack/react-query";

import * as Api from "../api";
import * as Mappers from "../mappers";

import { useAuthStore } from "@/modules/auth/store";
import { http } from "@/common/services";

const useLogin = () => {
  return useMutation({
    mutationFn: async (payload: { username: string; password: string }) => {
      const { data } = await Api.Login(payload);
      const mappedData = Mappers.Login(data);

      http.persistSession(mappedData);
      useAuthStore.getState().loginSuccess();

      return mappedData;
    },
  });
};

export default useLogin;
