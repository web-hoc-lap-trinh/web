import { type DifficultyLevel } from "../../types/lesson.types";

export interface CreateLessonPayload {
  category_id: string | number;
  title: string;
  content: string;
  description?: string;
  difficulty_level: DifficultyLevel;
  order_index?: number;
}

export type UpdateLessonPayload = Partial<CreateLessonPayload>;

export interface UploadMediaPayload {
  media: File;
}

export interface UploadMediaResponse {
  url: string; 
}