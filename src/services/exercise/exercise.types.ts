import type { IExerciseUserDetail, IExerciseNavigation, IExerciseOption, ExerciseType } from "../../types/exercise.types";

export interface ExerciseSessionResponse {
  has_exercises: boolean;
  exercise: IExerciseUserDetail;
  navigation: IExerciseNavigation;
}

export interface SubmitAnswerPayload {
  answer: string; 
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  correct_answer: string;
  explanation: string;
  user_answer: string;
}

export interface CreateExercisePayload {
  lesson_id: number;
  question: string;
  exercise_type: ExerciseType;
  options: IExerciseOption[];
  correct_answer: string;
  explanation: string;
  order_index: number;
}

export type UpdateExercisePayload = Partial<CreateExercisePayload>;

export interface ReorderExerciseItem {
  exercise_id: number;
  order_index: number;
}

export type ReorderExercisesPayload = ReorderExerciseItem[];