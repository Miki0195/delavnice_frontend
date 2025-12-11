import apiClient from './client';
import type { Workshop } from './workshops';

export interface Bookmark {
  id: number;
  workshop: number;
  workshop_title: string;
  workshop_category: string;
  workshop_address?: string;
  workshop_region?: string;
  workshop_image?: string;
  created_at: string;
}

export const toggleBookmark = async (workshopId: number): Promise<{ bookmarked: boolean; message: string }> => {
  const response = await apiClient.post<{ bookmarked: boolean; message: string }>(
    '/auth/dashboard/bookmarks/toggle/',
    { workshop_id: workshopId }
  );
  return response.data;
};

export const checkBookmark = async (workshopId: number): Promise<{ bookmarked: boolean }> => {
  const response = await apiClient.get<{ bookmarked: boolean }>(
    `/auth/dashboard/bookmarks/check/${workshopId}/`
  );
  return response.data;
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const response = await apiClient.get('/auth/dashboard/bookmarks/');
  
  // Handle both array and paginated response
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  // If paginated, return results array
  if (response.data && response.data.results) {
    return response.data.results;
  }
  
  // Fallback to empty array
  return [];
};

export const deleteBookmark = async (bookmarkId: number): Promise<void> => {
  await apiClient.delete(`/auth/dashboard/bookmarks/${bookmarkId}/`);
};

