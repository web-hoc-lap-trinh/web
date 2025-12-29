import { authApi } from "../auth/auth.service";
import type {
    IAdminReply,
    IDiscussion,
    IReply,
} from "../../types/discussion.types";
import type {
    DiscussionListResponse,
    ReplyListResponse,
    GetDiscussionsParams,
    CreateDiscussionPayload,
    UpdateDiscussionPayload,
    CreateReplyPayload,
    VotePayload, PaginatedAdminDiscussionResult, GetAdminDiscussionParams, AdminDiscussionsResponse,
} from "./discussion.types";

export const discussionApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscussions: builder.query<DiscussionListResponse, GetDiscussionsParams>({
      query: (params) => ({
        url: "/community/discussions",
        params: params,
      }),
      transformResponse: (response: any) => {
        const apiData = response.result;
        
        return {
          total: apiData.total,
          page: apiData.page,
          items: apiData.data.map((item: any) => ({
            ...item,
            total_replies: item.reply_count, 
            vote_count: (item.upvotes || 0) - (item.downvotes || 0),
            user_vote_type: item.user_vote_type || null 
          })),
        };
      },
      
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ discussion_id }) => ({
                type: "Discussion" as const,
                id: discussion_id,
              })),
              { type: "Discussion", id: "LIST" },
            ]
          : [{ type: "Discussion", id: "LIST" }],
    }),

      getAdminDiscussions: builder.query<PaginatedAdminDiscussionResult, GetAdminDiscussionParams | void>({
          query: (params) => ({
              url: "/admin/discussions",
              params: params || undefined,
          }),
          transformResponse: (response: IApiResponse<AdminDiscussionsResponse>) => {
              const { data, pagination } = response.result;
              return {
                  items: data,
                  total: pagination?.total || 0,
                  page: pagination?.page || 1,
                  limit: pagination?.limit || 10,
              };
          },
          providesTags: (result) =>
              result
                  ? [
                      ...result.items.map(({ discussion_id }) => ({ type: "Discussion" as const, id: discussion_id })),
                      { type: "Discussion", id: "LIST" },
                  ]
                  : [{ type: "Discussion", id: "LIST" }],
      }),

    getDiscussion: builder.query<IDiscussion, number | string>({
      query: (discussionId) => `/community/discussions/${discussionId}`,
      transformResponse: (response: IApiResponse<IDiscussion>) => response.result,
      providesTags: (_result, _error, id) => [{ type: "Discussion", id }],
    }),

    createDiscussion: builder.mutation<IDiscussion, CreateDiscussionPayload>({
      query: (data) => ({
        url: "/community/discussions",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<IDiscussion>) => response.result,
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),

    updateDiscussion: builder.mutation<
      IDiscussion,
      { discussionId: number | string; data: UpdateDiscussionPayload }
    >({
      query: ({ discussionId, data }) => ({
        url: `/community/discussions/${discussionId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: IApiResponse<IDiscussion>) => response.result,
      invalidatesTags: (_result, _error, { discussionId }) => [
        { type: "Discussion", id: discussionId },
        { type: "Discussion", id: "LIST" },
      ],
    }),

    deleteDiscussion: builder.mutation<void, number | string>({
      query: (discussionId) => ({
        url: `/community/discussions/${discussionId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),

      deleteAdminDiscussion: builder.mutation<void, number>({
      query: (discussionId) => ({
        url: `/admin/discussions/${discussionId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Discussion", id: "LIST" }],
    }),

    getReplies: builder.query<ReplyListResponse, number | string>({
      query: (discussionId) => `/community/discussions/${discussionId}/replies`,
      transformResponse: (response: any) => {
        const result = response.result;
        return {
            total: result.total,
            items: result.data.map((item: any) => ({
                ...item,
                children: [] 
            }))
        };
      },
      providesTags: (result, _error, discussionId) =>
        result
          ? [
              ...result.items.map(({ reply_id }) => ({
                type: "Reply" as const,
                id: reply_id,
              })),
              { type: "Reply", id: `LIST_${discussionId}` },
            ]
          : [{ type: "Reply", id: `LIST_${discussionId}` }],
    }),

      getAdminReplies: builder.query<IAdminReply[], number>({
          query: (id) => `/admin/discussions/${id}/replies`,
          transformResponse: (response: IApiResponse<{ data: IAdminReply[] }>) =>
              response.result.data,

          providesTags: (result) =>
              result
                  ? [
                      ...result.map(({ reply_id }) => ({
                          type: "Reply" as const,
                          id: reply_id,
                      })),
                      { type: "Reply", id: "LIST" },
                  ]
                  : [{ type: "Reply", id: "LIST" }],
      }),

    createReply: builder.mutation<
      IReply,
      { discussionId: number | string; data: CreateReplyPayload }
    >({
      query: ({ discussionId, data }) => ({
        url: `/community/discussions/${discussionId}/replies`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<IReply>) => response.result,
      invalidatesTags: (_res, _err, { discussionId }) => [
        { type: "Reply", id: `LIST_${discussionId}` },
          { type: "Reply", id: "LIST" },
        { type: "Discussion", id: discussionId }, 
      ],
    }),

    deleteReply: builder.mutation<void, { replyId: number; discussionId: string | number }>({
      query: ({ replyId }) => ({
        url: `/community/replies/${replyId}`, 
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, { discussionId }) => [
        { type: "Reply", id: `LIST_${discussionId}` },
        { type: "Discussion", id: discussionId }, 
      ],
    }),

    vote: builder.mutation<void, VotePayload>({
      query: (data) => ({
        url: "/community/votes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_res, _err, { discussion_id, reply_id }) => {
        const tags = [];
        if (discussion_id) tags.push({ type: "Discussion" as const, id: discussion_id });
        if (reply_id) tags.push({ type: "Reply" as const, id: reply_id });
        return tags;
      },
    }),

      markSolution: builder.mutation<
          IDiscussion,
          { discussionId: number }
      >({
          query: ({ discussionId }) => ({
              url: `/admin/discussions/${discussionId}/mark-solution`,
              method: "PATCH",
          }),
          transformResponse: (response: IApiResponse<IDiscussion>) => response.result,
          invalidatesTags: (_res, _err, { discussionId }) => [
              { type: "Reply", id: `LIST_${discussionId}` },
              { type: "Discussion", id: discussionId },
          ],
      }),
  }),
  overrideExisting: false,
});

export const {
  useGetDiscussionsQuery,
    useGetAdminDiscussionsQuery,
  useGetDiscussionQuery,
  useCreateDiscussionMutation,
  useUpdateDiscussionMutation,
  useDeleteDiscussionMutation,
    useDeleteAdminDiscussionMutation,

  useGetRepliesQuery,
    useGetAdminRepliesQuery,
  useCreateReplyMutation,
  useDeleteReplyMutation,

  useVoteMutation,
    useMarkSolutionMutation,
} = discussionApi;