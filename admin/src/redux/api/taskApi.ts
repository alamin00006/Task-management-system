import { baseApi } from "./baseApi";

/* ================= TYPES ================= */

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  assigneeId: string;
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

/* ================= DTOs ================= */

export type CreateTaskDto = {
  title: string;
  description: string;
  assigneeId: string;
};

export type UpdateTaskDto = {
  id: string;
  title?: string;
  description?: string;
};

export type UpdateTaskStatusDto = {
  id: string;
  status: string;
};

export type AssignTaskDto = {
  id: string;
  assigneeId: string;
};

/* ================= API ================= */

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //  Get all tasks (paginated)
    getTasks: build.query<TaskListResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/tasks?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    // Get my tasks
    getMyTasks: build.query<TaskItem[], void>({
      query: () => ({
        url: "/tasks/my",
        method: "GET",
      }),
      providesTags: ["Task"],
    }),

    //  Create task
    createTask: build.mutation<TaskItem, CreateTaskDto>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        data: body, //  use body (not data)
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    // NEW: Update title/description
    updateTask: build.mutation<TaskItem, UpdateTaskDto>({
      query: ({ id, ...data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    //  Update status
    updateTaskStatus: build.mutation<TaskItem, UpdateTaskStatusDto>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    //  Assign task
    assignTask: build.mutation<TaskItem, AssignTaskDto>({
      query: ({ id, assigneeId }) => ({
        url: `/tasks/${id}/assign`,
        method: "PATCH",
        data: { assigneeId },
      }),
      invalidatesTags: ["Task", "Audit"],
    }),

    //  Delete task
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

/* ================= HOOKS ================= */

export const {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useAssignTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
