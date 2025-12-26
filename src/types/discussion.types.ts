import type { IUser } from "./user.types";

export type DiscussionType = "QUESTION" | "SOLUTION" | "GENERAL" | "BUG_REPORT";
export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface IDiscussion {
  discussion_id: number;
  problem_id?: number | null;
  lesson_id?: number | null;
  title: string;
  content: string; 
  discussion_type: DiscussionType;
  is_solution: boolean;
    reply_count: number;
  vote_count: number; 
  view_count: number;
  user_vote_type?: VoteType | null; 
  user: IUser;
  created_at: string;
  updated_at: string;
}

export interface IReply {
  reply_id: number;
  discussion_id: number;
  content: string;
  parent_reply_id: number | null;
  vote_count: number;
  user_vote_type?: VoteType | null;
  user: IUser;
  created_at: string;
  updated_at: string;
  children?: IReply[]; 
}

export interface IAdminReply {
    reply_id: number;
    discussion_id: number;
    user_id: number;
    content: string;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    user: IUser;
    discussion: IDiscussion;
}