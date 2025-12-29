import type { IDiscussion, IReply, DiscussionType, VoteType } from "../../types/discussion.types";

export interface DiscussionListResponse {
  total: number;
  page: number;
  items: IDiscussion[];
}

export interface ReplyListResponse {
  total: number;
  items: IReply[];
}

export interface GetDiscussionsParams {
  problem_id?: number | string;
  lesson_id?: number | string;
  page?: number;
  limit?: number;
  type?: DiscussionType; 
}

export interface CreateDiscussionPayload {
  problem_id?: number | string;
  lesson_id?: number | string;
  title: string;
  content: string;
  discussion_type: DiscussionType;
  is_solution?: boolean;
}

export interface UpdateDiscussionPayload {
  title?: string;
  content?: string;
  discussion_type?: DiscussionType;
  is_solution?: boolean;
}

export interface CreateReplyPayload {
  content: string;
  parent_reply_id?: number | null;
}

export interface VotePayload {
  discussion_id?: number;
  reply_id?: number;
  vote_type: VoteType;
}

export interface PaginatedAdminDiscussionResult {
    items: IDiscussion[];
    total: number;
    page: number;
    limit: number;
}

export interface GetAdminDiscussionParams {
    search?: string;
    is_solution?: boolean;
    page?: number;
    limit?: number;
}

export interface AdminDiscussionsResponse {
    data: IDiscussion[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
    };
}