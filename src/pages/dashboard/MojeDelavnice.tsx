import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Calendar, MapPin, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/ui/Button';
import RenewModal from '../../components/dashboard/RenewModal';
import { getMyWorkshops, getMyWorkshopsCounts, deleteWorkshop, type Workshop } from '../../api/workshops';

type WorkshopStatus = 'active' | 'in_review' | 'expired';

const MojeDelavnice = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStatus, setSelectedStatus] = useState<WorkshopStatus>('active');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  // Read status from URL on mount
  useEffect(() => {
    const statusFromUrl = searchParams.get('status') as WorkshopStatus;
    if (statusFromUrl && ['active', 'in_review', 'expired'].includes(statusFromUrl)) {
      setSelectedStatus(statusFromUrl);
    }
  }, [searchParams]);

  // Fetch counts for all statuses
  const { data: counts } = useQuery({
    queryKey: ['workshop-counts'],
    queryFn: getMyWorkshopsCounts,
  });

  // Fetch workshops based on selected status
  const { data: workshopsData, isLoading } = useQuery({
    queryKey: ['my-workshops', selectedStatus],
    queryFn: () => getMyWorkshops(selectedStatus),
  });

  const workshops = workshopsData?.workshops || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-workshops'] });
      queryClient.invalidateQueries({ queryKey: ['workshop-counts'] });
      alert('Delavnica uspešno izbrisana!');
    },
    onError: (error: any) => {
      alert(`Napaka: ${error.response?.data?.detail || error.message}`);
    },
  });

  const statusLabels = {
    active: 'Aktivno',
    in_review: 'V obravnavi',
    expired: 'Poteklo',
  };

  const statusOptions = [
    { value: 'active' as WorkshopStatus, label: 'Aktivno', count: counts?.active || 0 },
    { value: 'in_review' as WorkshopStatus, label: 'V obravnavi', count: counts?.in_review || 0 },
    { value: 'expired' as WorkshopStatus, label: 'Poteklo', count: counts?.expired || 0 },
  ];

  const handleStatusChange = (status: WorkshopStatus) => {
    setSelectedStatus(status);
    setSearchParams({ status });
    setIsDropdownOpen(false);
  };

  const handleDelete = (workshop: Workshop) => {
    if (confirm(`Ali ste prepričani, da želite izbrisati delavnico "${workshop.title}"?`)) {
      deleteMutation.mutate(workshop.id);
    }
  };

  const handleEdit = (workshop: Workshop) => {
    // Navigate to the correct edit form based on workshop kind
    const editPath = workshop.kind === 'SERVICE' 
      ? `/dashboard/uredi-storitev/${workshop.id}`
      : `/dashboard/uredi-dogodek/${workshop.id}`;
    navigate(editPath);
  };

  const handleRenew = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setRenewModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nikoli/ni določeno';
    const date = new Date(dateString);
    return date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getMinPrice = (workshop: Workshop) => {
    if (!workshop.services || workshop.services.length === 0) return null;
    const prices = workshop.services
      .filter(s => !s.is_free)
      .map(s => parseFloat(s.price_eur));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getMaxPrice = (workshop: Workshop) => {
    if (!workshop.services || workshop.services.length === 0) return null;
    const prices = workshop.services
      .filter(s => !s.is_free)
      .map(s => parseFloat(s.price_eur));
    return prices.length > 0 ? Math.max(...prices) : 0;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-primary transition-colors"
                >
                  Domov
                </button>
                <span className="mx-2">›</span>
                <span className="text-gray-900">Nadzorna plošča</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Moje delavnice</h1>
            </div>

            <Button onClick={() => navigate('/dashboard/dodaj-delavnico')}>
              Dodaj novo delavnico
            </Button>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="mb-6">
          <div className="relative inline-block">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {statusLabels[selectedStatus]}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                  selectedStatus === 'active' ? 'bg-green-500' :
                  selectedStatus === 'in_review' ? 'bg-gray-500' :
                  'bg-red-500'
                }`}>
                  {counts?.[selectedStatus] || 0}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedStatus === option.value ? 'bg-gray-50' : ''
                    }`}
                  >
                    <span className="font-medium text-gray-900">{option.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      option.value === 'active' ? 'bg-green-500' :
                      option.value === 'in_review' ? 'bg-gray-500' :
                      'bg-red-500'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Išči oglas"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Workshops List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nalaganje...</p>
          </div>
        ) : workshops.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              {selectedStatus === 'active' && 'Tukaj nimate nobenih seznamov.'}
              {selectedStatus === 'in_review' && 'Nimate delavnic v obravnavi.'}
              {selectedStatus === 'expired' && 'Nimate poteklih delavnic.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ACTIVE WORKSHOPS */}
            {selectedStatus === 'active' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Aktivni oglasi</h2>
                <div className="space-y-4">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Workshop Image */}
                      <div className="flex-shrink-0">
                        {workshop.image ? (
                          <img
                            src={workshop.image}
                            alt={workshop.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Ni slike</span>
                          </div>
                        )}
                      </div>

                      {/* Workshop Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {workshop.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{workshop.region_display}</span>
                          </div>
                          {workshop.kind === 'EVENT' && workshop.event_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Poteče: {formatDate(workshop.event_date_end || workshop.event_date)}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Poteče: {workshop.kind === 'SERVICE' ? 'Nikoli/ni določeno' : formatDate(workshop.event_date_end || workshop.event_date)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/workshop/${workshop.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          iCal
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(workshop)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Uredi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                          onClick={() => handleDelete(workshop)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Zbriši
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* IN REVIEW WORKSHOPS */}
            {selectedStatus === 'in_review' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delavnice v obravnavi</h2>
                <div className="space-y-4">
                  {workshops.map((workshop) => {
                    const minPrice = getMinPrice(workshop);
                    const maxPrice = getMaxPrice(workshop);

                    return (
                      <div
                        key={workshop.id}
                        className="border border-yellow-300 bg-yellow-50 rounded-lg p-4 flex gap-4"
                      >
                        {/* Workshop Image */}
                        <div className="flex-shrink-0">
                          {workshop.image ? (
                            <img
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">Ni slike</span>
                            </div>
                          )}
                        </div>

                        {/* Workshop Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {workshop.title}
                            </h3>
                            {workshop.is_edited && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                UREJENO
                              </span>
                            )}
                            {workshop.is_renewal && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                PODALJŠANO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {workshop.description.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{workshop.region_display}</span>
                            </div>
                            {minPrice !== null && maxPrice !== null && (
                              <span className="font-bold text-gray-900">
                                €{minPrice} - €{maxPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(workshop)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Uredi
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                            onClick={() => handleDelete(workshop)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Zbriši
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXPIRED WORKSHOPS */}
            {selectedStatus === 'expired' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Potekle delavnice</h2>
                <div className="space-y-4">
                  {workshops.map((workshop) => {
                    const minPrice = getMinPrice(workshop);
                    const maxPrice = getMaxPrice(workshop);

                    return (
                      <div
                        key={workshop.id}
                        className="border border-gray-300 bg-gray-50 rounded-lg p-4 flex gap-4"
                      >
                        {/* Workshop Image */}
                        <div className="flex-shrink-0">
                          {workshop.image ? (
                            <img
                              src={workshop.image}
                              alt={workshop.title}
                              className="w-32 h-32 object-cover rounded-lg opacity-75"
                            />
                          ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-sm">Ni slike</span>
                            </div>
                          )}
                        </div>

                        {/* Workshop Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-700 mb-2">
                            {workshop.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {workshop.description.substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{workshop.region_display}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Poteklo: {formatDate(workshop.event_date_end || workshop.event_date)}</span>
                            </div>
                            {minPrice !== null && maxPrice !== null && (
                              <span className="font-bold text-gray-700">
                                €{minPrice} - €{maxPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                            onClick={() => handleRenew(workshop)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Podaljšaj
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:border-red-600"
                            onClick={() => handleDelete(workshop)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Zbriši
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Renew Modal */}
      {selectedWorkshop && (
        <RenewModal
          isOpen={renewModalOpen}
          onClose={() => {
            setRenewModalOpen(false);
            setSelectedWorkshop(null);
          }}
          workshopId={selectedWorkshop.id}
          workshopTitle={selectedWorkshop.title}
        />
      )}
    </DashboardLayout>
  );
};

export default MojeDelavnice;
