import { ThumbsUp } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { markReviewHelpful, checkReviewHelpful } from '../../api/reviews';

interface ReviewHelpfulButtonProps {
  reviewId: number;
  initialCount: number;
  isAuthenticated: boolean;
  onLoginRequired?: () => void;
}

const ReviewHelpfulButton = ({
  reviewId,
  initialCount,
  isAuthenticated,
  onLoginRequired,
}: ReviewHelpfulButtonProps) => {
  const queryClient = useQueryClient();

  // Check if user marked this review as helpful
  const { data: helpfulStatus } = useQuery({
    queryKey: ['reviewHelpful', reviewId],
    queryFn: () => checkReviewHelpful(reviewId),
    enabled: isAuthenticated,
  });

  const isMarkedHelpful = helpfulStatus?.marked_helpful || false;
  const helpfulCount = helpfulStatus?.helpful_count ?? initialCount;

  // Toggle helpful mutation
  const toggleHelpfulMutation = useMutation({
    mutationFn: () => markReviewHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewHelpful', reviewId] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      if (onLoginRequired) {
        onLoginRequired();
      } else {
        alert('Za označevanje koristnih ocen se morate prijaviti.');
      }
      return;
    }
    toggleHelpfulMutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={toggleHelpfulMutation.isPending}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 transform hover:scale-105
        ${
          isMarkedHelpful
            ? 'bg-cyan-500 text-white shadow-md hover:bg-cyan-600'
            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-cyan-500 hover:text-cyan-600'
        }
        ${toggleHelpfulMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={isMarkedHelpful ? 'Odstranite oznako koristno' : 'Označite kot koristno'}
    >
      <ThumbsUp
        className={`w-4 h-4 transition-transform ${
          isMarkedHelpful ? 'fill-current' : ''
        }`}
      />
      <span className="font-semibold">
        {isMarkedHelpful ? 'Koristno' : 'Ali je bilo to koristno?'}
      </span>
      {helpfulCount > 0 && (
        <span
          className={`
            ml-1 px-2 py-0.5 rounded-full text-xs font-bold
            ${
              isMarkedHelpful
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }
          `}
        >
          {helpfulCount}
        </span>
      )}
    </button>
  );
};

export default ReviewHelpfulButton;

