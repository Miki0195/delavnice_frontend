import apiClient from './client';

export interface DashboardStats {
  active_workshops?: number;
  total_views?: number;
  total_ratings?: number;
  total_bookmarks?: number;
  total_reservations?: number;
  pending_reservations?: number;
  approved_reservations?: number;
  cancelled_reservations?: number;
}

export interface Activity {
  id: number;
  activity_type: string;
  description: string;
  workshop: number | null;
  workshop_title: string | null;
  created_at: string;
}

export interface ActivityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Activity[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/auth/dashboard/stats/');
  return response.data;
};

export const getActivities = async (page: number = 1): Promise<ActivityListResponse> => {
  const response = await apiClient.get(`/auth/dashboard/activities/?page=${page}&page_size=5`);
  return response.data;
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  await apiClient.delete(`/auth/dashboard/activities/${activityId}/`);
};

export const deleteAllActivities = async (): Promise<void> => {
  await apiClient.post('/auth/dashboard/activities/delete_all/');
};

