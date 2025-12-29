export type UserRole = "ADMIN" | "STUDENT";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface IUser {
  user_id: number
  email: string
  full_name: string
  avatar_url: string
  role: UserRole
  status: UserStatus
  total_score: number
  solved_problems: number
  current_streak: number
  max_streak: number
  last_active: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface IUpdateUserStatus {
    status: string
}