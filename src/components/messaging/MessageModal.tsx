import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startConversation } from '../../api/messages';
import Button from '../ui/Button';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: number;
  recipientName: string;
  workshopId?: number;
  workshopTitle?: string;
}

const MessageModal = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  workshopId,
  workshopTitle,
}: MessageModalProps) => {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      startConversation({
        recipient_id: recipientId,
        workshop_id: workshopId,
        message: content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessage('');
      onClose();
      // Optionally redirect to messages page
      // navigate('/dashboard/sporocila');
    },
    onError: (error: any) => {
      console.error('Message send error:', error.response?.data);
      const errorMsg = error.response?.data?.detail 
        || JSON.stringify(error.response?.data) 
        || 'Napaka pri pošiljanju sporočila';
      alert(errorMsg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMutation.mutate(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Pošlji sporočilo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {workshopTitle && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">O delavnici:</p>
              <p className="font-medium text-gray-900">{workshopTitle}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Prejemnik:</p>
            <p className="font-medium text-gray-900">{recipientName}</p>
          </div>

          <div className="mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message to"
              rows={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={sendMutation.isPending || !message.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
          >
            {sendMutation.isPending ? 'Pošiljanje...' : 'Pošlji sporočilo'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;

