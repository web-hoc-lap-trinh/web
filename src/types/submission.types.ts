import type { IProblem } from "./problem.types";
import type { IUser } from "./user.types";

export const SubmissionStatus = {
    PENDING: 'PENDING',
    RUNNING: 'RUNNING',
    ACCEPTED: 'ACCEPTED',
    WRONG_ANSWER: 'WRONG_ANSWER',
    TIME_LIMIT: 'TIME_LIMIT',
    MEMORY_LIMIT: 'MEMORY_LIMIT',
    RUNTIME_ERROR: 'RUNTIME_ERROR',
    COMPILE_ERROR: 'COMPILE_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type SubmissionStatus = typeof SubmissionStatus[keyof typeof SubmissionStatus];
export type ProgrammingLanguage = 'cpp' | 'c' | 'python' | 'javascript' | 'java';

export interface ITestCaseResult {
    test_case_id: number;
    score: number;
    status: SubmissionStatus;
    stdout: string;
    stderr: string;
    expected_output?: string;
    actual_output?: string;
    execution_time: number;
    memory_used: number;
    is_sample: boolean;
}

export interface IExecutionLogs {
    judged_at: string;
    total_execution_time: number;
    max_memory_used: number;
    test_case_results: ITestCaseResult[];
}

export interface ISubmission {
    submission_id: number;
    user_id: number;
    problem_id: number;
    language_id?: number;
    language: string;
    language_version?: string;
    source_code: string;
    status: SubmissionStatus;
    execution_time: number;
    memory_used: number;
    points_earned: number;
    test_cases_passed: number;
    total_test_cases: number;
    error_message?: string | null;
    stdout?: string;
    stderr?: string;
    execution_logs?: IExecutionLogs;
    submitted_at: string;
    user?: IUser;
    problem?: IProblem;
}

export interface ISubmissionListItem extends Omit<ISubmission, 'source_code' | 'execution_logs' | 'stdout' | 'stderr'> { }

export interface ISubmissionStats {
    total_submissions: number;
    accepted: number;
    wrong_answer: number;
    time_limit: number;
    runtime_error: number;
    compile_error: number;
}

export interface ISubmissionStatus {
    submission_id: number;
    status: SubmissionStatus;
    execution_time: number;
    memory_used: number;
    points_earned: number;
    test_cases_passed: number;
    total_test_cases: number;
    error_message?: string | null;
}

