import { baseApi } from "./baseApi";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserItem[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery } = usersApi;
