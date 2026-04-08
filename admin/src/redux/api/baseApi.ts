import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export type TagType = "Auth" | "User" | "Task" | "Audit";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "Task", "User", "Audit"] as TagType[],
  endpoints: () => ({}),
});
