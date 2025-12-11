import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';
import { getWorkshopById } from '../api/workshops';
import { createReservation, type ReservationData } from '../api/reservations';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Get pre-selected data from navigation state
  const selectedService = location.state?.selectedService;
  const selectedDate = location.state?.selectedDate;
  const selectedTime = location.state?.selectedTime;
  const participantsCount = location.state?.participantsCount || 1;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: user?.email || '',
    phone: '',
    street: '',
    postal_code: '',
    country: '',
    region: '',
    class_name: '',
    student_count: participantsCount,
    message: '',
  });

  // Fetch workshop data
  const { data: workshop, isLoading } = useQuery({
    queryKey: ['workshop', id],
    queryFn: () => getWorkshopById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Za rezervacijo se morate prijaviti.');
      navigate(`/workshop/${id}`);
    }
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Prosimo, izberite storitev, datum in čas.');
      navigate(`/workshop/${id}`);
    }
  }, [isAuthenticated, selectedService, selectedDate, selectedTime, id, navigate]);

  // Create reservation mutation
  const reservationMutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      alert('Rezervacija uspešno oddana!');
      navigate('/dashboard/rezervacije');
    },
    onError: (error: any) => {
      console.error('Reservation error:', error);
      console.error('Error response:', error.response?.data);
      
      // Display detailed validation errors
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Napaka pri oddaji rezervacije:\n\n';
        
        // If it's a field validation error, show all field errors
        if (typeof errorData === 'object' && !errorData.detail) {
          Object.keys(errorData).forEach(field => {
            const fieldErrors = Array.isArray(errorData[field]) ? errorData[field] : [errorData[field]];
            errorMessage += `${field}: ${fieldErrors.join(', ')}\n`;
          });
        } else {
          errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
        }
        
        alert(errorMessage);
      } else {
        alert('Napaka pri oddaji rezervacije.');
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      alert('Prosimo, izpolnite vsa obvezna polja.');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Prosimo, izberite storitev, datum in čas.');
      return;
    }

    // Format date to YYYY-MM-DD
    let formattedDate = selectedDate;
    if (selectedDate instanceof Date) {
      // If it's a Date object
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    } else if (typeof selectedDate === 'string') {
      // If it's a string (like ISO format), extract just the date part
      if (selectedDate.includes('T')) {
        // ISO format: "2025-11-24T10:00:00Z" -> "2025-11-24"
        formattedDate = selectedDate.split('T')[0];
      } else if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Already in YYYY-MM-DD format
        formattedDate = selectedDate;
      } else {
        // Try to parse and format
        const dateObj = new Date(selectedDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }
    }

    const reservationData: ReservationData = {
      workshop_id: Number(id),
      service_id: selectedService.id ? Number(selectedService.id) : undefined,
      date: formattedDate,
      time: selectedTime || undefined,
      participants_count: Number(formData.student_count) || participantsCount,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      street: formData.street || undefined,
      postal_code: formData.postal_code || undefined,
      country: formData.country || undefined,
      region: formData.region || undefined,
      class_name: formData.class_name || undefined,
      student_count: formData.student_count ? Number(formData.student_count) : undefined,
      message_from_school: formData.message || undefined,
    };

    console.log('Sending reservation data:', reservationData);
    console.log('Selected service:', selectedService);
    reservationMutation.mutate(reservationData);
  };

  if (isLoading || !workshop || !selectedService) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Nalaganje...</div>
      </div>
    );
  }

  const totalCost = selectedService.price_eur * (formData.student_count || participantsCount);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/workshop/${id}`)}
            className="text-cyan-600 hover:text-cyan-700 mb-4"
          >
            ← Nazaj na delavnico
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Rezervacija</h1>
          <p className="text-gray-600 mt-2">{workshop.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ime
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priimek
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonska številka <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ulica
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poštna številka
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kraj
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Država
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="">Izberi državo / regijo...</option>
                      <option value="slovenia">Slovenija</option>
                      <option value="croatia">Hrvaška</option>
                      <option value="austria">Avstrija</option>
                      <option value="italy">Italija</option>
                    </select>
                  </div>

                  {/* Class Name (for schools) */}
                  {user?.role === 'SCHOOL' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Razred
                      </label>
                      <input
                        type="text"
                        name="class_name"
                        value={formData.class_name}
                        onChange={handleInputChange}
                        placeholder="Razred"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                  )}

                  {/* Number of Students */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Število učencev
                    </label>
                    <input
                      type="number"
                      name="student_count"
                      value={formData.student_count}
                      onChange={handleInputChange}
                      min="1"
                      max={selectedService.capacity || 100}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    {selectedService.capacity && (
                      <p className="text-xs text-gray-500 mt-1">
                        Maksimalno: {selectedService.capacity} oseb
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sporočilo
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Vaše sporočilo izvajalcu delavnice (neobvezno)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold w-full md:w-auto"
                    disabled={reservationMutation.isPending}
                  >
                    {reservationMutation.isPending ? 'Oddajanje...' : 'Potrdi'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">Povzetek rezervacije</h3>
              </div>

              {/* Workshop Image */}
              {workshop.image && (
                <div className="mb-4">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {workshop.average_rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
              )}

              {/* Workshop Info */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">{workshop.title}</h4>
              </div>

              {/* Reservation Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Datum</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('sl-SI')}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Čas</span>
                  <span className="font-semibold text-gray-900">{selectedTime}</span>
                </div>
              </div>

              {/* Additional Services */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">Dodatne storitve</h4>
                <div className="flex justify-between items-start text-sm mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedService.name}</p>
                    <p className="text-xs text-gray-500">
                      {formData.student_count || participantsCount} {formData.student_count === 1 ? 'oseba' : 'oseb'}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {(parseFloat(selectedService.price_eur) * (formData.student_count || participantsCount)).toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Total Cost */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Cost</span>
                  <span className="text-2xl font-bold text-cyan-500">
                    {totalCost.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

