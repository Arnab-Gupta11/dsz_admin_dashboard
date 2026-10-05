export interface IProgressUser {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  status: string;
  createdAt: string;
  purchasedCourses: number;
  purchasedEbooks: number;
  ongoingCourses: number;
  completedCourses: number;
  ebooksInProgress: number;
  quizAttempts: number;
  quizzesPassed: number;
  overallCourseProgress: number;
}

export interface IProgressListResponse {
  data: IProgressUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IProgressQueryParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface IUserProgressDetails {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  phoneNumber: string | null;
  status: string;
  languagePreference: string;
  createdAt: string;
}

export interface IProgressSummary {
  purchasedCourses: number;
  purchasedEbooks: number;
  ongoingCourses: number;
  completedCourses: number;
  notStartedCourses: number;
  ebooksOngoing: number;
  ebooksCompleted: number;
  quizAttempts: number;
  quizzesPassed: number;
  quizzesFailed: number;
  quizzesOngoing: number;
  overallCourseProgress: number;
}

export interface ILastLesson {
  id: string;
  title: string;
  lessonNumber: number;
  moduleId?: string;
}

export interface ICourseProgressItem {
  courseId: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string | null;
  durationHours: string;
  status: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lessonsPending: number;
  startedAt: string | null;
  lastAccessedAt: string | null;
  completedAt: string | null;
  lastLesson: ILastLesson | null;
  completedLessonIds: string[];
}

export interface IEbookProgressItem {
  ebookId: string;
  title: string;
  subtitle: string;
  coverImageUrl: string | null;
  pageCount: number;
  pagesRead: number;
  totalPages: number;
  progressPercent: number;
  lastReadAt: string | null;
  status: string;
}

export interface IQuizAttemptItem {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  quizTopic: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  moduleNumber: number;
  scorePercent: number;
  passingScorePercent: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  passed: boolean;
  timeTakenSeconds: number;
  startedAt: string;
  completedAt: string;
  status: string;
}

export interface IPurchaseItem {
  id: string;
  itemType: string;
  itemId: string;
  amountPaid: string;
  currency: string;
  purchasedAt: string;
}

export interface IProgressDetailsResponse {
  user: IUserProgressDetails;
  summary: IProgressSummary;
  courses: {
    ongoing: ICourseProgressItem[];
    completed: ICourseProgressItem[];
    notStarted: ICourseProgressItem[];
  };
  ebooks: {
    ongoing: IEbookProgressItem[];
    completed: IEbookProgressItem[];
    notStarted: IEbookProgressItem[];
  };
  quizzes: {
    ongoing: IQuizAttemptItem[];
    completed: IQuizAttemptItem[];
    all: IQuizAttemptItem[];
  };
  purchases: IPurchaseItem[];
}

export interface ICourseShortDetails {
  id: string;
  title: string;
  subtitle: string;
  thumbnailUrl: string | null;
}

export interface ICourseProgressSummary {
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lessonsPending: number;
  startedAt: string | null;
  lastAccessedAt: string | null;
  completedAt: string | null;
  lastLesson: ILastLesson | null;
  status: string;
}

export interface ILessonProgressItem {
  id: string;
  title: string;
  lessonNumber: number;
  contentType: string;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface IModuleProgressItem {
  id: string;
  title: string;
  moduleNumber: number;
  isFree: boolean;
  lessons: ILessonProgressItem[];
}

export interface IProgressCourseDetailsResponse {
  user: {
    id: string;
    name: string;
    email: string;
    profilePhotoUrl: string | null;
  };
  course: ICourseShortDetails;
  progress: ICourseProgressSummary;
  modules: IModuleProgressItem[];
}
