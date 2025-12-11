import { useState } from 'react';
import { REGIONS, CATEGORIES } from '../../types';
import type { WorkshopFilters } from '../../types';

interface FiltersSidebarProps {
  filters: WorkshopFilters;
  onFiltersChange: (filters: WorkshopFilters) => void;
}

// Mock data for activity types and features - replace with API data
const ACTIVITY_TYPES = [
  { code: 'TECAJ', label: 'Tečaji' },
  { code: 'PREDAVANJE', label: 'Predavanja' },
  { code: 'DELAVNICA', label: 'Delavnice' },
  { code: 'IZOBRAZEVANJE', label: 'Izobraževanja' },
  { code: 'USPOSABLJANJE', label: 'Usposabljanja' },
  { code: 'PREDAVANJE_STROKOVNJAKOV', label: 'Predavanja strokovnjakov' },
];

const FEATURES = [
  { code: 'DOLGOROCEN', label: 'Dolgoročen program - 3 srečanja ali več' },
  { code: 'PREVZETO_IZ_TUJINE', label: 'Prevzeto iz tujine' },
  { code: 'KRATKOROCEN', label: 'Kratkoročen program - 2 srečanji ali manj' },
  { code: 'INTERAKTIVNO', label: 'Interaktivno' },
  { code: 'ANGLEŠČINA', label: 'Možna izvedba v angleščini' },
  { code: 'SPLETNA_IZVEDBA', label: 'Možnost spletne izvedbe' },
  { code: 'JAVNI_INTERES', label: 'Potrdilo o javnem interesu' },
  { code: 'NEKAZNOVANOST', label: 'Potrdilo o nekaznovanosti' },
];

const FiltersSidebar = ({ filters, onFiltersChange }: FiltersSidebarProps) => {
  const [priceMin, setPriceMin] = useState(filters.min_price || 100);
  const [priceMax, setPriceMax] = useState(filters.max_price || 1000);
  const [rating, setRating] = useState(filters.min_rating || 0);

  const handleFilterChange = (key: keyof WorkshopFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({});
    setPriceMin(100);
    setPriceMax(1000);
    setRating(0);
  };

  const toggleArrayFilter = (key: 'activity_type' | 'features', value: string) => {
    const currentArray = (filters[key] || []) as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
  };

  return (
    <aside className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Filtriraj delavnice</h2>
      </div>

      {/* Region Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Regija
        </label>
        <select
          value={filters.region || ''}
          onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
          className="select-field"
        >
          <option value="">Izberi regijo</option>
          <option value="">Vse regije</option>
          {REGIONS.map((region) => (
            <option key={region.code} value={region.code}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      {/* Activity Type Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vrsta aktivnosti
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={!filters.activity_type || filters.activity_type.length === 0}
              onChange={() => handleFilterChange('activity_type', undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Vse vrste</span>
          </label>
          {ACTIVITY_TYPES.map((type) => (
            <label key={type.code} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.activity_type || []).includes(type.code)}
                onChange={() => toggleArrayFilter('activity_type', type.code)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Lastnosti
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={!filters.features || filters.features.length === 0}
              onChange={() => handleFilterChange('features', undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Vse lastnosti</span>
          </label>
          {FEATURES.map((feature) => (
            <label key={feature.code} className="flex items-center">
              <input
                type="checkbox"
                checked={(filters.features || []).includes(feature.code)}
                onChange={() => toggleArrayFilter('features', feature.code)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Kategorija
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={!filters.category}
              onChange={() => handleFilterChange('category', undefined)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Vse kategorije</span>
          </label>
          {CATEGORIES.map((category) => (
            <label key={category.code} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.code}
                onChange={() => handleFilterChange('category', category.code)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Cena
        </label>
        <div className="space-y-4">
          <div>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceMin}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceMin(value);
                handleFilterChange('min_price', value);
              }}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">Od: {priceMin} €</p>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceMax}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPriceMax(value);
                handleFilterChange('max_price', value);
              }}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">Do: {priceMax} €</p>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ocena
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={rating}
          onChange={(e) => {
            const value = Number(e.target.value);
            setRating(value);
            handleFilterChange('min_rating', value > 0 ? value : undefined);
          }}
          className="w-full"
        />
        <p className="text-sm text-gray-600 mt-1">
          {rating > 0 ? `Najmanj: ${rating.toFixed(1)}` : 'Vse ocene'}
        </p>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Ponastavi filtre
      </button>
    </aside>
  );
};

export default FiltersSidebar;

