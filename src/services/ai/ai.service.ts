import { authApi } from "../auth/auth.service";
import type {
  ChatPayload,
  ChatResponse,
  ConversationResponse,
  MessagesResponse,
} from "../../types/ai.types";

export const aiApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    chatWithAi: builder.mutation<
      ChatResponse,
      { problemId: number | string; data: ChatPayload }
    >({
      query: ({ problemId, data }) => ({
        url: `/problems/${problemId}/ai/chat`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: IApiResponse<ChatResponse>) => response.result,
      invalidatesTags: (_result, _error, { problemId }) => [
        { type: "AiConversation", id: problemId },
      ],
    }),

    getAiConversation: builder.query<ConversationResponse, number | string>({
      query: (problemId) => `/problems/${problemId}/ai/conversation`,
      transformResponse: (response: IApiResponse<ConversationResponse>) =>
        response.result,
      providesTags: (_result, _error, problemId) => [
        { type: "AiConversation", id: problemId },
      ],
    }),

    deleteAiConversation: builder.mutation<void, number | string>({
      query: (problemId) => ({
        url: `/problems/${problemId}/ai/conversation`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, problemId) => [
        { type: "AiConversation", id: problemId },
      ],
    }),

    getAiMessages: builder.query<MessagesResponse, number | string>({
      query: (problemId) => `/problems/${problemId}/ai/messages`,
      transformResponse: (response: IApiResponse<MessagesResponse>) =>
        response.result,
      providesTags: (_result, _error, problemId) => [
        { type: "AiConversation", id: `MSG_${problemId}` }, 
        { type: "AiConversation", id: problemId },
      ],
    }),

    clearAiMessages: builder.mutation<void, number | string>({
      query: (problemId) => ({
        url: `/problems/${problemId}/ai/messages`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, problemId) => [
        { type: "AiConversation", id: problemId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useChatWithAiMutation,
  useGetAiConversationQuery,
  useDeleteAiConversationMutation,
  useGetAiMessagesQuery,
  useClearAiMessagesMutation,
} = aiApi;