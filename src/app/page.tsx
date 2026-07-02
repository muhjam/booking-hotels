'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import TopNav from '@/components/layout/top-nav';
import { useHotels } from '@/hooks/use-hotels';
import { HotelFilters } from '@/services/api/hotel';
import { formatCurrency } from '@/lib/utils';

const CITY_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Jakarta', value: 'Jakarta' },
  { label: 'Bandung', value: 'Bandung' },
  { label: 'Yogyakarta', value: 'Yogyakarta' },
  { label: 'Bali', value: 'Bali' },
];

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCity, setActiveCity] = useState('');
  const [activeFilters, setActiveFilters] = useState<HotelFilters>({});

  const { data: hotels, isLoading } = useHotels(activeFilters);

  const handleSearch = useCallback(() => {
    setActiveFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
    }));
  }, [searchInput]);

  const handleCityFilter = useCallback((city: string) => {
    setActiveCity(city);
    setActiveFilters((prev) => ({
      ...prev,
      location: city || undefined,
      // Reset text search when filtering by city
      search: undefined,
    }));
    setSearchInput('');
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch]
  );

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <TopNav />
      <main>
        {/* Hero + Search */}
        <section className="bg-gradient-to-b from-primary/5 to-transparent py-12 px-4 md:px-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8">
              Find your next sanctuary
            </h1>
            <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-[12px] font-semibold uppercase tracking-wider block mb-1 text-on-surface-variant">
                  SEARCH
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">
                    location_on
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:border-secondary focus:ring-0 text-lg"
                    placeholder="Hotel name, city, or keyword..."
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className="w-full md:w-auto flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full md:w-auto bg-primary-container text-white px-8 py-3 rounded-xl text-lg font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hotel Listing */}
        <section className="py-12 px-4 md:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header + City Quick Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-on-background">Featured Stays</h2>
                {!isLoading && (
                  <p className="text-sm text-on-surface-variant mt-1">
                    {hotels?.length ?? 0} hotel{(hotels?.length ?? 0) !== 1 ? 's' : ''} found
                    {activeFilters.search ? ` for "${activeFilters.search}"` : ''}
                    {activeCity ? ` in ${activeCity}` : ''}
                  </p>
                )}
              </div>
              {/* City filter pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {CITY_FILTERS.map((city) => (
                  <button
                    key={city.value}
                    onClick={() => handleCityFilter(city.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeCity === city.value
                      ? 'bg-primary text-white border-primary'
                      : 'border-outline-variant text-on-surface hover:bg-surface-container'
                      }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-80 bg-surface-container rounded-xl animate-pulse" />
                ))}
              </div>
            ) : hotels && hotels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={hotel.image || 'https://via.placeholder.com/400x300'}
                        alt={hotel.name}
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span
                          className="material-symbols-outlined text-amber-500 text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-sm font-bold">{hotel.rating || '4.8'}</span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                          {hotel.location}
                        </p>
                        <h3 className="text-lg font-semibold text-on-surface mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-1 text-on-surface-variant mb-4">
                          {hotel.amenities.slice(0, 2).map((amenity, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <span className="text-sm">{amenity}</span>
                              {i < hotel.amenities.slice(0, 2).length - 1 && (
                                <span className="mx-1">•</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-outline-variant flex justify-between items-center">
                        <div>
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(hotel.price)}
                          </span>
                          <span className="text-sm text-on-surface-variant">/night</span>
                        </div>
                        <Link
                          href={`/checkout?hotelId=${hotel.id}`}
                          className="bg-secondary text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-on-secondary-container transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                  search_off
                </span>
                <h3 className="text-xl font-semibold text-on-surface mb-2">No hotels found</h3>
                <p className="text-on-surface-variant mb-6">
                  Try a different keyword or clear your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchInput('');
                    setActiveCity('');
                    setActiveFilters({});
                  }}
                  className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-on-background mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-16 max-w-7xl mx-auto">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-bold text-surface">Hotels</span>
            <p className="text-sm text-surface-variant mt-1">Elevating your travel experience since 2024.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors">Terms of Service</Link>
              <Link href="#" className="text-sm text-surface-variant hover:text-primary-fixed-dim transition-colors">Cookie Policy</Link>
            </div>
            <p className="text-sm text-surface-variant">© 2024 Hotels Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

