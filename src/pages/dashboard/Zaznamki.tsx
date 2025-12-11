import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import Button from '../../components/ui/Button';
import { getBookmarks, deleteBookmark } from '../../api/bookmarks';

const Zaznamki = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch bookmarks
  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
  });

  // Delete bookmark mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error: any) => {
      alert(`Napaka: ${error.response?.data?.detail || error.message}`);
    },
  });

  const handleDelete = (bookmarkId: number, title: string) => {
    if (confirm(`Ali ste prepričani, da želite odstraniti "${title}" iz zaznamkov?`)) {
      deleteMutation.mutate(bookmarkId);
    }
  };

  // Ensure bookmarks is always an array
  const bookmarksList = Array.isArray(bookmarks) ? bookmarks : [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary transition-colors"
            >
              Domov
            </button>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Zaznamki</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Shranjene delavnice</h1>
          <p className="text-gray-600 mt-2">
            Tukaj lahko dostopate do delavnic, ki ste jih shranili.
          </p>
        </div>

        {/* Bookmarks List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nalaganje...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">
              Napaka pri nalaganju zaznamkov. Prosimo, poskusite znova.
            </p>
          </div>
        ) : !bookmarksList || bookmarksList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nimate shranjenih delavnic
            </h3>
            <p className="text-gray-600 mb-6">
              Ko boste našli delavnico, ki vas zanima, jo shranite s klikom na ikono srca.
            </p>
            <Button onClick={() => navigate('/')}>
              Poišči delavnice
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Shranjene delavnice ({bookmarksList.length})
            </h2>
            <div className="space-y-4">
              {bookmarksList.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="border border-gray-200 rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Workshop Image */}
                  <div className="flex-shrink-0">
                    {bookmark.workshop_image ? (
                      <img
                        src={bookmark.workshop_image}
                        alt={bookmark.workshop_title}
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer"
                        onClick={() => navigate(`/workshop/${bookmark.workshop}`)}
                      />
                    ) : (
                      <div
                        className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
                        onClick={() => navigate(`/workshop/${bookmark.workshop}`)}
                      >
                        <span className="text-gray-400 text-sm">Ni slike</span>
                      </div>
                    )}
                  </div>

                  {/* Workshop Info */}
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/workshop/${bookmark.workshop}`)}
                    >
                      {bookmark.workshop_title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{bookmark.workshop_address || bookmark.workshop_region}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Shranjeno:{' '}
                      {new Date(bookmark.created_at).toLocaleDateString('sl-SI', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/workshop/${bookmark.workshop}`)}
                    >
                      Poglej
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:border-red-600"
                      onClick={() => handleDelete(bookmark.id, bookmark.workshop_title)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Odstrani
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Zaznamki;
