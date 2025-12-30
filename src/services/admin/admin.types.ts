import type {IUser} from "../../types/user.types.ts";

export interface PaginatedAdminUserResponse {
    users: IUser[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages?: number;
    };
}

export interface PaginatedAdminUserResult {
    items: IUser[];
    total: number;
    page: number;
    limit: number;
}

export interface GetAdminUsersParams {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}