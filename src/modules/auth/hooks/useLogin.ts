import { useMutation } from "@tanstack/react-query";

import getApiError from "@common/utils/getApiError";

import * as Api from "../api";
import * as Mappers from "../mappers";
import type * as Types from "../types";

import { useAuthStore } from "../store";

const useLogin = () => {
  return useMutation({
    mutationFn: async (values: Types.IForm.Login) => {
      const { data } = await Api.Login(values);
      return Mappers.Login(data);
    },

    // The store writes the access token to localStorage and the refresh
    // token to its cookie, so the session survives a reload.
    onSuccess: (session) => {
      useAuthStore.getState().login(session);
    },

    onError: (error) => {
      useAuthStore.getState().setError(getApiError(error).message);
    },
  });
};

export default useLogin;
