import axios from "axios";
// import storage from "./storage";

// import config from "@/config";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const pureHttp = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((axiosConfig) => {
  // const accessToken = storage.local.get(config.api.accessTokenKey) || '';
  const accessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NTg1MzY0MDYiLCJpYXQiOjE3ODE1NDg4NTgsImV4cCI6MTc4MTk4MDg1OH0.HH_iDjBRvYlEBLqXP7pfiavpyHVLdtqkeRlIi6CyKmQ";
  if (accessToken) {
    axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
  }
  return axiosConfig;
});

export default { request: http, pureRequest: pureHttp };
