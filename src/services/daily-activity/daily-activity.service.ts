import { authApi } from "../auth/auth.service";
import type {
  IDailyActivityStats,
  ActivityHistoryResponse,
  HistoryParams,
} from "./daily-activity.types";

export const dailyActivityApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailyActivityToday: builder.query<IDailyActivityStats, void>({
      query: () => "/daily-activities/today",
      transformResponse: (response: IApiResponse<IDailyActivityStats>) =>
        response.result,
      providesTags: ["DailyActivity"],
    }),

    getActivityHistory: builder.query<ActivityHistoryResponse, HistoryParams>({
      query: (params) => ({
        url: "/daily-activities/history",
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
        },
      }),
      transformResponse: (response: IApiResponse<ActivityHistoryResponse>) =>
        response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ activity_id }) => ({
                type: "DailyActivity" as const,
                id: activity_id,
              })),
              { type: "DailyActivity", id: "HISTORY_LIST" },
            ]
          : [{ type: "DailyActivity", id: "HISTORY_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDailyActivityTodayQuery,
  useGetActivityHistoryQuery,
} = dailyActivityApi;