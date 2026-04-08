import { baseApi } from "./baseApi";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TaskListResponse = {
  data: TaskItem[];
  meta: PaginationMeta;
};

export type CreateTaskDto = {
  title: string;
  description: string;
  assigneeId: string;
};

export type UpdateTaskStatusDto = {
  id: string;
  status: string;
};

export type AssignTaskDto = {
  id: string;
  assigneeId: string;
};

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<
      {
        data: any[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `/tasks?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    getMyTasks: build.query<TaskItem[], void>({
      query: () => ({
        url: "/tasks/my",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    createTask: build.mutation<TaskItem, CreateTaskDto>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    updateTaskStatus: build.mutation<TaskItem, UpdateTaskStatusDto>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    assignTask: build.mutation<TaskItem, AssignTaskDto>({
      query: ({ id, assigneeId }) => ({
        url: `/tasks/${id}/assign`,
        method: "PATCH",
        body: { assigneeId },
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    deleteTask: build.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Audit"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
