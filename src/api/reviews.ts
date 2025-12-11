import apiClient from './client';

export interface ReviewReply {
  id: number;
  content: string;
  provider_name: string;
  created_at: string;
}

export interface Review {
  id: number;
  workshop: number;
  user: number;
  user_name: string;
  user_email: string;
  quality_rating: number;
  expertise_rating: number;
  value_rating: number;
  average_rating: number;
  comment: string | null;
  helpful_count: number;
  reply?: ReviewReply;
  created_at: string;
  updated_at: string;
}

export interface ReviewSummary {
  total_reviews: number;
  average_quality: number;
  average_expertise: number;
  average_value: number;
  overall_average: number;
}

export interface CreateReviewData {
  workshop: number;
  quality_rating: number;
  expertise_rating: number;
  value_rating: number;
  comment?: string;
}

/**
 * Get reviews for a specific workshop
 */
export const getWorkshopReviews = async (workshopId: number): Promise<Review[]> => {
  const response = await apiClient.get<{count: number; results: Review[]}>(`/reviews/?workshop=${workshopId}`);
  return response.data.results || [];
};

/**
 * Get review summary statistics for a workshop
 */
export const getWorkshopReviewSummary = async (workshopId: number): Promise<ReviewSummary> => {
  const response = await apiClient.get<ReviewSummary>(`/reviews/workshop_summary/?workshop=${workshopId}`);
  return response.data;
};

/**
 * Create a new review
 */
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await apiClient.post<Review>('/reviews/', data);
  return response.data;
};

/**
 * Update an existing review
 */
export const updateReview = async (id: number, data: Partial<CreateReviewData>): Promise<Review> => {
  const response = await apiClient.patch<Review>(`/reviews/${id}/`, data);
  return response.data;
};

/**
 * Delete a review
 */
export const deleteReview = async (id: number): Promise<void> => {
  await apiClient.delete(`/reviews/${id}/`);
};

/**
 * Mark a review as helpful
 */
export const markReviewHelpful = async (id: number): Promise<Review> => {
  const response = await apiClient.post<Review>(`/reviews/${id}/mark_helpful/`);
  return response.data;
};

/**
 * Check if current user marked review as helpful
 */
export const checkReviewHelpful = async (id: number): Promise<{ marked_helpful: boolean; helpful_count: number }> => {
  const response = await apiClient.get(`/reviews/${id}/check_helpful/`);
  return response.data;
};

/**
 * Submit a new review (wrapper for createReview with workshopId)
 */
export const submitReview = async (
  workshopId: number,
  reviewData: {
    quality_rating: number;
    expertise_rating: number;
    value_rating: number;
    comment: string;
  }
): Promise<Review> => {
  return createReview({
    workshop: workshopId,
    ...reviewData,
  });
};

