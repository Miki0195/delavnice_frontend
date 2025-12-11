import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Edit2, Trash2, MessageCircle } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

interface ReviewReply {
  id: number;
  content: string;
  created_at: string;
}

interface ReviewWithWorkshop {
  id: number;
  workshop: number;
  workshop_title: string;
  user: number;
  user_name: string;
  quality_rating: number;
  expertise_rating: number;
  value_rating: number;
  average_rating: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
  reply?: ReviewReply;
}

// Fetch reviews ON provider's workshops
const getReviewsOnMyWorkshops = async (): Promise<ReviewWithWorkshop[]> => {
  const response = await apiClient.get('/reviews/on_my_workshops/');
  return response.data;
};

// Fetch user's own reviews
const getMyReviews = async (): Promise<ReviewWithWorkshop[]> => {
  const response = await apiClient.get('/reviews/my_reviews/');
  return response.data;
};

// Reply to review
const replyToReview = async (reviewId: number, content: string) => {
  const response = await apiClient.post(`/reviews/${reviewId}/reply/`, { content });
  return response.data;
};

// Update review
const updateReview = async (reviewId: number, data: {
  quality_rating: number;
  expertise_rating: number;
  value_rating: number;
  comment: string;
}) => {
  const response = await apiClient.patch(`/reviews/${reviewId}/`, data);
  return response.data;
};

// Delete review
const deleteReview = async (reviewId: number) => {
  await apiClient.delete(`/reviews/${reviewId}/`);
};

// Update reply
const updateReply = async (replyId: number, content: string) => {
  const response = await apiClient.patch(`/reviews/replies/${replyId}/`, { content });
  return response.data;
};

// Delete reply
const deleteReply = async (replyId: number) => {
  await apiClient.delete(`/reviews/replies/${replyId}/`);
};

const Ocene = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedSection, setExpandedSection] = useState<'users' | 'mine'>('users');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editReplyModalOpen, setEditReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithWorkshop | null>(null);
  const [selectedReply, setSelectedReply] = useState<ReviewReply | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editFormData, setEditFormData] = useState({
    quality: 0,
    expertise: 0,
    value: 0,
    comment: '',
  });

  // Fetch reviews on provider's workshops
  const { data: workshopReviews = [], isLoading: loadingWorkshopReviews } = useQuery({
    queryKey: ['workshopReviews'],
    queryFn: getReviewsOnMyWorkshops,
    enabled: user?.role === 'PROVIDER',
  });

  // Fetch user's own reviews
  const { data: myReviews = [], isLoading: loadingMyReviews } = useQuery({
    queryKey: ['myReviews'],
    queryFn: getMyReviews,
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: number; content: string }) =>
      replyToReview(reviewId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshopReviews'] });
      setReplyModalOpen(false);
      setReplyText('');
      setSelectedReview(null);
      alert('Odgovor uspešno objavljen!');
    },
    onError: () => {
      alert('Napaka pri objavi odgovora.');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ reviewId, data }: {
      reviewId: number;
      data: {
        quality_rating: number;
        expertise_rating: number;
        value_rating: number;
        comment: string;
      }
    }) => updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      setEditModalOpen(false);
      setSelectedReview(null);
      alert('Ocena uspešno posodobljena!');
    },
    onError: () => {
      alert('Napaka pri posodobitvi ocene.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
      alert('Ocena uspešno izbrisana!');
    },
    onError: () => {
      alert('Napaka pri brisanju ocene.');
    },
  });

  // Update reply mutation
  const updateReplyMutation = useMutation({
    mutationFn: ({ replyId, content }: { replyId: number; content: string }) =>
      updateReply(replyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshopReviews'] });
      setEditReplyModalOpen(false);
      setSelectedReply(null);
      setReplyText('');
      alert('Odgovor uspešno posodobljen!');
    },
    onError: () => {
      alert('Napaka pri posodobitvi odgovora.');
    },
  });

  // Delete reply mutation
  const deleteReplyMutation = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshopReviews'] });
      alert('Odgovor uspešno izbrisan!');
    },
    onError: () => {
      alert('Napaka pri brisanju odgovora.');
    },
  });

  const handleReplyClick = (review: ReviewWithWorkshop) => {
    setSelectedReview(review);
    setReplyModalOpen(true);
  };

  const handleEditClick = (review: ReviewWithWorkshop) => {
    setSelectedReview(review);
    setEditFormData({
      quality: review.quality_rating,
      expertise: review.expertise_rating,
      value: review.value_rating,
      comment: review.comment || '',
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (reviewId: number) => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati to oceno?')) {
      deleteMutation.mutate(reviewId);
    }
  };

  const handleEditReplyClick = (reply: ReviewReply) => {
    setSelectedReply(reply);
    setReplyText(reply.content);
    setEditReplyModalOpen(true);
  };

  const handleDeleteReplyClick = (replyId: number) => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati ta odgovor?')) {
      deleteReplyMutation.mutate(replyId);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReview && replyText.trim()) {
      replyMutation.mutate({
        reviewId: selectedReview.id,
        content: replyText,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReview) {
      updateMutation.mutate({
        reviewId: selectedReview.id,
        data: {
          quality_rating: editFormData.quality,
          expertise_rating: editFormData.expertise,
          value_rating: editFormData.value,
          comment: editFormData.comment,
        },
      });
    }
  };

  const handleEditReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReply && replyText.trim()) {
      updateReplyMutation.mutate({
        replyId: selectedReply.id,
        content: replyText,
      });
    }
  };

  const handleRatingClick = (category: 'quality' | 'expertise' | 'value', rating: number) => {
    setEditFormData(prev => ({ ...prev, [category]: rating }));
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ocene</h1>

        {/* Section Selector */}
        {user?.role === 'PROVIDER' && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setExpandedSection('users')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                expandedSection === 'users'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ocene uporabnikov
            </button>
            <button
              onClick={() => setExpandedSection('mine')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                expandedSection === 'mine'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Vaše ocene
            </button>
          </div>
        )}

        {/* Ocene uporabnikov - Reviews ON provider's workshops */}
        {expandedSection === 'users' && user?.role === 'PROVIDER' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ocene uporabnikov</h2>

            {loadingWorkshopReviews ? (
              <p className="text-gray-500">Nalaganje...</p>
            ) : workshopReviews.length === 0 ? (
              <p className="text-gray-500">Ni ocen na vaših delavnicah.</p>
            ) : (
              <div className="space-y-6">
                {workshopReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-semibold">
                          {review.user_name[0].toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                            <p className="text-sm text-cyan-600 font-medium">
                              on {review.workshop_title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('sl-SI', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.round(review.average_rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        )}

                        {/* Reply Display */}
                        {review.reply && (
                          <div className="bg-gray-50 p-4 rounded-lg mt-3 ml-8">
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-semibold text-gray-900">
                                Vaš odgovor:
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReplyClick(review.reply!)}
                                  className="text-gray-600 hover:text-cyan-600 transition-colors"
                                  title="Uredi odgovor"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReplyClick(review.reply!.id)}
                                  className="text-gray-600 hover:text-red-600 transition-colors"
                                  title="Izbriši odgovor"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{review.reply.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(review.reply.created_at).toLocaleDateString('sl-SI', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        )}

                        {/* Reply Button */}
                        {!review.reply && (
                          <button
                            onClick={() => handleReplyClick(review)}
                            className="mt-3 flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Reply to this review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vaše ocene - User's own reviews */}
        {expandedSection === 'mine' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vaše ocene</h2>

            {loadingMyReviews ? (
              <p className="text-gray-500">Nalaganje...</p>
            ) : myReviews.length === 0 ? (
              <p className="text-gray-500">Niste oddali nobene ocene.</p>
            ) : (
              <div className="space-y-6">
                {myReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-semibold">
                          {review.user_name[0].toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">Vaša ocena</h4>
                            <p className="text-sm text-cyan-600 font-medium">
                              on {review.workshop_title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('sl-SI', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.round(review.average_rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {review.comment && (
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(review)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Uredi oceno
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Izbriši oceno
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reply Modal */}
        {replyModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Odgovori na oceno
              </h3>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-900">{selectedReview.user_name}</p>
                <p className="text-sm text-gray-700 mt-2">{selectedReview.comment}</p>
              </div>

              <form onSubmit={handleReplySubmit}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none mb-4"
                  placeholder="Napišite svoj odgovor..."
                  required
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setReplyModalOpen(false);
                      setReplyText('');
                      setSelectedReview(null);
                    }}
                  >
                    Prekliči
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-cyan-500 hover:bg-cyan-600"
                    disabled={replyMutation.isPending}
                  >
                    {replyMutation.isPending ? 'Objavljanje...' : 'Objavi odgovor'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && selectedReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Uredi oceno
              </h3>

              <form onSubmit={handleEditSubmit}>
                {/* Rating Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Quality */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ocena kakovosti
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick('quality', rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= editFormData.quality
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expertise */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Strokovnost
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick('expertise', rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= editFormData.expertise
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cenovna vrednost
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingClick('value', rating)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= editFormData.value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Komentar
                  </label>
                  <textarea
                    value={editFormData.comment}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                    placeholder="Opišite svoje izkušnje..."
                    required
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditModalOpen(false);
                      setSelectedReview(null);
                    }}
                  >
                    Prekliči
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-cyan-500 hover:bg-cyan-600"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Posodabljanje...' : 'Posodobi oceno'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Reply Modal */}
        {editReplyModalOpen && selectedReply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Uredi odgovor
              </h3>

              <form onSubmit={handleEditReplySubmit}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none mb-4"
                  placeholder="Napišite svoj odgovor..."
                  required
                />

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditReplyModalOpen(false);
                      setReplyText('');
                      setSelectedReply(null);
                    }}
                  >
                    Prekliči
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-cyan-500 hover:bg-cyan-600"
                    disabled={updateReplyMutation.isPending}
                  >
                    {updateReplyMutation.isPending ? 'Posodabljanje...' : 'Posodobi odgovor'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Ocene;
