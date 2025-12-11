import apiClient from './client';

// Type definitions for reservation data
export type ReservationData = {
  workshop_id: number;
  service_id?: number;  // Optional for events
  slot_id?: number;
  date: string;  // YYYY-MM-DD format
  time?: string;  // HH:MM:SS format
  participants_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street?: string;
  postal_code?: string;
  country?: string;
  region?: string;
  class_name?: string;
  student_count?: number;
  message_from_school?: string;
};

export type Reservation = {
  id: number;
  workshop_id: number;
  workshop_title: string;
  workshop_image: string | null;
  service_name: string | null;
  service_price: string | null;
  school_id: number | null;
  school_name: string | null;
  user_email: string;
  provider_name: string;
  requested_slot: number | null;
  slot_start: string | null;
  slot_end: string | null;
  date: string;
  time: string | null;
  participants_count: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  postal_code: string;
  country: string;
  region: string;
  class_name: string;
  student_count: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  status_display: string;
  message_from_school: string;
  response_message: string;
  provider_notes: string;
  total_price: string;
  created_at: string;
  updated_at: string;
};

/**
 * Create a new reservation/booking
 */
export const createReservation = async (data: ReservationData): Promise<{message: string, reservation: Reservation}> => {
  const response = await apiClient.post('/reservations/', data);
  return response.data;
};

/**
 * Get user's own reservations
 */
export const getMyReservations = async (): Promise<Reservation[]> => {
  const response = await apiClient.get('/reservations/');
  return response.data.results || response.data;
};

/**
 * Get a specific reservation by ID
 */
export const getReservationById = async (id: number): Promise<Reservation> => {
  const response = await apiClient.get(`/reservations/${id}/`);
  return response.data;
};

/**
 * Cancel a reservation (user side)
 */
export const cancelReservation = async (id: number, reason?: string): Promise<{message: string, reservation: Reservation}> => {
  const response = await apiClient.patch(`/reservations/${id}/cancel/`, {
    message_from_school: reason
  });
  return response.data;
};

/**
 * Approve a reservation (provider side)
 */
export const approveReservation = async (id: number, responseMessage?: string): Promise<{message: string, reservation: Reservation}> => {
  const response = await apiClient.patch(`/reservations/${id}/approve/`, {
    response_message: responseMessage
  });
  return response.data;
};

/**
 * Reject a reservation (provider side)
 */
export const rejectReservation = async (id: number, responseMessage?: string): Promise<{message: string, reservation: Reservation}> => {
  const response = await apiClient.patch(`/reservations/${id}/reject/`, {
    response_message: responseMessage
  });
  return response.data;
};

/**
 * Get provider's workshop reservations (provider side)
 */
export const getProviderReservations = async (): Promise<Reservation[]> => {
  const response = await apiClient.get('/reservations/provider_reservations/');
  return response.data;
};

/**
 * Get reservation counts by status (provider side)
 */
export const getReservationCounts = async (): Promise<{
  pending: number;
  approved: number;
  cancelled: number;
}> => {
  const response = await apiClient.get('/reservations/provider_reservations/');
  const reservations = response.data || [];
  
  return {
    pending: reservations.filter((r: Reservation) => r.status === 'PENDING').length,
    approved: reservations.filter((r: Reservation) => r.status === 'APPROVED').length,
    cancelled: reservations.filter((r: Reservation) => r.status === 'CANCELLED' || r.status === 'REJECTED').length,
  };
};

