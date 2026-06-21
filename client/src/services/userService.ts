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
  getUsers: async (page = 1, limit = 10): Promise<PaginatedResponse> => {
    const response = await api.get<any, ApiResponse<PaginatedResponse>>(`/users?page=${page}&limit=${limit}`);
    return response.data!;
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const response = await api.post<any, ApiResponse<User>>('/users', data);
    return response.data!;
  },

  updateUser: async (id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> => {
    const response = await api.put<any, ApiResponse<User>>(`/users/${id}`, data);
    return response.data!;
  },

  deleteUser: async (id: string): Promise<null> => {
    const response = await api.delete<any, ApiResponse<null>>(`/users/${id}`);
    return response.data || null;
  },
};
