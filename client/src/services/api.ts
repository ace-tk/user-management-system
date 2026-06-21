import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

export interface ApiError {
  status: number;
  message: string;
  validationErrors: any[] | null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept responses to unwrap data and normalize errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Our backend wraps success data in a 'data' property
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response && error.response.data) {
      const backendData = error.response.data as any;
      
      const normalizedError: ApiError = {
        status: error.response.status,
        message: backendData.message || 'An error occurred processing your request',
        validationErrors: backendData.error || null,
      };
      
      return Promise.reject(normalizedError);
    }

    const networkError: ApiError = {
      status: error.status || 500,
      message: error.message || 'Network error occurred. Please check your connection.',
      validationErrors: null,
    };
    
    return Promise.reject(networkError);
  }
);

export default api;
