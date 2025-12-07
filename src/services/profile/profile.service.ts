import { authApi } from "../auth/auth.service";
import { toFormData } from "../../utils/FormData";
import type { UpdateProfilePayload, ChangePasswordPayload } from "./profile.types";
import type { IUser } from "../../types/user.types";

export const profileApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<IUser, void>({
      query: () => "/profile",
      transformResponse: (response: IApiResponse<{ user: IUser }>) => response.result.user,
      providesTags: ["User"], 
    }),

    updateProfile: builder.mutation<IUser, UpdateProfilePayload>({
      query: (data) => ({
        url: "/profile",
        method: "PUT",
        body: toFormData(data),
      }),
      transformResponse: (response: IApiResponse<{ user: IUser }>) => response.result.user,
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedUser } = await queryFulfilled;
          const { setUser } = await import("../../stores/slices/authSlice");
          dispatch(setUser(updatedUser));
        } catch {}
      },
    }),

    changePassword: builder.mutation<null, ChangePasswordPayload>({
      query: (data) => ({
        url: "/profile/change-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<null>) => response.result,
    }),
  }),
  overrideExisting: false, 
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;