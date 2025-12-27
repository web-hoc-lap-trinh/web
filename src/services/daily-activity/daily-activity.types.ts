export interface IDailyActivityStats {
    activity_date: string;
    problems_solved: number;
    lessons_completed: number;
    time_spent: number;
    points_earned: number;
    streak_day: number;
}

export interface IActivityLog extends IDailyActivityStats {
    activity_id: number;
    user_id: number;
    created_at: string;
}

export interface ActivityHistoryResponse {
    data: IActivityLog[];
    total: number;
    page: number;
    limit: number;
}

// Params để gọi API history
export interface HistoryParams {
    page?: number;
    limit?: number;
}