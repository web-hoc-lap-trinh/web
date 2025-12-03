export interface ICategory {
    category_id: string
    name: string
    icon_url: string
    order_index: number
    is_active: number
    created_at: Date
}
type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface ILesson {
    lesson_id: string
    title: string
    description: string
    content: string
    difficulty_level: LessonDifficulty
    is_published: number
    view_count: number
    created_at: Date
    updated_at: Date
}

type ExerciseType = 'fill_black' | 'fix_code' | 'multiple_choice' | 'coding'

export interface IExercise {
    exercise_id: string
    title: string
    description: string
    exercise_type: ExerciseType
    hints: string
    explanation: string
    created_at: Date
}