import { LucideIcon } from 'lucide-react';

export interface IStatCard {
  id: number;
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export interface IOverviewStats {
  totalSale: number;
  totalUser: number;
  totalCourse: number;
  totalEbook: number;
}

export interface ISalesAnalysis {
  date: string;
  courseCount: number;
  courseRevenue: number;
  ebookCount: number;
  ebookRevenue: number;
  totalCount: number;
  totalRevenue: number;
}

export interface IStudentOverview {
  id: string;
  name: string;
  email: string;
  profilePhotoUrl: string | null;
  coursesCount: number;
  ebooksCount: number;
}

export interface IStudentOverviewResponse {
  data: IStudentOverview[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISalesAnalysisParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly' | string;
  category?: 'all' | 'course' | 'ebook' | string;
}

export interface IStudentsOverviewParams {
  page?: number;
  limit?: number;
  q?: string;
}
