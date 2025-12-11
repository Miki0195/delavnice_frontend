import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { MapPin, BarChart3, Heart, MessageSquare, Trash2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardStats, getActivities, deleteActivity, deleteAllActivities } from '../../api/dashboard';
import { useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  // Fetch activities with pagination
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities', currentPage],
    queryFn: () => getActivities(currentPage),
  });

  // Delete single activity mutation
  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });

  // Delete all activities mutation
  const deleteAllMutation = useMutation({
    mutationFn: deleteAllActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      setCurrentPage(1);
    },
  });

  const handleDeleteActivity = (activityId: number) => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati to aktivnost?')) {
      deleteActivityMutation.mutate(activityId);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati vse aktivnosti?')) {
      deleteAllMutation.mutate();
    }
  };

  // Determine which stats to show based on user role
  const statsCards = user?.role === 'PROVIDER'
    ? [
        {
          title: 'Aktivni oglasi',
          value: stats?.active_workshops ?? 0,
          icon: MapPin,
          color: 'bg-green-500',
        },
        {
          title: 'Število ogledov',
          value: stats?.total_views ?? 0,
          icon: BarChart3,
          color: 'bg-gray-800',
        },
        {
          title: 'Število ocen',
          value: stats?.total_ratings ?? 0,
          icon: MessageSquare,
          color: 'bg-yellow-500',
        },
        {
          title: 'Število zaznamkov',
          value: stats?.total_bookmarks ?? 0,
          icon: Heart,
          color: 'bg-red-500',
        },
      ]
    : [
        {
          title: 'Skupaj rezervacij',
          value: stats?.total_reservations ?? 0,
          icon: MapPin,
          color: 'bg-blue-500',
        },
        {
          title: 'Čakajoče',
          value: stats?.pending_reservations ?? 0,
          icon: MessageSquare,
          color: 'bg-yellow-500',
        },
        {
          title: 'Odobrene',
          value: stats?.approved_reservations ?? 0,
          icon: Heart,
          color: 'bg-green-500',
        },
        {
          title: 'Preklicane',
          value: stats?.cancelled_reservations ?? 0,
          icon: X,
          color: 'bg-red-500',
        },
      ];

  const totalPages = activitiesData ? Math.ceil(activitiesData.count / 5) : 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            <div className="col-span-4 text-center py-8 text-gray-500">
              Nalaganje statistike...
            </div>
          ) : (
            statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.color} rounded-lg p-6 text-white shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold mb-2">{stat.value}</p>
                      <p className="text-sm opacity-90">{stat.title}</p>
                    </div>
                    <Icon className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Nedavne aktivnosti</h2>
            <button
              onClick={handleDeleteAll}
              disabled={!activitiesData?.results?.length || deleteAllMutation.isPending}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Izbriši vse
            </button>
          </div>

          <div className="p-6">
            {activitiesLoading ? (
              <div className="text-center py-8 text-gray-500">
                Nalaganje aktivnosti...
              </div>
            ) : !activitiesData?.results?.length ? (
              <div className="text-center py-8 text-gray-500">
                Ni nedavnih aktivnosti.
              </div>
            ) : (
              <div className="space-y-4">
                {activitiesData.results.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleDateString('sl-SI', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      disabled={deleteActivityMutation.isPending}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Izbriši aktivnost"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prejšnja
                    </button>
                    <span className="text-sm text-gray-600">
                      Stran {currentPage} od {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Naslednja →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

