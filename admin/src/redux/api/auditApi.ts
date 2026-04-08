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

export type AuditQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const auditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLogs: build.query<AuditResponse, AuditQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) {
          searchParams.append("page", String(params.page));
        }

        if (params?.limit) {
          searchParams.append("limit", String(params.limit));
        }

        if (params?.search) {
          searchParams.append("search", params.search);
        }

        if (params?.sortBy) {
          searchParams.append("sortBy", params.sortBy);
        }

        if (params?.sortOrder) {
          searchParams.append("sortOrder", params.sortOrder);
        }

        return {
          url: `/audit-logs${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Audit"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAuditLogsQuery } = auditApi;
