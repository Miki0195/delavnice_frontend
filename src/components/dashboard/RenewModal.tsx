import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../ui/Button';
import { renewWorkshop } from '../../api/workshops';

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: number;
  workshopTitle: string;
}

const RenewModal = ({ isOpen, onClose, workshopId, workshopTitle }: RenewModalProps) => {
  const queryClient = useQueryClient();
  const [newEndDate, setNewEndDate] = useState('');
  const [error, setError] = useState('');

  const renewMutation = useMutation({
    mutationFn: (eventDateEnd: string) => renewWorkshop(workshopId, eventDateEnd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-workshops'] });
      queryClient.invalidateQueries({ queryKey: ['workshop-counts'] });
      alert('Podaljšanje uspešno oddano! Vaša delavnica čaka na odobritev administratorja.');
      onClose();
      setNewEndDate('');
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Napaka pri podaljševanju delavnice.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEndDate) {
      setError('Prosim izberite nov končni datum.');
      return;
    }

    const selectedDate = new Date(newEndDate);
    const now = new Date();
    
    if (selectedDate <= now) {
      setError('Nov končni datum mora biti v prihodnosti.');
      return;
    }

    renewMutation.mutate(newEndDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Podaljšaj dogodek</h2>
          <p className="text-gray-600 mb-6">{workshopTitle}</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-end-date" className="block text-sm font-medium text-gray-700 mb-2">
                Nov končni datum in čas
              </label>
              <input
                type="datetime-local"
                id="new-end-date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Opomba:</strong> Po oddaji bo vaša delavnica poslana v ponovno odobritev administratorju in ne bo vidna javnosti do odobritve.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Prekliči
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={renewMutation.isPending}
              >
                {renewMutation.isPending ? 'Podaljševanje...' : 'Podaljšaj'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RenewModal;

