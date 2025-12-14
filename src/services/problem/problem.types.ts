import type { IProblem, ITestCase, PaginatedResponse } from "../../types/problem.types";

export interface ProblemsResponse {
	problems: IProblem[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages?: number;
	};
}

export interface ProblemResponse {
	problem: IProblem;
}

export interface TestCasesResponse extends PaginatedResponse<ITestCase> {}

export interface TestCaseResponse {
	testcase: ITestCase;
}

export interface IApiResponse<T> {
	code: number;
	message: string;
	result: T;
}
