import apiClient from './client';
import type { ContactFormData } from '../types';

/**
 * Submit contact form
 */
export const submitContactForm = async (
  data: ContactFormData
): Promise<{ detail: string; data: ContactFormData }> => {
  const response = await apiClient.post('/contact/', data);
  return response.data;
};

