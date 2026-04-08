import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from "@/lib/utils/local-storage";

import { authKey } from "@/lib/constants/app.constants";
import { getBaseUrl } from "@/lib/config/envConfig";

import { store, persistor } from "@/redux/store";
import { logout, setCredentials } from "@/redux/authSlice";

const instance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ for refresh_token + session_id cookies
});

/* =====================
   Helpers
===================== */

const isAuthRoute = (url?: string) => {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
};

const doLogoutCleanup = async () => {
  // redux
  store.dispatch(logout());

  // redux-persist
  try {
    await persistor.purge();
  } catch {}

  // localStorage token (if you still use it)
  removeFromLocalStorage(authKey);

  // redirect
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/* =====================
   Request Interceptor
===================== */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //  prefer redux token
    const reduxToken = store.getState().auth.accessToken;

    // fallback localStorage (optional)
    const localToken = getFromLocalStorage(authKey);

    const accessToken = reduxToken || localToken;

    if (accessToken) {
      config.headers = config.headers ?? ({} as any);
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* =====================
   Refresh Queue
===================== */

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

/* =====================
   Response Interceptor
===================== */
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error?.config as any;

    // If no response (network/CORS/timeout), just reject
    if (!error?.response) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Don't refresh on auth routes
    if (isAuthRoute(originalRequest?.url)) {
      await doLogoutCleanup();
      return Promise.reject(error);
    }

    // If refresh running, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((token) => {
          if (!token) return reject(error);

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(instance(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ refresh uses cookies (refresh_token + session_id)
      const refreshRes = await axios.post(
        `${getBaseUrl()}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newAccessToken = refreshRes?.data?.data?.accessToken;
      const user = refreshRes?.data?.data?.user; // if backend returns user

      if (!newAccessToken)
        throw new Error("No accessToken returned from refresh");

      // ✅ save token everywhere (optional)
      setToLocalStorage(authKey, newAccessToken);

      // ✅ redux update (user optional)
      store.dispatch(
        setCredentials({
          accessToken: newAccessToken,
          ...(user ? { user } : {}),
        }),
      );

      processQueue(newAccessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return instance(originalRequest);
    } catch (refreshErr) {
      processQueue(null);
      await doLogoutCleanup();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

export { instance };

// import axios, {
//   AxiosInstance,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from "axios";

// import { getBaseUrl } from "@/lib/config/envConfig";
// import { store } from "@/redux/store";
// import { logout, setCredentials } from "@/redux/authSlice";

// const baseURL = getBaseUrl();

// const instance: AxiosInstance = axios.create({
//   baseURL,
//   timeout: 60000,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
//   withCredentials: true, //  required for cookies
// });

// /* =====================
//    Request Interceptor
// ===================== */
// instance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const accessToken = store.getState().auth.accessToken;

//     // Skip attaching token for refresh calls (optional safety)
//     const skipRefresh = (config.headers as any)?.["x-skip-refresh"];
//     if (accessToken && !skipRefresh) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// /* =====================
//    Refresh Helper
// ===================== */
// let isRefreshing = false;
// let refreshQueue: Array<(token: string | null) => void> = [];

// const processQueue = (token: string | null) => {
//   refreshQueue.forEach((cb) => cb(token));
//   refreshQueue = [];
// };

// const refreshAccessToken = async (): Promise<string> => {
//   // cookie-based refresh, no body needed
//   const res = await instance.post(
//     "/auth/refresh",
//     {},
//     {
//       headers: {
//         "x-skip-refresh": "1", //  prevent interceptor loop
//       },
//     },
//   );

//   //  backend returns { data: { accessToken } }
//   const newToken: string | undefined = res.data?.data?.accessToken;

//   if (!newToken) {
//     throw new Error("No accessToken returned from refresh");
//   }

//   //  store token in Redux memory
//   store.dispatch(setCredentials({ accessToken: newToken }));

//   return newToken;
// };

// /* =====================
//    Response Interceptor
// ===================== */
// instance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const originalRequest = error?.config as any;

//     // If refresh request itself fails or explicitly skip
//     if (originalRequest?.headers?.["x-skip-refresh"]) {
//       return Promise.reject(error);
//     }

//     // Only handle 401
//     if (error?.response?.status !== 401) {
//       return Promise.reject(error);
//     }

//     // Prevent infinite retry
//     if (originalRequest?._retry) {
//       store.dispatch(logout());
//       if (typeof window !== "undefined") window.location.href = "/";
//       return Promise.reject(error);
//     }

//     originalRequest._retry = true;

//     // If already refreshing, queue the request
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         refreshQueue.push((token) => {
//           if (!token) return reject(error);
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(instance(originalRequest));
//         });
//       });
//     }

//     isRefreshing = true;

//     try {
//       const newToken = await refreshAccessToken();

//       // release queued requests
//       processQueue(newToken);

//       // retry original request with new token
//       originalRequest.headers.Authorization = `Bearer ${newToken}`;
//       return instance(originalRequest);
//     } catch (refreshErr) {
//       processQueue(null);
//       store.dispatch(logout());
//       if (typeof window !== "undefined") window.location.href = "/";
//       return Promise.reject(refreshErr);
//     } finally {
//       isRefreshing = false;
//     }
//   },
// );

// export { instance };
// export default instance;
