import {authApi} from "../auth/auth.service.ts";
import type {IUser} from "../../types/user.types.ts";
import type {
    ICategoryDistribution,
    IDashboardStats, IProblemDifficulty, ISubmissionStats,
    ISubmissionStatsParams,
    IUserGrowth
} from "../../types/dashboard.types.ts";
import type {IDiscussion} from "../../types/discussion.types.ts";

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

        updateUserStatus: builder.mutation<
            IUser,
            { id: number, status: string }
        >({
            query: ({ id, status }) => ({
                url: `/admin/users/${id}/status`,
                method: "PATCH",
                body: {status}
            }),
            transformResponse: (response: IApiResponse<IUser>) => response.result,
            invalidatesTags: (_res, _err, { id }) => [
                { type: "AdminUser", id: `LIST_${id}` },
                { type: "AdminUser", id: id },
            ],
        }),

        getDashboardStats: builder.query<IDashboardStats, void>({
            query: () => `/admin/stats`,
            transformResponse: (response: IApiResponse<IDashboardStats>) =>
                response.result,
            providesTags: (_result, _error) => [
                { type: "DashboardStats" },
            ],
        }),

        getUserGrowth: builder.query<IUserGrowth[], number | void>({
            query: (days = 30) => ({
                url: "/admin/analytics/user-growth",
                method: "GET",
                params: { days },
            }),
            transformResponse: (response: IApiResponse<IUserGrowth[]>) =>
                response.result,
            providesTags: [{ type: "UserGrowth" }],
        }),

        getCategoryDistribution: builder.query<ICategoryDistribution[], { startDate?: string; endDate?: string } | void>({
            query: (params) => ({
                url: "/admin/analytics/category-distribution",
                method: "GET",
                params: params || {},
            }),
            transformResponse: (response: IApiResponse<ICategoryDistribution[]>) =>
                response.result,
            providesTags: [{ type: "CategoryDistribution" }],
        }),

        getSubmissionAnalytic: builder.query<ISubmissionStats[], ISubmissionStatsParams | void>({
            query: (params) => ({
                url: "/admin/analytics/submission-status",
                method: "GET",
                params: params || {},
            }),
            transformResponse: (response: IApiResponse<ISubmissionStats[]>) =>
                response.result,
            providesTags: [{ type: "SubmissionStatus" }],
        }),

        getProblemDifficulty: builder.query<IProblemDifficulty[], void>({
            query: () => ({
                url: "/admin/analytics/problem-difficulty",
                method: "GET",
            }),
            transformResponse: (response: IApiResponse<IProblemDifficulty[]>) =>
                response.result,
            providesTags: [{ type: "ProblemDifficulty" }],
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetAdminUsersQuery,
    useUpdateUserStatusMutation,
    useGetDashboardStatsQuery,
    useGetUserGrowthQuery,
    useGetCategoryDistributionQuery,
    useGetSubmissionAnalyticQuery,
    useGetProblemDifficultyQuery,
} = adminApi;