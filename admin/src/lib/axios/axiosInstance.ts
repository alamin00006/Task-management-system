import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { authKey } from "@/constants/authKey";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/helpers/utils/local-storage";

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getFromLocalStorage(authKey);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  // (error) => {
  //   if (error?.response?.status === 401) {
  //     removeFromLocalStorage(authKey);

  //     if (
  //       typeof window !== "undefined" &&
  //       window.location.pathname !== "/login"
  //     ) {
  //       window.location.href = "/login";
  //     }
  //   }

  //   return Promise.reject(error);
  // },
);

export { instance };
