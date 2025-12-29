export type Sort = "created_at" | "title" | "difficulty" | "submission_count" | "accepted_count";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Order = "ASC" | "DESC"

export interface IProblemTag {
  tag_id: number;
  slug: string;
  name: string;
  color?: string; 
  problem_count?: number;
}

export interface IProblemAuthor {
  user_id: number;
  full_name: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  is_verified?: boolean;
}

export interface IProblem {
  problem_id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  tag_ids: number[];
  tags?: IProblemTag[];
  input_format: string;
  output_format: string;
  constraints: string;
  samples?: IProblemSample[];
  time_limit: number;
  memory_limit: number;
  points: number;
  is_published: boolean;
  is_daily_challenge?: boolean;
  submission_count?: number; 
  accepted_count?: number;   
  acceptance_rate?: string;  
  author?: IProblemAuthor;   
  created_at: string;
  updated_at: string;
}

export interface IProblemSample {
	input: string;
	output: string;
	explanation?: string;
}

export interface ProblemListQuery {
    page?: number;
    limit?: number;
    difficulty?: Difficulty;
    tag_id?: number;
    tag?: string;
    search?: string;
    sort?: Sort;
    order?: Order;
}

export interface CreateProblemPayload {
	title: string;
	description: string;
	difficulty: Difficulty;
	tags_ids?: number[];
	input_format?: string;
	output_format?: string;
	constraints?: string;
	samples?: IProblemSample[];
	time_limit?: number;
	memory_limit?: number;
	points?: number;
	is_published?: boolean;
    is_daily_challenge?: boolean;
}

export type UpdateProblemPayload = Partial<CreateProblemPayload>;

export interface ITestCase {
  test_case_id: number; 
  problem_id: number;
  input_data: string;
  expected_output: string;
  is_sample: boolean;
  is_hidden: boolean;
  score: number;
  explanation: string;
  created_at: string;
}

export interface CreateTestCasePayload {
	input_data: string;
	expected_output: string;
	score?: number;
	is_sample?: boolean;
	is_hidden?: boolean;
	explanation?: string;
}

export interface BulkCreateTestCasesPayload {
	test_cases: CreateTestCasePayload[];
}

export type UpdateTestCasePayload = Partial<CreateTestCasePayload>;

export interface PaginatedResponse<T> {
	items: T[];
	page: number;
	limit: number;
	total: number;
}
