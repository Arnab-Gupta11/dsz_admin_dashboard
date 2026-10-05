export interface IAdmin {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: 'ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'deactive';
  profilePhotoUrl: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminsResponseData {
  data: IAdmin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateAdminPayload {
  name: string;
  email: string;
  password?: string;
  status: 'active' | 'deactive';
}

export interface IUpdateAdminPayload {
  name?: string;
  email?: string;
  status?: 'active' | 'deactive';
}

export interface IUpdateAdminStatusPayload {
  status: 'active' | 'deactive';
}

export interface IAdminsQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export interface IChangeOwnPasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}


