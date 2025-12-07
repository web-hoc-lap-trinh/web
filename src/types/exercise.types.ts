export type ExerciseType = "MULTIPLE_CHOICE" | "FILL_IN_BLANK" | "CODE";

export interface IExerciseOption {
  id: string; 
  text: string;
}

export interface IExerciseNavigation {
  current_index: number;
  total_questions: number;
  remaining_questions: number;
  is_first: boolean;
  is_last: boolean;
  next_exercise_id: number | null;
  prev_exercise_id: number | null;
}

export interface IExerciseUserDetail {
  exercise_id: number;
  lesson_id: number | string;
  question: string;
  exercise_type: ExerciseType;
  options: IExerciseOption[];
  order_index: number;
}

export interface IExercisePreview {
  exercise_id: number;
  question_preview: string;
  exercise_type: ExerciseType;
  order: number;
}

export interface IExerciseAdminDetail extends IExerciseUserDetail {
  correct_answer: string; 
  explanation: string;
  created_at?: string;
}