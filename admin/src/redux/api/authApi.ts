import { User } from "@/types";
import { baseApi } from "./baseApi";

export type LoginDto = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  user: User;
};

type ProfileResponse = User;

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /auth/login
    login: build.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // GET /auth/profile
    getProfile: build.query<ProfileResponse, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
