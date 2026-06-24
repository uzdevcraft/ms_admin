import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const USER_TOKEN_KEY = 'magic_store_user_token';

export const getUserToken = () => sessionStorage.getItem(USER_TOKEN_KEY) ?? '';

export const setUserToken = (token: string) => {
  sessionStorage.setItem(USER_TOKEN_KEY, token);
};

export const clearUserToken = () => {
  sessionStorage.removeItem(USER_TOKEN_KEY);
};

const userHttp = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

userHttp.interceptors.request.use((axiosConfig) => {
  const accessToken = getUserToken();
  if (accessToken) {
    axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
  }
  return axiosConfig;
});

const pureUserHttp = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default { request: userHttp, pureRequest: pureUserHttp };
