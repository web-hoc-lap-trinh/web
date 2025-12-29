import { authApi } from "../auth/auth.service";
import type {
	CreateProblemPayload,
	UpdateProblemPayload,
	ProblemListQuery,
	IProblem,
	ITestCase,
	CreateTestCasePayload,
	UpdateTestCasePayload,
	BulkCreateTestCasesPayload,
	PaginatedResponse,
} from "../../types/problem.types";
import type { IApiResponse, ProblemResponse, TestCaseResponse } from "./problem.types";

type ProblemTag = { type: "Problem"; id?: number | string };
type TestCaseTag = { type: "TestCase"; id?: number | string };

export const problemApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		getProblems: builder.query<PaginatedResponse<IProblem>, ProblemListQuery | void>({
			query: (params) => ({ url: "/problems", params: params || undefined }),
			transformResponse: (response: IApiResponse<any>) => {
				const { problems, pagination } = response.result;
				return {
					items: problems,
					total: pagination?.total || 0,
					page: pagination?.page || 1,
					limit: pagination?.limit || 10,
				};
			},
			providesTags: [{ type: "Problem", id: "LIST" } as ProblemTag],
		}),

		getProblem: builder.query<IProblem, number>({
			query: (id) => `/problems/${id}`,
			transformResponse: (response: IApiResponse<IProblem>) => {
				return response.result;
			},
			providesTags: (_, __, id) => [{ type: "Problem", id }],
		}),

		createProblem: builder.mutation<IProblem, CreateProblemPayload>({
			query: (body) => ({ url: "/problems", method: "POST", body }),
			transformResponse: (response: IApiResponse<ProblemResponse>) => response.result.problem,
			invalidatesTags: [{ type: "Problem", id: "LIST" } as ProblemTag],
		}),

		updateProblem: builder.mutation<IProblem, { id: number; data: UpdateProblemPayload }>({
			query: ({ id, data }) => ({ url: `/problems/${id}`, method: "PUT", body: data }),
			transformResponse: (response: IApiResponse<ProblemResponse>) => response.result.problem,
            invalidatesTags: (_result, _error, arg) => [
                { type: "Problem", id: arg.id },
                { type: "Problem", id: "LIST" }
            ],
		}),

		deleteProblem: builder.mutation<{ success: boolean }, number>({
			query: (id) => ({ url: `/problems/${id}`, method: "DELETE" }),
			transformResponse: (response: IApiResponse<{ success: boolean }>) => response.result,
			invalidatesTags: [{ type: "Problem", id: "LIST" } as ProblemTag],
		}),

		getDailyChallenge: builder.query<IProblem[], void>({
			query: () => "/problems/daily-challenge",
			transformResponse: (response: IApiResponse<IProblem[]>) => response.result,
			providesTags: [{ type: "Problem", id: "DAILY" } as ProblemTag],
		}),

		triggerDailyChallenge: builder.mutation<any, void>({
			query: () => ({
				url: "/problems/daily-challenge/update",
				method: "POST",
			}),
			invalidatesTags: [
				{ type: "Problem", id: "DAILY" } as ProblemTag,
				{ type: "Problem", id: "LIST" } as ProblemTag
			],
		}),

		/*getProblemTestCases: builder.query<PaginatedResponse<ITestCase>, { id: number; page?: number; limit?: number } | number>({
			query: (arg) => {
				if (typeof arg === "number") return { url: `/problems/${arg}/testcases` };
				const { id, page, limit } = arg;
				return { url: `/problems/${id}/testcases`, params: { page, limit } };
			},
			transformResponse: (response: IApiResponse<TestCasesResponse>) => response.result,
			providesTags: (result) =>
				result?.items
					? [
						...result.items.map((t) => ({ type: "TestCase", id: t.test_case_id } as TestCaseTag)),
						{ type: "TestCase", id: "LIST" } as TestCaseTag,
					]
					: [{ type: "TestCase", id: "LIST" } as TestCaseTag],
		}),*/

        getProblemTestCases: builder.query<
            ITestCase[],
            number
        >({
            query: (problemId) => `/problems/${problemId}/testcases`,
            transformResponse: (response: IApiResponse<ITestCase[]>) =>
                response.result,
            providesTags: (result, _, problemId) =>
                result
                    ? [
                        ...result.map(({ test_case_id }) => ({
                            type: "TestCase" as const,
                            id: test_case_id,
                        })),
                        { type: "TestCase", id: `LIST_BY_PROBLEM_${problemId}` },
                    ]
                    : [{ type: "TestCase", id: `LIST_BY_PROBLEM_${problemId}` }],
        }),

        getProblemTestCase: builder.query<
            ITestCase,
            number
        >({
            query: (id) => `/testcases/${id}`,
            transformResponse: (response: IApiResponse<ITestCase>) =>
                response.result,
            providesTags: (_, __, testcaseId) => [
                { type: "TestCase", id: testcaseId },
            ],
        }),

		createProblemTestCase: builder.mutation<ITestCase, { id: number; data: CreateTestCasePayload }>({
			query: ({ id, data }) => ({ url: `/problems/${id}/testcases`, method: "POST", body: data }),
			transformResponse: (response: IApiResponse<TestCaseResponse>) => response.result.testcase,
            invalidatesTags: (_result, _error, arg) => [
                { type: "TestCase", id: `LIST_BY_PROBLEM_${arg.id}` }
            ],
		}),

		bulkCreateProblemTestCases: builder.mutation<{ success: boolean }, { id: number; data: BulkCreateTestCasesPayload }>({
			query: ({ id, data }) => ({ url: `/problems/${id}/testcases/bulk`, method: "POST", body: data }),
			transformResponse: (response: IApiResponse<{ success: boolean }>) => response.result,
			invalidatesTags: [{ type: "TestCase", id: "LIST" } as TestCaseTag],
		}),

		updateTestCase: builder.mutation<ITestCase, { id: number; data: UpdateTestCasePayload }>({
			query: ({ id, data }) => ({ url: `/testcases/${id}`, method: "PUT", body: data }),
			transformResponse: (response: IApiResponse<TestCaseResponse>) => response.result.testcase,
			invalidatesTags: (result) => (result ? [{ type: "TestCase", id: result.test_case_id } as TestCaseTag] : []),
		}),

		deleteTestCase: builder.mutation<{ success: boolean }, number>({
			query: (id) => ({ url: `/testcases/${id}`, method: "DELETE" }),
			transformResponse: (response: IApiResponse<{ success: boolean }>) => response.result,
            invalidatesTags: (_result, _error, arg) => [
                { type: "TestCase", id: `LIST_BY_PROBLEM_${arg}` }
            ],
		}),
	}),
});

export const {
	useGetProblemsQuery,
    useGetProblemQuery,
	useCreateProblemMutation,
	useUpdateProblemMutation,
	useDeleteProblemMutation,
	useGetDailyChallengeQuery,
	useTriggerDailyChallengeMutation,
	useGetProblemTestCasesQuery,
    useGetProblemTestCaseQuery,
	useCreateProblemTestCaseMutation,
    useUpdateTestCaseMutation,
	useDeleteTestCaseMutation,
} = problemApi;