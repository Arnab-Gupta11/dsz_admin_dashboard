export interface IStudent {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  coursesCount: number;
  ebooksCount: number;
}

export interface IStudentsParams {
  page?: number;
  limit?: number;
  q?: string;
}

export interface IStudentsResponse {
  data: IStudent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
