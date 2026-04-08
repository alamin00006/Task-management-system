import type { AxiosRequestConfig } from "axios";
import { instance as axiosInstance } from "@/lib/axios/axiosInstance";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: any;
  params?: any;
  contentType?: string;
}

export const axiosBaseQuery =
  () =>
  async ({
    url,
    method = "GET",
    data,
    params,
    contentType,
  }: AxiosBaseQueryArgs) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: contentType ? { "Content-Type": contentType } : undefined,
      });

      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
