export interface IPaginationParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export interface IOption {
  id?: string;
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id?: string;
  questionText: string;
  questionNumber?: number;
  explanation?: string;
  options: IOption[];
}

export interface ILesson {
  id?: string;
  title: string;
  contentType: string;
  contentUrl?: string;
  contentText?: string;
  contentImageUrl?: string;
  contentCaption?: string;
  translationText?: string;
}

export interface IQuiz {
  id?: string;
  title: string;
  topic?: string;
  timeLimitSeconds?: number;
  passingScorePercent?: number;
  questions?: IQuestion[];
}

export interface IModule {
  id?: string;
  title: string;
  moduleNumber?: number;
  lessons?: ILesson[];
  quizzes?: IQuiz[];
  isFree?: boolean;
}

export interface ICourse {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  durationHours?: number;
  language?: string;
  price?: number;
  isActive?: boolean;
  appleProductId?: string;
  modules?: IModule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICoursesResponse {
  data: ICourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IQuizzesResponse {
  data: IQuiz[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
