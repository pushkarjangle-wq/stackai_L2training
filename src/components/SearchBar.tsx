import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Compass } from 'lucide-react';
import { GeoLocationResult } from '../types';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  selectedCity?: GeoLocationResult;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLoadingLocation,
  selectedCity,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const found = await searchCities(query);
        setResults(found);
        setIsOpen(true);
        if (found.length === 0) {
          setSearchError(`No cities found matching "${query}". Check spelling or try a nearby city.`);
        }
      } catch (err: any) {
        setResults([]);
        setSearchError(err.message || 'Error searching city.');
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocationResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setSearchError(null);
  };

  return (
    <div className="w-full" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim().length >= 2 || results.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Search any city or region worldwide (e.g., Tokyo, Zurich, Vancouver)..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all shadow-sm"
          />

          {query && (
            <button
              id="clear-search-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
                setSearchError(null);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Use Geolocation button */}
        <button
          id="detect-location-btn"
          onClick={onUseCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center gap-2 px-3.5 py-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-sky-600 border border-slate-200 rounded-xl text-sm font-medium transition-all shadow-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          title="Use my current location via GPS"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-500" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="relative z-50">
          <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl max-h-80 overflow-y-auto custom-scrollbar">
            {searchError ? (
              <div className="p-4 text-sm text-slate-700 flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">{searchError}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching with another spelling, or pick from popular global cities below.
                  </p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="py-1">
                <div className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 bg-slate-50/60">
                  Search Results
                </div>
                {results.map((item) => (
                  <button
                    key={`${item.id}-${item.latitude}-${item.longitude}`}
                    onClick={() => handleSelect(item)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin className="w-4 h-4 text-sky-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <div className="truncate">
                        <span className="font-medium text-slate-800 group-hover:text-sky-600 transition-colors">
                          {item.name}
                        </span>
                        {(item.admin1 || item.country) && (
                          <span className="text-xs text-slate-500 ml-2 truncate">
                            {[item.admin1, item.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 shrink-0 pl-2">
                      {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Popular City Quick-Chips */}
      <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 custom-scrollbar">
        <span className="text-xs font-medium text-slate-500 shrink-0 mr-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-sky-500" /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = selectedCity?.name === city.name && selectedCity?.country_code === city.country_code;
          return (
            <button
              key={`popular-${city.id}`}
              id={`popular-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSelect(city)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
