import { authApi } from "../auth/auth.service";
import type {
    IExercisePreview,
    IExerciseAdminDetail,
} from "../../types/exercise.types";
import type {
    ExerciseSessionResponse,
    SubmitAnswerPayload,
    SubmitAnswerResponse,
    CreateExercisePayload,
    UpdateExercisePayload,
    ReorderExercisesPayload,
} from "./exercise.types";

export const exerciseApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getLessonExercises: builder.query<IExercisePreview[], string | number>({
            query: (lessonId) => `/exercises/lesson/${lessonId}`,
            transformResponse: (response: IApiResponse<IExercisePreview[]>) =>
                response.result,
            providesTags: (result, error, lessonId) =>
                result
                    ? [
                        ...result.map(({ exercise_id }) => ({
                            type: "Exercise" as const,
                            id: exercise_id,
                        })),
                        { type: "Exercise", id: `LESSON_${lessonId}` },
                    ]
                    : [],
        }),

        startLessonExercise: builder.query<
            ExerciseSessionResponse,
            string | number
        >({
            query: (lessonId) => `/exercises/lesson/${lessonId}/start`,
            transformResponse: (response: IApiResponse<ExerciseSessionResponse>) =>
                response.result,
            providesTags: ["ExerciseSession"],
        }),

        getExerciseDetail: builder.query<ExerciseSessionResponse, number | string>({
            query: (exerciseId) => `/exercises/${exerciseId}`,
            transformResponse: (response: IApiResponse<ExerciseSessionResponse>) =>
                response.result,
            providesTags: (result, error, exerciseId) => [
                { type: "Exercise", id: exerciseId },
                "ExerciseSession",
            ],
        }),

        submitAnswer: builder.mutation<
            SubmitAnswerResponse,
            { exerciseId: number | string; data: SubmitAnswerPayload }
        >({
            query: ({ exerciseId, data }) => ({
                url: `/exercises/${exerciseId}/submit`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: IApiResponse<SubmitAnswerResponse>) =>
                response.result,
        }),

        getAdminLessonExercises: builder.query<
            IExerciseAdminDetail[],
            string | number
        >({
            query: (lessonId) => `/exercises/admin/lesson/${lessonId}`,
            transformResponse: (response: IApiResponse<IExerciseAdminDetail[]>) =>
                response.result,
            providesTags: (result, error, lessonId) =>
                result
                    ? [
                        ...result.map(({ exercise_id }) => ({
                            type: "AdminExercise" as const,
                            id: exercise_id,
                        })),
                        { type: "AdminExercise", id: `LESSON_${lessonId}` },
                    ]
                    : [{ type: "AdminExercise", id: `LESSON_${lessonId}` }],
        }),

        getAdminExerciseDetail: builder.query<
            IExerciseAdminDetail,
            number | string
        >({
            query: (exerciseId) => `/exercises/admin/${exerciseId}`,
            transformResponse: (response: IApiResponse<IExerciseAdminDetail>) =>
                response.result,
            providesTags: (result, error, exerciseId) => [
                { type: "AdminExercise", id: exerciseId },
            ],
        }),

        createExercise: builder.mutation<
            IExerciseAdminDetail,
            CreateExercisePayload
        >({
            query: (data) => ({
                url: "/exercise",
                method: "POST",
                body: data,
            }),
            transformResponse: (response: IApiResponse<IExerciseAdminDetail>) =>
                response.result,
            invalidatesTags: (result, error, arg) => [
                { type: "Exercise", id: `LESSON_${arg.lesson_id}` },
                { type: "AdminExercise", id: `LESSON_${arg.lesson_id}` },
                "ExerciseSession",
            ],
        }),

        updateExercise: builder.mutation<
            IExerciseAdminDetail,
            { exerciseId: number | string; data: UpdateExercisePayload }
        >({
            query: ({ exerciseId, data }) => ({
                url: `/exercises/${exerciseId}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: IApiResponse<IExerciseAdminDetail>) =>
                response.result,
            invalidatesTags: (result, error, { exerciseId }) => [
                { type: "Exercise", id: exerciseId },
                { type: "AdminExercise", id: exerciseId },
            ],
        }),

        deleteExercise: builder.mutation<void, number | string>({
            query: (exerciseId) => ({
                url: `/exercises/${exerciseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Exercise", "AdminExercise", "ExerciseSession"],
        }),

        reorderExercises: builder.mutation<
            void,
            { lessonId: string | number; data: ReorderExercisesPayload }
        >({
            query: ({ lessonId, data }) => ({
                url: `/exercises/admin/lesson/${lessonId}/reorder`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { lessonId }) => [
                { type: "Exercise", id: `LESSON_${lessonId}` },
                { type: "AdminExercise", id: `LESSON_${lessonId}` },
                "ExerciseSession",
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    // User hooks
    useGetLessonExercisesQuery,
    useStartLessonExerciseQuery,
    useGetExerciseDetailQuery,
    useSubmitAnswerMutation,

    // Admin hooks
    useGetAdminLessonExercisesQuery,
    useGetAdminExerciseDetailQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
    useReorderExercisesMutation,
} = exerciseApi;