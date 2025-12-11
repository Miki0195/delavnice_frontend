import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Eye, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { getPendingWorkshops, approveWorkshop, denyWorkshop, type Workshop } from '../../api/workshops';

const AdminDashboard = () => {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [denyReason, setDenyReason] = useState('');
  const [showDenyModal, setShowDenyModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Return null while redirecting
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // Fetch pending workshops
  const { data: workshopsData, isLoading } = useQuery({
    queryKey: ['pending-workshops'],
    queryFn: getPendingWorkshops,
  });

  const workshops = workshopsData?.workshops || [];

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveWorkshop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workshops'] });
      alert('Workshop approved successfully!');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    },
  });

  // Deny mutation
  const denyMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => denyWorkshop(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workshops'] });
      setShowDenyModal(false);
      setDenyReason('');
      setSelectedWorkshop(null);
      alert('Workshop denied.');
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleApprove = (workshop: Workshop) => {
    if (confirm(`Are you sure you want to approve "${workshop.title}"?`)) {
      approveMutation.mutate(workshop.id);
    }
  };

  const handleDenyClick = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowDenyModal(true);
  };

  const handleDenyConfirm = () => {
    if (selectedWorkshop) {
      denyMutation.mutate({ id: selectedWorkshop.id, reason: denyReason });
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Manage pending workshop approvals</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Welcome, {user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pending Approvals ({workshops.length})
          </h2>
          <p className="text-gray-600">
            Review and approve/deny workshops submitted by providers and schools
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : workshops.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No workshops pending approval</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workshops.map((workshop) => {
              const minPrice = getMinPrice(workshop);
              const maxPrice = getMaxPrice(workshop);

              return (
                <div
                  key={workshop.id}
                  className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500"
                >
                  <div className="flex gap-6">
                    {/* Workshop Image */}
                    <div className="flex-shrink-0">
                      {workshop.image ? (
                        <img
                          src={workshop.image}
                          alt={workshop.title}
                          className="w-48 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Workshop Info */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
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
                        {workshop.subtitle && (
                          <p className="text-sm text-gray-600 mb-2">{workshop.subtitle}</p>
                        )}
                        <p className="text-sm text-gray-700 mb-3">
                          {workshop.description.substring(0, 200)}...
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Provider:</span>
                          <p className="font-medium">{workshop.provider_name}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{workshop.category_display}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium">{workshop.kind === 'SERVICE' ? 'Storitev' : 'Dogodek'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p className="font-medium">{formatDate(workshop.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{workshop.region_display}</span>
                        </div>
                        {workshop.kind === 'EVENT' && workshop.event_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(workshop.event_date)}</span>
                          </div>
                        )}
                        {minPrice !== null && maxPrice !== null && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-bold text-gray-900">
                              €{minPrice} - €{maxPrice}
                            </span>
                          </div>
                        )}
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
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(workshop)}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDenyClick(workshop)}
                        disabled={denyMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Deny Modal */}
      {showDenyModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Deny Workshop: {selectedWorkshop.title}
            </h3>
            <div className="mb-4">
              <label htmlFor="deny-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for denial (optional):
              </label>
              <textarea
                id="deny-reason"
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Provide a reason for denying this workshop..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDenyModal(false);
                  setDenyReason('');
                  setSelectedWorkshop(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDenyConfirm}
                disabled={denyMutation.isPending}
              >
                {denyMutation.isPending ? 'Denying...' : 'Confirm Deny'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

