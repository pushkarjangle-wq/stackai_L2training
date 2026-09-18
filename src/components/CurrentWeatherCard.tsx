import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Sun,
  Eye,
  Cloud,
  Thermometer,
  Compass,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: WeatherData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  onRefresh,
  isRefreshing,
}) => {
  const { location, current, daily, units, lastUpdated } = data;
  const codeInfo = getWeatherCodeInfo(current.weather_code, current.is_day);

  // Today's daily max/min
  const todayDaily = daily[0];
  const maxTemp = todayDaily ? todayDaily.temperature_max : current.temperature;
  const minTemp = todayDaily ? todayDaily.temperature_min : current.temperature;

  const tempSymbol = units.temperature === 'fahrenheit' ? '°F' : '°C';
  const windUnit = units.windSpeed === 'mph' ? 'mph' : 'km/h';

  // Get wind direction cardinal label
  const getWindCardinal = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round((degrees % 360) / 22.5) % 16;
    return directions[index];
  };

  // Humidity comfort
  const getHumidityComfort = (humidity: number) => {
    if (humidity < 30) return { label: 'Dry', color: 'text-amber-600' };
    if (humidity <= 60) return { label: 'Comfortable', color: 'text-emerald-600' };
    if (humidity <= 75) return { label: 'Moderate', color: 'text-sky-600' };
    return { label: 'Humid', color: 'text-cyan-700' };
  };

  const humidityInfo = getHumidityComfort(current.humidity);

  return (
    <div
      id="current-weather-card"
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${codeInfo.bgGradient} p-6 md:p-8 shadow-sm backdrop-blur-md transition-all duration-300`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with City & Refresh */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {location.name}
            </h1>
            {location.country_code && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 font-mono text-slate-600 shadow-xs">
                {location.country_code}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
            <span>{[location.admin1, location.country].filter(Boolean).join(', ')}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-slate-400">
              {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-slate-400" /> Updated {lastUpdated}
            </span>
            <span className="text-xs font-medium text-slate-400">
              Timezone: {location.timezone || 'Local'}
            </span>
          </div>
          <button
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Refresh current forecast"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temperature & Weather Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
        {/* Left Column: Big Temperature & High/Low */}
        <div className="md:col-span-6 flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-extrabold tracking-tighter text-slate-900 font-mono">
              {Math.round(current.temperature)}
            </span>
            <span className="text-3xl md:text-4xl font-light text-sky-600">
              {tempSymbol}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Thermometer className="w-4 h-4 text-sky-500" />
              Feels like <span className="text-slate-900 font-semibold">{Math.round(current.apparent_temperature)}{tempSymbol}</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-600">
              <ArrowUp className="w-3.5 h-3.5 text-rose-500" /> {Math.round(maxTemp)}{tempSymbol}
              <ArrowDown className="w-3.5 h-3.5 text-sky-500 ml-1.5" /> {Math.round(minTemp)}{tempSymbol}
            </span>
          </div>
        </div>

        {/* Right Column: Condition & Icon */}
        <div className="md:col-span-6 flex items-center md:justify-end gap-5">
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-sm flex items-center justify-center">
            <WeatherIcon
              name={codeInfo.iconName}
              className={`w-16 h-16 md:w-20 md:h-20 ${codeInfo.textColor} drop-shadow-sm`}
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-xs mb-1.5">
              <span className={`w-2 h-2 rounded-full ${current.is_day ? 'bg-amber-500' : 'bg-indigo-500'} animate-pulse`} />
              {current.is_day ? 'Daytime' : 'Nighttime'}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {codeInfo.label}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              WMO Code {current.weather_code} • Cloud cover at {current.cloud_cover}%
            </p>
          </div>
        </div>
      </div>

      {/* Environmental Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80">
        {/* Humidity */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">{current.humidity}%</span>
            <span className={`text-xs font-medium ${humidityInfo.color}`}>{humidityInfo.label}</span>
          </div>
        </div>

        {/* Wind */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {current.wind_speed} <span className="text-xs font-sans text-slate-400">{windUnit}</span>
            </span>
            <span className="text-xs font-medium text-slate-600 flex items-center gap-1 font-mono">
              <Compass className="w-3 h-3 text-slate-400" />
              {getWindCardinal(current.wind_direction)}
            </span>
          </div>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">UV Index</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">{current.uv_index}</span>
            <span className={`text-xs font-medium ${
              current.uv_index >= 8 ? 'text-rose-600' : current.uv_index >= 6 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {current.uv_index >= 8 ? 'Very High' : current.uv_index >= 6 ? 'High' : current.uv_index >= 3 ? 'Moderate' : 'Low'}
            </span>
          </div>
        </div>

        {/* Precipitation */}
        <div className="p-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Precipitation</span>
            <Cloud className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900 font-mono">
              {current.precipitation} <span className="text-xs font-sans text-slate-400">mm</span>
            </span>
            <span className="text-xs font-medium text-slate-600">
              {todayDaily ? `${todayDaily.precipitation_probability_max}% chance` : 'Dry'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
