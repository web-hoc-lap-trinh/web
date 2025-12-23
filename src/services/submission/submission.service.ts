import { authApi } from "../auth/auth.service";
import type {
  ISubmission,
  ISubmissionStats,
  ISubmissionStatus,
} from "../../types/submission.types";
import type {
    SubmissionListResponse,
  CreateSubmissionPayload,
  CreateSubmissionResponse,
  GetSubmissionsParams,
  GetMySubmissionsParams
} from "./submission.types";

export const submissionApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubmissions: builder.query<SubmissionListResponse, GetMySubmissionsParams | void>({
      query: (params) => ({
        url: "/submissions/my",
        params: params || undefined,
      }),
      transformResponse: (response: IApiResponse<SubmissionListResponse>) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ submission_id }) => ({ type: "Submission" as const, id: submission_id })),
              { type: "Submission", id: "MY_LIST" },
            ]
          : [{ type: "Submission", id: "MY_LIST" }],
    }),

    getSubmissionStats: builder.query<ISubmissionStats, void>({
      query: () => "/submissions/stats",
      transformResponse: (response: IApiResponse<ISubmissionStats>) => response.result,
      providesTags: [{ type: "Submission", id: "STATS" }],
    }),

    getSubmissions: builder.query<SubmissionListResponse, GetSubmissionsParams | void>({
      query: (params) => ({
        url: "/submissions",
        params: params || undefined,
      }),
      transformResponse: (response: IApiResponse<SubmissionListResponse>) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ submission_id }) => ({ type: "Submission" as const, id: submission_id })),
              { type: "Submission", id: "LIST" },
            ]
          : [{ type: "Submission", id: "LIST" }],
    }),

    submitCode: builder.mutation<CreateSubmissionResponse, CreateSubmissionPayload>({
      query: (data) => ({
        url: "/submissions",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<CreateSubmissionResponse>) => response.result,
      invalidatesTags: [
        { type: "Submission", id: "MY_LIST" },
        { type: "Submission", id: "LIST" },
        { type: "Submission", id: "STATS" },
        { type: "Problem", id: "LIST" },
        { type: "Problem", id: "DAILY" }
      ],
    }),

    getSubmission: builder.query<ISubmission, number | string>({
      query: (id) => `/submissions/${id}`,
      transformResponse: (response: IApiResponse<ISubmission>) => response.result,
      providesTags: (_result, _error, id) => [{ type: "Submission", id }],
    }),

    getSubmissionStatus: builder.query<ISubmissionStatus, number | string>({
      query: (id) => `/submissions/${id}/status`,
      transformResponse: (response: IApiResponse<ISubmissionStatus>) => response.result,
      keepUnusedDataFor: 0, 
    }),
  }),
});

export const {
  useGetMySubmissionsQuery,
  useGetSubmissionStatsQuery,
  useGetSubmissionsQuery,
  useSubmitCodeMutation,
  useGetSubmissionQuery,
  useGetSubmissionStatusQuery,
} = submissionApi;