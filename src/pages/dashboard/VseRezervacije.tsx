import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Euro, User, Mail, Phone, Home, BookOpen, MessageSquare, Check, X as XIcon } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import apiClient from '../../api/client';
import { getProviderReservations } from '../../api/reservations';
import { startConversation } from '../../api/messages';

interface Reservation {
  id: number;
  workshop_id: number;
  workshop_title: string;
  workshop_location?: string;
  service_id?: number;
  service_title?: string;
  service_duration_minutes?: number;
  service_price?: number;
  date: string;
  time?: string;
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
  total_price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  provider_name?: string;
  user_email?: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'V obravnavi', color: 'bg-blue-100 text-blue-800' },
  APPROVED: { label: 'Odobreno', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Zavrnjeno', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Dokončano', color: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: 'Preklicano', color: 'bg-gray-100 text-gray-800' },
};

const MessageModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  recipientEmail: string;
  workshopId: number;
  workshopTitle: string;
}> = ({ isOpen, onClose, recipientEmail, workshopId, workshopTitle }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      // Note: We'll need the recipient user ID, not email
      // For now, we'll show an alert. You may need to pass recipient_id from the reservation
      alert('Funkcionalnost pošiljanja sporočil je v razvoju. Uporabite "Sporočila" meni za komunikacijo.');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Napaka pri pošiljanju sporočila. Poskusite ponovno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pošlji sporočilo</h2>
            <p className="text-gray-600 mt-1">
              Za {recipientEmail} - {workshopTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sporočilo
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Napišite sporočilo uporabniku..."
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Prekliči
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Pošiljam...' : 'Pošlji'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VseRezervacije: React.FC = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'PENDING';
  const queryClient = useQueryClient();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const { data: allReservations, isLoading } = useQuery({
    queryKey: ['provider-reservations'],
    queryFn: getProviderReservations,
  });

  // Filter reservations by status
  const filteredReservations = (allReservations || []).filter(
    (r) => r.status === statusFilter
  );

  const approveMutation = useMutation({
    mutationFn: async (reservationId: number) => {
      await apiClient.patch(`/reservations/${reservationId}/approve/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-reservations'] });
      alert('Rezervacija je bila odobrena.');
    },
    onError: () => {
      alert('Napaka pri odobritvi rezervacije. Poskusite ponovno.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reservationId: number) => {
      await apiClient.patch(`/reservations/${reservationId}/reject/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-reservations'] });
      alert('Rezervacija je bila zavrnjena.');
    },
    onError: () => {
      alert('Napaka pri zavrnitvi rezervacije. Poskusite ponovno.');
    },
  });

  const handleApprove = (reservationId: number) => {
    if (window.confirm('Ali ste prepričani, da želite odobriti to rezervacijo?')) {
      approveMutation.mutate(reservationId);
    }
  };

  const handleReject = (reservationId: number) => {
    if (window.confirm('Ali ste prepričani, da želite zavrniti to rezervacijo?')) {
      rejectMutation.mutate(reservationId);
    }
  };

  const handleSendMessage = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setMessageModalOpen(true);
  };

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    
    if (timeString) {
      return `${datePart} ob ${timeString}`;
    }
    
    return datePart;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} ura${hours > 1 ? 'i' : ''} ${mins} minut`;
    } else if (hours > 0) {
      return `${hours} šolsk${hours === 1 ? 'a ura' : 'i uri'}`;
    } else {
      return `${mins} minut`;
    }
  };

  const getStatusTitle = () => {
    switch (statusFilter) {
      case 'PENDING':
        return 'V obravnavi';
      case 'APPROVED':
        return 'Odobreno';
      case 'CANCELLED':
      case 'REJECTED':
        return 'Preklicano';
      default:
        return 'Vse rezervacije';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Nalaganje rezervacij...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (filteredReservations.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{getStatusTitle()}</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ni rezervacij
            </h3>
            <p className="text-gray-600">
              V tej kategoriji trenutno ni nobenih rezervacij.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{getStatusTitle()}</h1>

        <div className="space-y-6">
          {filteredReservations.map((reservation) => {
            const statusInfo = STATUS_LABELS[reservation.status] || STATUS_LABELS.PENDING;

            return (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {reservation.workshop_title}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Datum rezervacije:</p>
                        <p className="font-semibold text-gray-900">
                          {formatDateTime(reservation.date, reservation.time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Podrobnosti rezervacije:</p>
                        <p className="font-semibold text-gray-900">
                          {reservation.participants_count} {reservation.participants_count === 1 ? 'udeleženec' : 'udeleženci'}
                        </p>
                      </div>
                    </div>

                    {reservation.workshop_location && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600">Lokacija:</p>
                          <p className="font-semibold text-gray-900">{reservation.workshop_location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <Euro className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Cena:</p>
                        <p className="font-semibold text-gray-900">
                          {typeof reservation.total_price === 'number' 
                            ? reservation.total_price.toFixed(2) 
                            : parseFloat(reservation.total_price || '0').toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Kontaktni podatki:</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{reservation.first_name} {reservation.last_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{reservation.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{reservation.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    {(reservation.street || reservation.postal_code || reservation.country) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Naslov:</h3>
                        <div className="flex items-start gap-2 text-gray-700">
                          <Home className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            {reservation.street && <p>{reservation.street}</p>}
                            {reservation.postal_code && (
                              <p>
                                {reservation.postal_code} {reservation.region}
                              </p>
                            )}
                            {reservation.country && <p className="capitalize">{reservation.country}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Details */}
                    {reservation.service_title && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Storitev:</h3>
                        <div className="text-gray-700">
                          <p>
                            {reservation.service_title}
                            {reservation.service_duration_minutes && (
                              <>, {formatDuration(reservation.service_duration_minutes)}</>
                            )}
                            {reservation.service_price && (
                              <>, {typeof reservation.service_price === 'number' 
                                ? reservation.service_price.toFixed(2) 
                                : parseFloat(reservation.service_price || '0').toFixed(2)} €</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* School Details */}
                    {(reservation.class_name || reservation.student_count) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Šolski podatki:</h3>
                        <div className="space-y-2">
                          {reservation.class_name && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                              <span>Razred: {reservation.class_name}</span>
                            </div>
                          )}
                          {reservation.student_count && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="w-4 h-4 text-gray-400" />
                              <span>Število učencev: {reservation.student_count}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    {reservation.message_from_school && (
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-3">Sporočilo:</h3>
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                          <p className="text-gray-700">{reservation.message_from_school}</p>
                        </div>
                      </div>
                    )}

                    {/* Reservation Sent */}
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">
                        Rezervacija poslana:{' '}
                        <span className="font-semibold text-cyan-600">
                          {formatDateTime(reservation.created_at, new Date(reservation.created_at).toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' }))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-200 bg-white">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleSendMessage(reservation)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Pošlji sporočilo
                    </button>

                    {reservation.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReject(reservation.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XIcon className="w-4 h-4" />
                          Zavrni
                        </button>
                        <button
                          onClick={() => handleApprove(reservation.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Odobri
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Modal */}
        {selectedReservation && (
          <MessageModal
            isOpen={messageModalOpen}
            onClose={() => {
              setMessageModalOpen(false);
              setSelectedReservation(null);
            }}
            recipientEmail={selectedReservation.email}
            workshopId={selectedReservation.workshop_id}
            workshopTitle={selectedReservation.workshop_title}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default VseRezervacije;
