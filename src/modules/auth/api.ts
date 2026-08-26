import { http } from "@/common/services";

import type { IApi } from "./types";

export const Login = (payload: { username: string; password: string }) => {
  return http.pureRequest.post<IApi.Login>(
    `/auth/login?${new URLSearchParams(payload).toString()}`,
  );
};

export const User = () => http.request.get<IApi.User>("/auth/me");
