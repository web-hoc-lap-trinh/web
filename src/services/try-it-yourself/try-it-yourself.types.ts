export interface ISupportedLanguage {
  language_id: number;
  name: string;
  code: string; 
  version: string;
  docker_image: string;
  compile_command: string;
  run_command: string;
  file_extension: string;
  is_active: boolean;
  created_at: string;
}

export interface IPlaygroundLanguage {
  language_id: number;
  name: string;
  code: string;
  version: string;
}

export interface RunCodePayload {
  language_code: string; 
  source_code: string;
  input?: string; 
}

export interface RunLessonCodePayload {
  source_code: string;
  input?: string;
}

export interface RunCodeResponse {
  success: boolean;     
  output: string;       
  error: string | null; 
  execution_time: number; 
  status: string;       
}

export interface ITryItYourselfConfig {
  try_it_yourself_id: string;
  lesson_id: string;
  language_id: number;
  example_code: string; 
  created_at: string;
  updated_at: string;
}

export interface CreateTryItYourselfPayload {
  language_code: string;
  example_code: string;
}

export interface UpdateTryItYourselfPayload {
  language_id?: number;
  example_code?: string;
}