
export interface UpdateProfilePayload {
  full_name?: string;
  avatar_file?: File; 
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword?: string;
}