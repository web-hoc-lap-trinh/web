export type UserRole = "ADMIN" | "STUDENT";

export interface IUser {
  user_id: string
  email: string
  full_name: string
  avatar_url: string
  role: UserRole
  total_score: number
  solved_problems: number
  current_streak: number
  max_streak: number
  last_active: string
  is_verified: boolean
  created_at: Date
  updated_at: Date
}