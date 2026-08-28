import { get } from "radash";

import type * as Types from "./types";

export const Login = (src: Types.IApi.Login): Types.IEntity.Login => ({
  accessToken: get(src, "token", ""),
  refreshToken: get(src, "refreshToken", ""),
  success: get(src, "success", false),
});

export const Refresh = (src: Types.IApi.Refresh): Types.IEntity.Login => ({
  accessToken: get(src, "token", ""),
  refreshToken: get(src, "refreshToken", ""),
  success: get(src, "success", false),
});

export const User = (src: Types.IApi.User): Types.IEntity.User => ({
  id: get(src, "id", 0),
  telegramId: get(src, "telegramId", 0),
  firstName: get(src, "firstName", ""),
  lastName: get(src, "lastName", ""),
  username: get(src, "username", ""),
  phoneNumber: get(src, "phoneNumber", ""),
  role: get(src, "role", "USER"),
  isActive: get(src, "isActive", false),
  createdAt: get(src, "createdAt", ""),
});
