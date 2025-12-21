import {authApi} from "../auth/auth.service.ts";
import type {IUser} from "../../types/user.types.ts";

export const adminApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUsers: builder.query<IUser[], void>({
            query: () => "/admin/users",
            transformResponse: (response: IApiResponse<IUser[]>) =>
                response.result,

            providesTags: (result) =>
                result ?
                    [
                        ...result.map(({ user_id }) => ({
                            type: "AdminUser" as const,
                            id: user_id,
                        })),
                        { type: "AdminUser", id: "LIST"}
                    ]
                    : [{type: "AdminUser", id: "LIST"}],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetAdminUsersQuery
} = adminApi;