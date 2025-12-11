import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Star, Heart, Calendar, 
  Share2, MessageCircle, Phone, Mail, Globe, Camera, HelpCircle
} from 'lucide-react';
import { getWorkshopById } from '../api/workshops';
import { getWorkshopReviews, getWorkshopReviewSummary, submitReview } from '../api/reviews';
import { toggleBookmark, checkBookmark } from '../api/bookmarks';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import MessageModal from '../components/messaging/MessageModal';
import ReviewHelpfulButton from '../components/reviews/ReviewHelpfulButton';

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'pregled' | 'ocene'>('pregled');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  // Review form state
  const [reviewRatings, setReviewRatings] = useState({
    quality: 0,
    expertise: 0,
    value: 0,
  });
  const [reviewComment, setReviewComment] = useState('');
  
  // Booking state
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);

  // Fetch workshop data
  const { data: workshop, isLoading: workshopLoading } = useQuery({
    queryKey: ['workshop', id],
    queryFn: () => getWorkshopById(Number(id)),
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getWorkshopReviews(Number(id)),
    enabled: !!id,
  });

  // Check if current user has already reviewed this workshop
  const userHasReviewed = reviews.some(review => review.user === user?.id);

  // Fetch review summary
  const { data: reviewSummary } = useQuery({
    queryKey: ['reviewSummary', id],
    queryFn: () => getWorkshopReviewSummary(Number(id)),
    enabled: !!id,
  });

  // Check if bookmarked
  const { data: bookmarkStatus } = useQuery({
    queryKey: ['checkBookmark', id],
    queryFn: () => checkBookmark(Number(id!)),
    enabled: !!id && isAuthenticated,
  });

  const isBookmarked = bookmarkStatus?.bookmarked || false;

  // Toggle bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(Number(id!)),
    onSuccess: () => {
      // Refetch bookmark status and workshop to get updated bookmarks_count
      queryClient.invalidateQueries({ queryKey: ['checkBookmark', id] });
      queryClient.invalidateQueries({ queryKey: ['workshop', id] });
    },
    onError: (error) => {
      console.error('Failed to toggle bookmark:', error);
    },
  });

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      // Show login modal or redirect
      alert('Za shranjevanje delavnic se morate prijaviti.');
      return;
    }
    bookmarkMutation.mutate();
  };

  const handleBooking = () => {
    if (!workshop) return;
    
    // Validation for services
    if (workshop.kind === 'SERVICE') {
      if (!selectedServiceId) {
        alert('Prosimo, izberite storitev.');
        return;
      }
      if (!selectedDate) {
        alert('Prosimo, izberite datum.');
        return;
      }
      if (!selectedTime) {
        alert('Prosimo, izberite čas.');
        return;
      }

      const selectedService = services.find(s => s.id === selectedServiceId);
      
      // Check capacity
      if (selectedService?.capacity && participantsCount > selectedService.capacity) {
        alert(`Maksimalno število udeležencev za to storitev je ${selectedService.capacity}.`);
        return;
      }

      // Navigate to booking page with selections
      navigate(`/workshop/${id}/booking`, {
        state: {
          selectedService,
          selectedDate,
          selectedTime,
          participantsCount,
        },
      });
    } else {
      // For events
      if (!workshop.event_date_start) {
        alert('Datum dogodka ni določen.');
        return;
      }

      navigate(`/workshop/${id}/booking`, {
        state: {
          selectedService: { id: null, name: workshop.title, price_eur: minPrice },
          selectedDate: workshop.event_date_start,
          selectedTime: '10:00',
          participantsCount: 1,
        },
      });
    }
  };

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: {
      quality_rating: number;
      expertise_rating: number;
      value_rating: number;
      comment: string;
    }) => submitReview(Number(id!), reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', id] });
      queryClient.invalidateQueries({ queryKey: ['workshop', id] });
      // Reset form
      setReviewRatings({ quality: 0, expertise: 0, value: 0 });
      setReviewComment('');
      alert('Ocena uspešno oddana!');
    },
    onError: (error: any) => {
      console.error('Failed to submit review:', error);
      alert(error.response?.data?.detail || 'Napaka pri oddaji ocene.');
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Za oddajo ocene se morate prijaviti.');
      return;
    }

    if (!reviewRatings.quality || !reviewRatings.expertise || !reviewRatings.value) {
      alert('Prosimo, ocenite vse tri kategorije.');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Prosimo, napišite komentar.');
      return;
    }

    submitReviewMutation.mutate({
      quality_rating: reviewRatings.quality,
      expertise_rating: reviewRatings.expertise,
      value_rating: reviewRatings.value,
      comment: reviewComment,
    });
  };

  const handleRatingClick = (category: 'quality' | 'expertise' | 'value', rating: number) => {
    setReviewRatings(prev => ({ ...prev, [category]: rating }));
  };

  if (workshopLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Nalaganje...</div>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Delavnica ni najdena</div>
      </div>
    );
  }

  // Calculate price range from services
  const services = workshop.services || [];
  const prices = services.map(s => parseFloat(s.price_eur)).filter(p => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb / Categories */}
      <div className="flex items-center gap-4 mb-6">
        <span className="px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full text-sm font-medium">
          {workshop.category}
        </span>
        <span className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-sm">
          {workshop.kind === 'SERVICE' ? 'Storitev' : 'Dogodek'}
        </span>
        {minPrice > 0 && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {minPrice === maxPrice 
              ? `${minPrice.toFixed(2)}€` 
              : `${minPrice.toFixed(2)}€ - ${maxPrice.toFixed(2)}€`
            }
          </span>
        )}
      </div>

      {/* Title and Rating */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{workshop.title}</h1>
        {workshop.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{workshop.subtitle}</p>
        )}
        
        {/* Prominent Rating Display */}
        {reviewSummary && reviewSummary.total_reviews > 0 ? (
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg px-6 py-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.round(reviewSummary.overall_average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 border-l border-yellow-300 pl-3">
              <span className="text-2xl font-bold text-gray-900">
                {reviewSummary.overall_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                (Mnenja uporabnikov)
              </span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-6 py-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-gray-300"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">Ni še ocen</span>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            {workshop.image ? (
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-96 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-md flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-2">📷</div>
                  <p className="text-gray-500 font-medium">Ni slike</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('pregled')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'pregled'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pregled
              </button>
              <button
                onClick={() => setActiveTab('ocene')}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === 'ocene'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ocene ({reviews.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'pregled' ? (
            <div>
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Ciljna skupina:</h3>
                  <p className="text-base text-gray-900">{workshop.target_group}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Trajanje programa:</h3>
                  <p className="text-base text-gray-900">{workshop.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Regija:</h3>
                  <p className="text-base text-gray-900">{workshop.region_display}</p>
                </div>
                {workshop.features && workshop.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Lastnosti:</h3>
                    <p className="text-base text-gray-900">
                      {workshop.features.map(f => f.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Opis {workshop.kind === 'SERVICE' ? 'storitve' : 'dogodka'} z nameni in cilji
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {workshop.description}
                  </p>
                </div>
              </div>

              {/* Services List */}
              {workshop.kind === 'SERVICE' && services.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Seznam storitev</h2>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                          <span className="text-2xl font-bold text-gray-900">
                            {service.price_eur}€
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-gray-600 mb-4">{service.description}</p>
                        )}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Število izvedb:</span>
                            <span className="ml-2 font-medium">{service.sessions_count}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Trajanje 1 izvedbe:</span>
                            <span className="ml-2 font-medium">{service.duration_minutes} min</span>
                          </div>
                          {service.capacity && (
                            <div>
                              <span className="text-gray-500">Kapaciteta:</span>
                              <span className="ml-2 font-medium">{service.capacity} oseb</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Date */}
              {workshop.kind === 'EVENT' && workshop.event_date_start && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Datum dogodka</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {new Date(workshop.event_date_start).toLocaleDateString('sl-SI', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Information Section */}
            {(workshop.provider_phone || workshop.provider_email || workshop.provider_website) && (
                <div className="mt-12 mb-8">
                <div className="flex flex-wrap items-center gap-6 text-gray-700">
                    {workshop.provider_phone && (
                    <a 
                        href={`tel:${workshop.provider_phone}`}
                        className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        <span>{workshop.provider_phone}</span>
                    </a>
                    )}
                    {workshop.provider_email && (
                    <a 
                        href={`mailto:${workshop.provider_email}`}
                        className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span>{workshop.provider_email}</span>
                    </a>
                    )}
                    {workshop.provider_website && (
                    <a 
                        href={workshop.provider_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                        <span>{workshop.provider_website.replace(/^https?:\/\//, '')}</span>
                    </a>
                    )}
                </div>
                </div>
            )}
            </div>


          ) : (
            <div>
              {/* Add Review Form - Only show if user hasn't reviewed yet */}
              {!userHasReviewed && (
                <div className="bg-gray-50 rounded-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Dodaj oceno</h3>
                
                {isAuthenticated ? (
                  <div className="mb-6">
                    <p className="text-gray-600">
                      Prijavljen kot <span className="font-semibold">{user?.school_profile?.organization_name || user?.provider_profile?.organization_name || user?.username}</span>.{' '}
                      <Link to="/dashboard/profil" className="text-cyan-600 hover:underline">
                        Uredite vaš profil
                      </Link>.{' '}
                      <button 
                        onClick={() => {
                          if (window.confirm('Ali ste prepričani, da se želite odjaviti?')) {
                            navigate('/');
                          }
                        }}
                        className="text-cyan-600 hover:underline"
                      >
                        Odjava?
                      </button>{' '}
                      <span className="text-red-500">*</span> označuje zahtevana polja
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700">
                      Za oddajo ocene se morate{' '}
                      <Link to="/prijava" className="text-cyan-600 hover:underline font-semibold">
                        prijaviti
                      </Link>.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmitReview}>
                  {/* Rating Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                    {/* Quality Rating */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-gray-700">Ocena kakovosti</label>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingClick('quality', rating)}
                            className="focus:outline-none transition-transform hover:scale-110"
                            disabled={!isAuthenticated}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewRatings.quality
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expertise Rating */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-gray-700">Strokovnost</label>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingClick('expertise', rating)}
                            className="focus:outline-none transition-transform hover:scale-110"
                            disabled={!isAuthenticated}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewRatings.expertise
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Value Rating */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <label className="text-sm font-medium text-gray-700">Cenovna vrednost</label>
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingClick('value', rating)}
                            className="focus:outline-none transition-transform hover:scale-110"
                            disabled={!isAuthenticated}
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= reviewRatings.value
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-6">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors"
                      disabled={!isAuthenticated}
                    >
                      <Camera className="w-5 h-5" />
                      <span>Dodaj fotografije</span>
                    </button>
                  </div>

                  {/* Comment */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Komentar <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                      placeholder="Opišite svoje izkušnje z delavnico..."
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 text-white rounded-lg font-semibold"
                    disabled={!isAuthenticated || submitReviewMutation.isPending}
                  >
                    {submitReviewMutation.isPending ? 'Oddajanje...' : 'Oddaj oceno'}
                  </Button>
                </form>
              </div>
              )}

              {/* Existing Reviews */}
              {reviewSummary && reviewSummary.total_reviews > 0 ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Reviews ({reviewSummary.total_reviews})
                  </h3>

                  {/* Rating Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {reviewSummary.overall_average.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">od 5.0</div>
                        <div className="flex items-center justify-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.round(reviewSummary.overall_average)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Ocena kakovosti</span>
                            <span className="text-sm font-semibold">{reviewSummary.average_quality.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(reviewSummary.average_quality / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Strokovnost</span>
                            <span className="text-sm font-semibold">{reviewSummary.average_expertise.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(reviewSummary.average_expertise / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">Cenovna vrednost</span>
                            <span className="text-sm font-semibold">{reviewSummary.average_value.toFixed(1)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(reviewSummary.average_value / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
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
                                <p className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('sl-SI', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })} ob {new Date(review.created_at).toLocaleTimeString('sl-SI', {
                                    hour: '2-digit',
                                    minute: '2-digit',
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
                            
                            <ReviewHelpfulButton
                              reviewId={review.id}
                              initialCount={review.helpful_count}
                              isAuthenticated={isAuthenticated}
                            />

                            {/* Provider Reply */}
                            {review.reply && (
                              <div className="bg-gray-50 p-4 rounded-lg mt-4 ml-8">
                                <p className="text-sm font-semibold text-gray-900 mb-2">
                                  Odgovor ponudnika - {review.reply.provider_name}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">
                                  {review.reply.content}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(review.reply.created_at).toLocaleDateString('sl-SI', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                  })} ob {new Date(review.reply.created_at).toLocaleTimeString('sl-SI', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Še ni ocen za to delavnico.</p>
                  <p className="text-gray-400 mt-2">Bodite prvi, ki bo ocenil to delavnico!</p>
                </div>
              )}
            </div>
          )}

          {/* Podobni oglasi Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Podobni oglasi</h2>
            {/* This section can be populated with similar workshops later */}
            <div className="text-gray-500 text-center py-8">
              Prihajajoče...
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            {/* Booking Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking
              </h3>
              
              {workshop.kind === 'SERVICE' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Datum
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Čas
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storitve
                      <span className="ml-1 px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full text-xs">
                        {services.length}
                      </span>
                    </label>
                    <select 
                      value={selectedServiceId || ''}
                      onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Izberite storitev</option>
                      {services.map((service, index) => (
                        <option key={index} value={service.id}>
                          {service.title} - {service.price_eur}€
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Število udeležencev
                    </label>
                    <input
                      type="number"
                      value={participantsCount}
                      onChange={(e) => setParticipantsCount(Number(e.target.value))}
                      min="1"
                      max={services.find(s => s.id === selectedServiceId)?.capacity || 100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              ) : workshop.event_date_start ? (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Datum dogodka:</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(workshop.event_date_start).toLocaleDateString('sl-SI', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ) : null}
              
              <Button
                variant="primary"
                fullWidth
                className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3"
                onClick={handleBooking}
              >
                Zahtevajte rezervacijo
              </Button>
            </div>

            {/* Provider Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Izvajalec</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  {workshop.provider_profile_picture ? (
                    <img 
                      src={workshop.provider_profile_picture} 
                      alt={workshop.provider_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      {workshop.provider_name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{workshop.provider_name}</h4>
                </div>
              </div>
              
              <Button
                variant="outline"
                fullWidth
                className="flex items-center justify-center gap-2"
                onClick={() => {
                  if (!isAuthenticated) {
                    alert('Za pošiljanje sporočil se morate prijaviti.');
                    return;
                  }
                  setIsMessageModalOpen(true);
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Pošlji sporočilo
              </Button>
            </div>

            {/* Bookmark Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
              <button
                onClick={handleBookmarkToggle}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-lg hover:border-red-500 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isBookmarked
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
                <span className="font-medium text-gray-700">
                  {isBookmarked ? 'Shranjeno' : 'Shrani delavnico'}
                </span>
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-3">
                {workshop.bookmarks_count || 0} {workshop.bookmarks_count === 1 ? 'oseba' : 'oseb'} si je shranila delavnico
              </p>
            </div>

            {/* Share Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-md bg-white">
              <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 rounded-lg hover:border-cyan-500 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-700">Deli</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {workshop && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          recipientId={workshop.provider_user_id || 0}
          recipientName={workshop.provider_name || 'Unknown'}
          workshopId={workshop.id}
          workshopTitle={workshop.title}
        />
      )}
    </div>
  );
};

export default WorkshopDetail;

