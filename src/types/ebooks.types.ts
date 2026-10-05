export interface IEbook {
  _id: string;
  id?: string;
  title: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  pdfUrl: string;
  format: string;
  pageCount: number;
  language: string;
  price: number;
  publisher: string | null;
  isbn: string | null;
  description: string | null;
  seoDescription: string | null;
  status: string;
  appleProductId?: string;
  releaseDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IEbooksParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  language?: string;
  isActive?: boolean;
}

export interface IEbooksResponse {
  data: IEbook[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
