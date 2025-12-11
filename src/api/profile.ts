import apiClient from './client';
import type { UserProfile } from '../types';

export interface ProfileData {
  organization_name: string;
  profile_picture?: string;
  about_us?: string;
  tax_number?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_position?: string;
  contact_phone?: string;
  contact_email?: string;
  has_public_interest_certificate?: boolean;
  public_interest_certificate_file?: File | null;
  has_clean_record_certificates?: boolean;
  clean_record_certificates_file?: File | null;
  website_url?: string;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  skype_username?: string;
  whatsapp_number?: string;
}

export interface ProfileUpdateData extends Partial<ProfileData> {
  profile_picture_file?: File | null;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/auth/profile/');
  return response.data;
};

export const updateProfile = async (data: ProfileUpdateData): Promise<ProfileData> => {
  // If there are files, use FormData
  const hasFiles = data.profile_picture_file || data.public_interest_certificate_file || data.clean_record_certificates_file;
  
  if (hasFiles) {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          // Map profile_picture_file to profile_picture
          const fieldName = key === 'profile_picture_file' ? 'profile_picture' : key;
          formData.append(fieldName, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (key !== 'profile_picture_file') {
          formData.append(key, value as string);
        }
      }
    });
    
    const response = await apiClient.put('/auth/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    const response = await apiClient.put('/auth/profile/', data);
    return response.data;
  }
};

