import apiClient from './client';
import type {
  LoginCredentials,
  LoginResponse,
  RegisterSchoolData,
  RegisterProviderData,
  RegisterResponse,
  UserProfile,
} from '../types';

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/token/', credentials);
  return response.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await apiClient.post('/auth/token/refresh/', { refresh });
  return response.data;
};

/**
 * Register as school
 */
export const registerSchool = async (data: RegisterSchoolData): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register/school/', data);
  return response.data;
};

/**
 * Register as provider
 */
export const registerProvider = async (
  data: RegisterProviderData
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>('/auth/register/provider/', data);
  return response.data;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/auth/me/');
  return response.data;
};

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await apiClient.get(`/auth/verify-email/?token=${token}`);
  return response.data;
};

