import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser } from "../../types/user.types";
import type { AuthResponse, LoginPayload, RegisterPayload, VerifyPayload, ProfileResponse } from "./auth.types";
import { setCredentials, setUser } from "../../stores/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"; 

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Category", "Course", "Lesson", "TryItYourself", "Language", "ExerciseSession", "Exercise", "AdminExercise", "Discussion", "Reply"], 
  endpoints: (builder) => ({
    
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: IApiResponse<AuthResponse>) => response.result,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    register: builder.mutation<null, RegisterPayload>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<null>) => response.result,
    }),

    verifyAccount: builder.mutation<AuthResponse, VerifyPayload>({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<AuthResponse>) => response.result,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Verify account failed:", error);
        }
      },
    }),

    getMe: builder.query<IUser, void>({
      query: () => "/profile",
      transformResponse: (response: IApiResponse<ProfileResponse>) => response.result.user,
      providesTags: ["User"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error("GetMe failed:", error);
        }
      },
    }),

    forgotPassword: builder.mutation<null, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<null>) => response.result,
    }),

    resetPassword: builder.mutation<null, { email: string; otp: string; newPassword: string }>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<null>) => response.result,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyAccountMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;