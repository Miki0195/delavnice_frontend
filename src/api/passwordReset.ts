import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetConfirmData {
  token: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Request a password reset email
 */
export const requestPasswordReset = async (data: PasswordResetRequestData) => {
  const response = await axios.post(
    `${API_URL}/auth/password-reset/request/`,
    data
  );
  return response.data;
};

/**
 * Confirm password reset with token and new password
 */
export const confirmPasswordReset = async (data: PasswordResetConfirmData) => {
  const response = await axios.post(
    `${API_URL}/auth/password-reset/confirm/`,
    data
  );
  return response.data;
};
