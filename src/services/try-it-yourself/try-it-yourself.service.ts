import { authApi } from "../auth/auth.service";
import type {
  ISupportedLanguage,
  IPlaygroundLanguage,
  RunCodePayload,
  RunLessonCodePayload,
  RunCodeResponse,
  ITryItYourselfConfig,
  CreateTryItYourselfPayload,
  UpdateTryItYourselfPayload,
} from "./try-it-yourself.types";

export const tryItYourselfApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getProblemLanguages: builder.query<ISupportedLanguage[], void>({
      query: () => "/problems/languages",
      transformResponse: (response: IApiResponse<ISupportedLanguage[]>) =>
        response.result,
      providesTags: ["Language"],
    }),

    getPlaygroundLanguages: builder.query<IPlaygroundLanguage[], void>({
      query: () => "/lessons/try-it-yourself/languages",
      transformResponse: (response: IApiResponse<IPlaygroundLanguage[]>) =>
        response.result,
      providesTags: ["Language"],
    }),

    runPlaygroundCode: builder.mutation<RunCodeResponse, RunCodePayload>({
      query: (payload) => ({
        url: "/lessons/try-it-yourself/run",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: IApiResponse<RunCodeResponse>) =>
        response.result,
    }),

    getLessonTryItYourself: builder.query<ITryItYourselfConfig, number>({
      query: (lessonId) => `/lessons/${lessonId}/try-it-yourself`,
      transformResponse: (response: IApiResponse<ITryItYourselfConfig>) =>
        response.result,
      providesTags: (_result, _error, lessonId) => [
        { type: "TryItYourself", id: lessonId },
      ],
    }),

    createLessonTryItYourself: builder.mutation<
      ITryItYourselfConfig,
      { lessonId: number; data: CreateTryItYourselfPayload }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}/try-it-yourself`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<ITryItYourselfConfig>) =>
        response.result,
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "TryItYourself", id: lessonId },
      ],
    }),

    updateLessonTryItYourself: builder.mutation<
      ITryItYourselfConfig,
      { lessonId: number; data: UpdateTryItYourselfPayload }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}/try-it-yourself`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: IApiResponse<ITryItYourselfConfig>) =>
        response.result,
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "TryItYourself", id: lessonId },
      ],
    }),

    deleteLessonTryItYourself: builder.mutation<void, string>({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}/try-it-yourself`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, lessonId) => [
        { type: "TryItYourself", id: lessonId },
      ],
    }),

    runLessonCode: builder.mutation<
      RunCodeResponse,
      { lessonId: string; data: RunLessonCodePayload }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}/try-it-yourself/run`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<RunCodeResponse>) =>
        response.result,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProblemLanguagesQuery,
  useGetPlaygroundLanguagesQuery,
  useRunPlaygroundCodeMutation,
  useGetLessonTryItYourselfQuery,
  useCreateLessonTryItYourselfMutation,
  useUpdateLessonTryItYourselfMutation,
  useDeleteLessonTryItYourselfMutation,
  useRunLessonCodeMutation,
} = tryItYourselfApi;