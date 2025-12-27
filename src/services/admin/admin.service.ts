import {authApi} from "../auth/auth.service.ts";
import type {IUser} from "../../types/user.types.ts";
import type {ICategory} from "../../types/category.types.ts";
import type {IDashboardStats} from "../../types/dashboard.types.ts";

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
        getDashboardStats: builder.query<IDashboardStats, void>({
            query: () => `/admin/stats`,
            transformResponse: (response: IApiResponse<IDashboardStats>) =>
                response.result,
            providesTags: (_result, _error) => [
                { type: "DashboardStats" },
            ],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetAdminUsersQuery,
    useGetDashboardStatsQuery,
} = adminApi;