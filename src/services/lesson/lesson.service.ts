import { authApi } from "../auth/auth.service";
import type { ILesson } from "../../types/lesson.types";
import type {
  CreateLessonPayload,
  UpdateLessonPayload,
  UploadMediaResponse,
} from "./lesson.types";

export const lessonApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadLessonMedia: builder.mutation<string, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("media", file);
        return {
          url: "/lessons/upload-media",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: IApiResponse<UploadMediaResponse>) =>
        response.result.url,
    }),

    getLessons: builder.query<ILesson[], void>({
      query: () => "/lessons",
      transformResponse: (response: IApiResponse<ILesson[]>) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ lesson_id }) => ({
                type: "Lesson" as const,
                id: lesson_id,
              })),
              { type: "Lesson", id: "LIST" },
            ]
          : [{ type: "Lesson", id: "LIST" }],
    }),

    getAdminLessons: builder.query<ILesson[], void>({
      query: () => "/lessons/admin",
      transformResponse: (response: IApiResponse<ILesson[]>) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ lesson_id }) => ({
                type: "Lesson" as const,
                id: lesson_id,
              })),
              { type: "Lesson", id: "ADMIN_LIST" },
            ]
          : [{ type: "Lesson", id: "ADMIN_LIST" }],
    }),

    getLessonsByCategory: builder.query<ILesson[], number>({
      query: (categoryId) => `/lessons/category/${categoryId}`,
      transformResponse: (response: IApiResponse<ILesson[]>) => response.result,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ lesson_id }) => ({
                type: "Lesson" as const,
                id: lesson_id,
              })),
              { type: "Lesson", id: "LIST" },
            ]
          : [{ type: "Lesson", id: "LIST" }],
    }),

    // 5. Get Lesson Detail
    getLesson: builder.query<ILesson, number>({
      query: (lessonId) => `/lessons/${lessonId}`,
      transformResponse: (response: IApiResponse<ILesson>) => response.result,
      providesTags: (_result, _error, lessonId) => [
        { type: "Lesson", id: lessonId },
      ],
    }),

      getAdminLesson: builder.query<ILesson, number>({
          query: (lessonId) => `/lessons/admin/${lessonId}`,
          transformResponse: (response: IApiResponse<ILesson>) => response.result,
          providesTags: (_result, _error, lessonId) => [
              { type: "Lesson", id: lessonId },
          ],
      }),

    // 6. Create Lesson
    createLesson: builder.mutation<ILesson, CreateLessonPayload>({
      query: (data) => ({
        url: "/lessons",
        method: "POST",
        body: data, // Gửi JSON body bình thường
      }),
      transformResponse: (response: IApiResponse<ILesson>) => response.result,
      invalidatesTags: [
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: "ADMIN_LIST" },
      ],
    }),

    // 7. Update Lesson
    updateLesson: builder.mutation<
      ILesson,
      { lessonId: number; data: UpdateLessonPayload }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/${lessonId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: IApiResponse<ILesson>) => response.result,
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: "Lesson", id: lessonId },
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: "ADMIN_LIST" },
      ],
    }),

    // 8. Delete Lesson
    deleteLesson: builder.mutation<void, number>({
      query: (lessonId) => ({
        url: `/lessons/${lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, lessonId) => [
        { type: "Lesson", id: lessonId },
        { type: "Lesson", id: "LIST" },
        { type: "Lesson", id: "ADMIN_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadLessonMediaMutation,
  useGetLessonsQuery,
  useGetAdminLessonsQuery,
  useGetLessonsByCategoryQuery,
  useGetLessonQuery,
    useGetAdminLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonApi;