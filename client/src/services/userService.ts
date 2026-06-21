import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile?: string;
  aadhaar: string;
  pan: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  currentAddress: string;
  permanentAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  users: User[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const userService = {
  getUsers: (page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedResponse>>(`/users?page=${page}&limit=${limit}`),

  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<ApiResponse<User>>('/users', data),

  updateUser: (id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(`/users/${id}`),
};
