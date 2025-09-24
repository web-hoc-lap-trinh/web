export type UserRole = "admin" | "user" | "guest";

export interface IFetchUser {
  userId: string;
  username: string;
  role: UserRole;
}