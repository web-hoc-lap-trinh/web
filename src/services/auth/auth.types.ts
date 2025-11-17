import type { IUser } from "../../types/user.types";

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface ProfileResponse {
  user: IUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface VerifyPayload {
  email: string;
  otp: string;
}