import { baseApi } from "./baseApi";

export type AuditItem = {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  details: string;
};

export type AuditMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AuditResponse = {
  data: AuditItem[];
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
