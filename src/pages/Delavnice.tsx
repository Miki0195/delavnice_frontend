import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import WorkshopCard from '../components/ui/WorkshopCard';
import AuthModal from '../components/auth/AuthModal';
import Button from '../components/ui/Button';
import { fetchWorkshops } from '../api/workshops';
import type { WorkshopFilters, SortOption, ViewMode } from '../types';
import { REGIONS, SORT_OPTIONS } from '../types';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const Delavnice = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<WorkshopFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch workshops with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['workshops', filters, currentPage],
    queryFn: () => fetchWorkshops({ ...filters, page: currentPage }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      q: searchQuery || undefined,
      region: selectedRegion || undefined,
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  const handleLoadMore = () => {
    if (data?.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const workshops = data?.results || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Map Section with Search Overlay */}
      <div className="relative h-[500px] w-full">
        {/* Leaflet Map */}
        <MapContainer
          center={[46.0569, 14.5058]} // Ljubljana coordinates
          zoom={8}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Workshop Markers */}
          {workshops.map((workshop) => {
            if (workshop.latitude && workshop.longitude) {
              return (
                <Marker
                  key={workshop.id}
                  position={[parseFloat(workshop.latitude), parseFloat(workshop.longitude)]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-sm mb-1">{workshop.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{workshop.provider_name}</p>
                      <button
                        onClick={() => navigate(`/delavnice/${workshop.id}`)}
                        className="text-primary hover:text-primary/80 text-xs font-medium"
                      >
                        Več informacij →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>

        {/* Search Overlay */}
        <div className="absolute top-0 left-0 right-0 z-[1000] pt-8 pb-4 px-4 bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
          <div className="container mx-auto max-w-4xl pointer-events-auto">
            <form onSubmit={handleSearch} className="bg-white rounded-full shadow-2xl p-2 flex flex-col md:flex-row gap-2">
              {/* Keyword Input */}
              <div className="flex-1 flex items-center px-4">
                <input
                  type="text"
                  placeholder="Ključne besede"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-300 my-2" />

              {/* Region Dropdown */}
              <div className="flex-1 flex items-center px-4">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full py-3 text-gray-900 focus:outline-none bg-transparent cursor-pointer appearance-none"
                >
                  <option value="">Regije</option>
                  {REGIONS.map((region) => (
                    <option key={region.code} value={region.code}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Iskanje</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="container mx-auto px-4 py-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Razvrsti po:
            </label>
            <select
              id="sort"
              value={filters.sort || ''}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Najboljša ocena</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Nalaganje delavnic...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Napaka pri nalaganju delavnic. Poskusite ponovno.</p>
          </div>
        )}

        {/* Workshops Grid */}
        {!isLoading && !error && workshops.length > 0 && (
          <>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {workshops.map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  viewMode={viewMode}
                  onLoginRequired={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {data?.next && (
              <div className="text-center mt-12">
                <Button onClick={handleLoadMore} size="lg">
                  Naloži več
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && workshops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Ni najdenih delavnic.</p>
            <p className="text-gray-500 mt-2">Poskusite spremeniti filtre ali iskalni pojem.</p>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Delavnice;

