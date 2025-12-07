import type { ICategory } from "./data.types";
export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ILesson {
  lesson_id: string;
  title: string;
  content: string;
  difficulty_level: DifficultyLevel;
  view_count: number;
  updated_at: Date;
  category: ICategory;
}