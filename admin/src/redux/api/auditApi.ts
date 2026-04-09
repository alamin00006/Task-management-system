import { baseApi } from "./baseApi";

import { AuditLog } from "@/types/audit";

export type AuditItem = AuditLog;

export type AuditMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AuditResponse = {
  data: AuditLog[];
  meta: AuditMeta;
};

export const auditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLogs: build.query<AuditResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/audit-logs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Audit"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAuditLogsQuery } = auditApi;
