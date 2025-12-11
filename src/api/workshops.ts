import apiClient from './client';

// Type definitions
export interface WorkshopFormData {
  kind: 'SERVICE' | 'EVENT';
  title: string;
  subtitle?: string;
  category: string;
  target_group: string;
  program_duration: string;
  description: string;
  region: string;
  activity_types_ids?: number[];
  features_ids?: number[];
  image?: File | string;
  is_published: boolean;
  event_date?: string;
  event_date_end?: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  sessions_count: number;
  session_duration_minutes: number;
  price_eur: number;
  is_free: boolean;
}

export interface SlotFormData {
  start_datetime: string;
  end_datetime: string;
  capacity: number;
}

export interface ActivityType {
  id: number;
  code: string;
  name: string;
}

export interface Feature {
  id: number;
  code: string;
  name: string;
}

export interface Workshop {
  id: number;
  kind: 'SERVICE' | 'EVENT';
  title: string;
  subtitle?: string;
  category: string;
  category_display: string;
  target_group: string;
  program_duration: string;
  duration?: string; // Alias for program_duration
  description: string;
  region: string;
  region_display: string;
  address?: string;
  activity_types: ActivityType[];
  features: Feature[];
  image?: string;
  is_published: boolean;
  is_verified: boolean;
  is_edited?: boolean;
  is_renewal?: boolean;
  previous_version_id?: number | null;
  average_rating: number;
  ratings_count: number;
  views_count: number;
  bookmarks_count?: number;
  event_date?: string;
  event_date_start?: string; // Alias for event_date
  event_date_end?: string;
  services: Service[];
  available_slots: AvailableSlot[];
  provider_id: number;
  provider_user_id: number;
  provider_name: string;
  provider_profile_picture?: string;
  provider_phone?: string;
  provider_email?: string;
  provider_website?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  title?: string; // Alias for name
  description: string;
  sessions_count: number;
  session_duration_minutes: number;
  duration_minutes?: number; // Alias for session_duration_minutes
  price_eur: string;
  is_free: boolean;
  capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlot {
  id: number;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  created_at: string;
  updated_at: string;
}

// API functions
export const fetchWorkshops = async (params?: any): Promise<{ results: Workshop[]; count: number }> => {
  const response = await apiClient.get<{ results: Workshop[]; count: number }>('/workshops/', { params });
  return response.data;
};

export const getActivityTypes = async (): Promise<ActivityType[]> => {
  const response = await apiClient.get('/activity-types/');
  // Handle both paginated and non-paginated responses
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.results || [];
};

export const getFeatures = async (): Promise<Feature[]> => {
  const response = await apiClient.get('/features/');
  // Handle both paginated and non-paginated responses
  if (Array.isArray(response.data)) {
    return response.data;
  }
  return response.data.results || [];
};

export const createWorkshop = async (formData: WorkshopFormData): Promise<Workshop> => {
  const data = new FormData();
  
  // Append all non-file fields
  Object.keys(formData).forEach((key) => {
    const value = formData[key as keyof WorkshopFormData];
    if (value !== undefined && value !== null && key !== 'image' && key !== 'activity_types_ids' && key !== 'features_ids') {
      data.append(key, String(value));
    }
  });
  
  // Append arrays
  if (formData.activity_types_ids && formData.activity_types_ids.length > 0) {
    formData.activity_types_ids.forEach(id => data.append('activity_types_ids', String(id)));
  }
  if (formData.features_ids && formData.features_ids.length > 0) {
    formData.features_ids.forEach(id => data.append('features_ids', String(id)));
  }
  
  // Append image file
  if (formData.image instanceof File) {
    data.append('image', formData.image);
  }
  
  const response = await apiClient.post<Workshop>('/workshops/', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateWorkshop = async (id: number, formData: Partial<WorkshopFormData>): Promise<Workshop> => {
  const data = new FormData();
  
  // Append all non-file fields
  Object.keys(formData).forEach((key) => {
    const value = formData[key as keyof WorkshopFormData];
    if (value !== undefined && value !== null && key !== 'image' && key !== 'activity_types_ids' && key !== 'features_ids') {
      data.append(key, String(value));
    }
  });
  
  // Append arrays
  if (formData.activity_types_ids) {
    formData.activity_types_ids.forEach(id => data.append('activity_types_ids', String(id)));
  }
  if (formData.features_ids) {
    formData.features_ids.forEach(id => data.append('features_ids', String(id)));
  }
  
  // Append image file
  if (formData.image instanceof File) {
    data.append('image', formData.image);
  }
  
  const response = await apiClient.patch<Workshop>(`/workshops/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getWorkshop = async (id: number): Promise<Workshop> => {
  const response = await apiClient.get<Workshop>(`/workshops/${id}/`);
  return response.data;
};

export const addService = async (workshopId: number, serviceData: ServiceFormData): Promise<Service> => {
  const response = await apiClient.post<Service>(`/workshops/${workshopId}/add_service/`, serviceData);
  return response.data;
};

export const removeService = async (workshopId: number, serviceId: number): Promise<void> => {
  await apiClient.delete(`/workshops/${workshopId}/remove_service/${serviceId}/`);
};

export const addSlot = async (workshopId: number, slotData: SlotFormData): Promise<AvailableSlot> => {
  const response = await apiClient.post<AvailableSlot>(`/workshops/${workshopId}/add_slot/`, slotData);
  return response.data;
};

export const removeSlot = async (workshopId: number, slotId: number): Promise<void> => {
  await apiClient.delete(`/workshops/${workshopId}/remove_slot/${slotId}/`);
};

export const getMyWorkshops = async (status?: 'active' | 'in_review' | 'expired'): Promise<{ workshops: Workshop[]; count: number }> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<{ workshops: Workshop[]; count: number }>('/workshops/my_workshops/', { params });
  return response.data;
};

export const getMyWorkshopsCounts = async (): Promise<{ active: number; in_review: number; expired: number }> => {
  const response = await apiClient.get<{ counts: { active: number; in_review: number; expired: number } }>('/workshops/my_workshops/');
  return response.data.counts;
};

// Admin endpoints
export const getPendingWorkshops = async (): Promise<{ workshops: Workshop[]; count: number }> => {
  const response = await apiClient.get<{ workshops: Workshop[]; count: number }>('/workshops/pending_approval/');
  return response.data;
};

export const approveWorkshop = async (workshopId: number): Promise<void> => {
  await apiClient.post(`/workshops/${workshopId}/approve/`);
};

export const denyWorkshop = async (workshopId: number, reason?: string): Promise<void> => {
  await apiClient.post(`/workshops/${workshopId}/deny/`, { reason });
};

export const renewWorkshop = async (workshopId: number, eventDateEnd: string): Promise<void> => {
  await apiClient.post(`/workshops/${workshopId}/renew/`, { event_date_end: eventDateEnd });
};

export const deleteWorkshop = async (workshopId: number): Promise<void> => {
  await apiClient.delete(`/workshops/${workshopId}/`);
};

export const getWorkshopById = async (workshopId: number): Promise<Workshop> => {
  const response = await apiClient.get<Workshop>(`/workshops/${workshopId}/`);
  return response.data;
};
