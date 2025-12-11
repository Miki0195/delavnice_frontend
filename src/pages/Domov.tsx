import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, List } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FiltersSidebar from '../components/home/FiltersSidebar';
import PrednostiSection from '../components/home/PrednostiSection';
import WorkshopCard from '../components/ui/WorkshopCard';
import Button from '../components/ui/Button';
import AuthModal from '../components/auth/AuthModal';
import { fetchWorkshops } from '../api/workshops';
import type { WorkshopFilters, SortOption, ViewMode } from '../types';
import { SORT_OPTIONS } from '../types';
import { Link } from 'react-router-dom';

const Domov = () => {
  const [filters, setFilters] = useState<WorkshopFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch workshops with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['workshops', filters, currentPage],
    queryFn: () => fetchWorkshops({ ...filters, page: currentPage }),
  });

  const handleSearch = (query: string, region?: string) => {
    setFilters((prev) => ({
      ...prev,
      q: query || undefined,
      region: region || undefined,
    }));
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: WorkshopFilters) => {
    setFilters(newFilters);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <FiltersSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Workshops List */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Razvrsti po:</label>
                <select
                  value={filters.sort || ''}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                <p className="text-red-600">Napaka pri nalaganju delavnic.</p>
              </div>
            )}

            {/* Workshops Grid/List */}
            {data && data.results.length > 0 && (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-6'
                  }
                >
                  {data.results.map((workshop) => (
                    <WorkshopCard
                      key={workshop.id}
                      workshop={workshop}
                      viewMode={viewMode}
                      onLoginRequired={() => setIsAuthModalOpen(true)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {data.next && (
                  <div className="text-center mt-12">
                    <Button onClick={handleLoadMore} size="lg">
                      Naloži več
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {data && data.results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">Ni najdenih delavnic.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zakaj ta portal Section */}
      <section className="bg-gray-dark text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Zakaj ta portal?</h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Portal delavnice.net združuje preglednost in kakovost preventive ter šolam
            omogoča hiter dostop do preverjenih, strokovno utemeljenih programov. S
            povezovanjem ponudnikov in šol krepi zaupanje, profesionalnost in dolgoročno
            učinkovitost preventivnega dela.
          </p>
          <Link to="/o-platformi">
            <Button variant="primary" size="lg">
              Preberi več ...
            </Button>
          </Link>
        </div>
      </section>

      {/* Prednosti Section */}
      <PrednostiSection />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView="login"
      />
    </div>
  );
};

export default Domov;

