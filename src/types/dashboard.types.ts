export interface IDashboardStats {
    total_users: number,
    active_users_today: number,
    total_lessons: number,
    total_categories: number,
    total_problems: number,
    total_test_cases: number,
    total_submissions: number,
    accepted_submissions: number,
    acceptance_rate: number,
    current_highest_streak: number,
}

export interface IUserGrowth {
    date: string;
    new_users: number;
    total_users: number;
}

export interface ICategoryDistribution {
    category_id: number;
    category_name: string;
    lesson_count: number;
    view_count: number;
    percentage: number;
}

export interface ISubmissionStats {
    status: string;
    count: number;
    percentage: number;
}

export interface ISubmissionStatsParams {
    startDate?: string;
    endDate?: string;
    year?: number;
    month?: number;
}

export interface IProblemDifficulty {
    difficulty: string;
    count: number;
    percentage: number;
}