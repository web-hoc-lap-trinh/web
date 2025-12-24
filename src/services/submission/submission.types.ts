import type { ISubmissionListItem, ProgrammingLanguage, SubmissionStatus } from "../../types/submission.types";

export interface SubmissionListResponse {
  submissions: ISubmissionListItem[]; 
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSubmissionPayload {
  problem_id: number;
  language: ProgrammingLanguage;
  code: string;
}

export interface CreateSubmissionResponse {
  submission_id: number;
  status: SubmissionStatus;
  message: string;
}

export interface GetSubmissionsParams {
  problem_id?: number | string;
  user_id?: number | string;
  status?: SubmissionStatus;
  language?: string;
  page?: number;
  limit?: number;
}

export interface GetMySubmissionsParams {
  problem_id?: number | string;
  page?: number;
  limit?: number;
}