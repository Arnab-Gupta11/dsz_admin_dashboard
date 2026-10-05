export interface ITransaction {
  id: string;
  transactionRef: string;
  student: {
    id: string;
    name: string;
    email: string;
    profilePhotoUrl: string | null;
  };
  purchaseItem: {
    type: string;
    title: string;
    thumbnailUrl: string | null;
  };
  purchaseDate: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ITransactionsParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export interface ITransactionsResponse {
  data: ITransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
