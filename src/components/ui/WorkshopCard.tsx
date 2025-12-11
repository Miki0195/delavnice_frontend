import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Circle, MapPin } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import type { Workshop } from '../../types';
import { toggleBookmark, checkBookmark } from '../../api/bookmarks';

interface WorkshopCardProps {
  workshop: Workshop;
  viewMode: 'grid' | 'list';
  onLoginRequired?: () => void;
}

const WorkshopCard = ({ workshop, viewMode, onLoginRequired }: WorkshopCardProps) => {
  const { id, title, price_min, price_max, average_rating, image_url } = workshop;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if workshop is bookmarked (only if authenticated)
  const { data: bookmarkStatus } = useQuery({
    queryKey: ['bookmark-status', id],
    queryFn: () => checkBookmark(id),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (bookmarkStatus) {
      setIsBookmarked(bookmarkStatus.bookmarked);
    }
  }, [bookmarkStatus]);

  // Toggle bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(id),
    onSuccess: (data) => {
      setIsBookmarked(data.bookmarked);
      queryClient.invalidateQueries({ queryKey: ['bookmark-status', id] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error: any) => {
      alert(`Napaka: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Show login modal if provided
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        alert('Za shranjevanje delavnic se morate prijaviti.');
      }
      return;
    }

    bookmarkMutation.mutate();
  };

  const formatPriceRange = () => {
    if (price_min === null && price_max === null) return 'Cena na poizvedbo';
    if (price_min === price_max) return `${price_min?.toFixed(2)} €`;
    return `${price_min?.toFixed(2)} € - ${price_max?.toFixed(2)} €`;
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
        <Link to={`/workshop/${id}`} className="block relative">
          {/* Image */}
          <div className="relative h-48 bg-gray-200">
            {image_url ? (
              <img
                src={image_url}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            )}
            
            {/* Price Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-medium text-gray-700">
              <Circle className="w-4 h-4 text-secondary fill-secondary" />
              <span>{formatPriceRange()}</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleBookmarkClick}
              disabled={bookmarkMutation.isPending}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors disabled:opacity-50"
              title={isBookmarked ? 'Odstrani iz zaznamkov' : 'Dodaj med zaznamke'}
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isBookmarked
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{workshop.address || workshop.region_display}</span>
            </div>

            {/* Rating */}
            {average_rating > 0 && (
              <div className="flex items-center space-x-2">
                <div className="bg-secondary text-white text-sm font-bold px-2 py-1 rounded">
                  {average_rating.toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="flex flex-col md:flex-row relative">
        {/* Favorite Button - positioned absolutely for list view */}
        <button
          onClick={handleBookmarkClick}
          disabled={bookmarkMutation.isPending}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors disabled:opacity-50 z-10"
          title={isBookmarked ? 'Odstrani iz zaznamkov' : 'Dodaj med zaznamke'}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isBookmarked
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>

        <Link to={`/workshop/${id}`} className="flex flex-col md:flex-row w-full">
          {/* Image */}
          <div className="relative w-full md:w-80 h-48 md:h-auto bg-gray-200 flex-shrink-0">
            {image_url ? (
              <img
                src={image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4" />
                <span>{workshop.address || workshop.region_display}</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {workshop.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cena: <span className="font-semibold text-gray-900">{formatPriceRange()}</span></p>
                {average_rating > 0 && (
                  <p className="text-sm text-gray-500">
                    Ocena: <span className="font-semibold text-gray-900">{average_rating.toFixed(1)}</span>
                  </p>
                )}
              </div>

              <button className="btn-secondary whitespace-nowrap">
                Naroči zdaj
              </button>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WorkshopCard;
