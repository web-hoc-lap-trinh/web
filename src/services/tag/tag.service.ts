import { authApi } from "../auth/auth.service";
import type { ITag } from "../../types/tag.types";
import type {
    TagProblemsResponse,
    GetTagsParams,
    GetTagProblemsParams,
    CreateTagPayload,
    UpdateTagPayload,
    PaginatedTagResult,
    PaginatedProblemResult,
    TagListResponse
} from "./tag.types";

type TagType = { type: "Tag"; id: number | string };

export const tagApi = authApi.injectEndpoints({
    endpoints: (builder) => ({
        getActiveTags: builder.query<ITag[], void>({
            query: () => "/tags/active",
            transformResponse: (response: IApiResponse<ITag[]>) => response.result,
            providesTags: [{ type: "Tag", id: "ACTIVE" }],
        }),

        getTagBySlug: builder.query<ITag, string>({
            query: (slug) => `/tags/slug/${slug}`,
            transformResponse: (response: IApiResponse<ITag>) => response.result,
            providesTags: (result) =>
                result ? [{ type: "Tag", id: result.tag_id }] : [],
        }),

        getProblemsByTag: builder.query<PaginatedProblemResult, GetTagProblemsParams>({
            query: ({ id, ...params }) => ({
                url: `/tags/${id}/problems`,
                params,
            }),
            transformResponse: (response: IApiResponse<TagProblemsResponse>) => {
                const { problems, pagination } = response.result;
                return {
                    items: problems,
                    total: pagination?.total || 0,
                    page: pagination?.page || 1,
                    limit: pagination?.limit || 10,
                };
            },
            providesTags: (result, _error, arg) =>
                result
                    ? [
                        ...result.items.map(({ problem_id }) => ({ type: "Problem" as const, id: problem_id })),
                        { type: "Tag", id: arg.id }
                    ]
                    : [],
        }),

        getTags: builder.query<PaginatedTagResult, GetTagsParams>({
            query: (params) => ({
                url: "/tags",
                params,
            }),
            transformResponse: (response: IApiResponse<TagListResponse>) => {
                const { tags, pagination } = response.result;
                return {
                    items: tags,
                    total: pagination?.total || 0,
                    page: pagination?.page || 1,
                    limit: pagination?.limit || 10,
                };
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ tag_id }) => ({ type: "Tag" as const, id: tag_id } as TagType)),
                        { type: "Tag", id: "LIST" },
                    ]
                    : [{ type: "Tag", id: "LIST" }],
        }),

        createTag: builder.mutation<ITag, CreateTagPayload>({
            query: (body) => ({
                url: "/tags",
                method: "POST",
                body,
            }),
            transformResponse: (response: IApiResponse<ITag>) => response.result,
            invalidatesTags: [
                { type: "Tag", id: "LIST" },
                { type: "Tag", id: "ACTIVE" }
            ],
        }),

        recalculateTagCounts: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: "/tags/recalculate-counts",
                method: "POST",
            }),
            invalidatesTags: [
                { type: "Tag", id: "LIST" },
                { type: "Tag", id: "ACTIVE" }
            ],
        }),

        getTag: builder.query<ITag, number | string>({
            query: (id) => `/tags/${id}`,
            transformResponse: (response: IApiResponse<ITag>) => response.result,
            providesTags: (_result, _error, id) => [{ type: "Tag", id }],
        }),

        updateTag: builder.mutation<ITag, { id: number | string; data: UpdateTagPayload }>({
            query: ({ id, data }) => ({
                url: `/tags/${id}`,
                method: "PUT",
                body: data,
            }),
            transformResponse: (response: IApiResponse<ITag>) => response.result,
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Tag", id },
                { type: "Tag", id: "LIST" },
                { type: "Tag", id: "ACTIVE" }
            ],
        }),

        deleteTag: builder.mutation<{ success: boolean }, number | string>({
            query: (id) => ({
                url: `/tags/${id}`,
                method: "DELETE",
            }),
            transformResponse: (response: IApiResponse<{ success: boolean }>) => response.result,
            invalidatesTags: [
                { type: "Tag", id: "LIST" },
                { type: "Tag", id: "ACTIVE" }
            ],
        }),

        toggleTagActive: builder.mutation<ITag, number | string>({
            query: (id) => ({
                url: `/tags/${id}/toggle`,
                method: "PATCH",
            }),
            transformResponse: (response: IApiResponse<ITag>) => response.result,
            invalidatesTags: (_result, _error, id) => [
                { type: "Tag", id },
                { type: "Tag", id: "LIST" },
                { type: "Tag", id: "ACTIVE" }
            ],
        }),
    }),
});

export const {
    useGetActiveTagsQuery,
    useGetTagBySlugQuery,
    useGetProblemsByTagQuery,
    useGetTagsQuery,
    useCreateTagMutation,
    useRecalculateTagCountsMutation,
    useGetTagQuery,
    useUpdateTagMutation,
    useDeleteTagMutation,
    useToggleTagActiveMutation,
} = tagApi;