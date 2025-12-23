import { type IProblem } from "../../types/problem.types";
import { type ITag } from "../../types/tag.types";

export interface TagListResponse {
  tags: ITag[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface TagProblemsResponse {
  problems: IProblem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

export interface GetTagsParams {
  search?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface GetTagProblemsParams {
  id: number | string;
  page?: number;
  limit?: number;
}

export interface CreateTagPayload {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
}

export interface UpdateTagPayload extends Partial<CreateTagPayload> {}

export interface PaginatedTagResult {
  items: ITag[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedProblemResult {
  items: IProblem[];
  total: number;
  page: number;
  limit: number;
}