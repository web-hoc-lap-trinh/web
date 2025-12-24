import type {ICategory} from "./category.types.ts";

export type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface ILesson {
  lesson_id: string;
  title: string;
  description: string;
  content: string;
  difficulty_level: DifficultyLevel;
  is_published: boolean;
  view_count: number;
  updated_at: string;
  category: ICategory;
}