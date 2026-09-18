import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Navigation,
  RefreshCw,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { GeoLocationResult, WeatherData, TemperatureUnit, WindSpeedUnit } from './types';
import { POPULAR_CITIES, fetchWeatherData } from './services/weatherApi';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { WeatherCharts } from './components/WeatherCharts';
import { Forecast7Days } from './components/Forecast7Days';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<GeoLocationResult>(POPULAR_CITIES[0]); // New York default
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [windUnit, setWindUnit] = useState<WindSpeedUnit>('kmh');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load weather for selected city
  const loadForecast = useCallback(
    async (city: GeoLocationResult, silent = false) => {
      if (!silent) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setErrorMessage(null);

      try {
        const data = await fetchWeatherData(city, tempUnit, windUnit);
        setWeatherData(data);
      } catch (err: any) {
        console.error('Error fetching weather:', err);
        setErrorMessage(
          err.message || 'Unable to retrieve weather forecast for this location. Please try again.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [tempUnit, windUnit]
  );

  // Initial load or city/unit change
  useEffect(() => {
    loadForecast(selectedCity);
  }, [selectedCity, tempUnit, windUnit, loadForecast]);

  // Handle City Selection
  const handleCitySelect = (city: GeoLocationResult) => {
    setSelectedCity(city);
    setErrorMessage(null);
  };

  // Handle Current Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLoadingLocation(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const detectedLocation: GeoLocationResult = {
          id: Date.now(),
          name: 'My Location',
          latitude: lat,
          longitude: lon,
          country_code: '',
          country: 'GPS Detected',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
        };

        setSelectedCity(detectedLocation);
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        let msg = 'Could not access your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access permission was declined. Please search for your city name instead.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try searching for your city.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle temperature unit
  const handleToggleUnit = (unit: TemperatureUnit) => {
    if (unit !== tempUnit) {
      setTempUnit(unit);
      setWindUnit(unit === 'fahrenheit' ? 'mph' : 'kmh');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900">
                Weather Intelligence
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Open-Meteo
              </span>
            </div>
          </div>

          {/* Unit Toggle and Controls */}
          <div className="flex items-center gap-3">
            {/* °C / °F Unit Toggle Switch */}
            <div
              id="unit-toggle"
              className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-xs"
            >
              <button
                id="unit-celsius-btn"
                onClick={() => handleToggleUnit('celsius')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  tempUnit === 'celsius'
                    ? 'bg-white text-sky-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Use Celsius and km/h"
              >
                °C
              </button>
              <button
                id="unit-fahrenheit-btn"
                onClick={() => handleToggleUnit('fahrenheit')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  tempUnit === 'fahrenheit'
                    ? 'bg-white text-sky-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Use Fahrenheit and mph"
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Search Bar & Popular Chips */}
        <section aria-label="City Search">
          <SearchBar
            onSelectCity={handleCitySelect}
            onUseCurrentLocation={handleDetectLocation}
            isLoadingLocation={isLoadingLocation}
            selectedCity={selectedCity}
          />
        </section>

        {/* Error Alert Display */}
        {errorMessage && (
          <section aria-label="Query Error">
            <ErrorAlert
              message={errorMessage}
              onRetry={() => loadForecast(selectedCity)}
              onSelectCity={handleCitySelect}
              onDismiss={() => setErrorMessage(null)}
            />
          </section>
        )}

        {/* Content Body: Skeleton Loader vs Live Data */}
        {isLoading && !weatherData ? (
          <LoadingSkeleton />
        ) : weatherData ? (
          <div className="space-y-6">
            {/* Primary Current Weather Display */}
            <section aria-label="Current Weather">
              <CurrentWeatherCard
                data={weatherData}
                onRefresh={() => loadForecast(selectedCity, true)}
                isRefreshing={isRefreshing}
              />
            </section>

            {/* Weather Intelligence & Planning Recommendations */}
            <section aria-label="Daily Planning Intelligence">
              <PlanningRecommendations
                intelligence={weatherData.intelligence}
                unit={tempUnit}
              />
            </section>

            {/* 24-Hour Trends Chart */}
            <section aria-label="24-Hour Forecast Trends">
              <WeatherCharts
                hourly={weatherData.hourly}
                tempUnit={tempUnit}
                windUnit={windUnit}
              />
            </section>

            {/* 7-Day Extended Forecast */}
            <section aria-label="7-Day Extended Forecast">
              <Forecast7Days
                daily={weatherData.daily}
                tempUnit={tempUnit}
                windUnit={windUnit}
              />
            </section>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 hover:text-sky-700 font-medium underline underline-offset-2 transition-colors"
            >
              Open-Meteo Weather APIs
            </a>
            <span>• Free & Open Source</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WMO Standards
            </span>
            <span className="text-slate-500">
              Coordinates: {selectedCity.latitude.toFixed(2)}°, {selectedCity.longitude.toFixed(2)}°
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
