import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  ChevronRight,
  X,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { DailyForecastItem, TemperatureUnit, WindSpeedUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface Forecast7DaysProps {
  daily: DailyForecastItem[];
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export const Forecast7Days: React.FC<Forecast7DaysProps> = ({
  daily,
  tempUnit,
  windUnit,
}) => {
  const [selectedDay, setSelectedDay] = useState<DailyForecastItem | null>(null);

  const tempSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const speedSymbol = windUnit === 'mph' ? 'mph' : 'km/h';

  // Calculate week min and max to render proportional temperature range bars
  const weekMin = Math.min(...daily.map((d) => d.temperature_min));
  const weekMax = Math.max(...daily.map((d) => d.temperature_max));
  const totalRange = weekMax - weekMin || 1;

  const formatSunTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div
      id="seven-day-forecast-section"
      className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            7-Day Extended Forecast
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          Click any day for details
        </span>
      </div>

      {/* Forecast Cards Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mt-5">
        {daily.map((day, idx) => {
          const codeInfo = getWeatherCodeInfo(day.weather_code, 1);
          const isSelected = selectedDay?.date === day.date;

          // Calculate bar offsets for visual range
          const leftPercent = Math.max(0, ((day.temperature_min - weekMin) / totalRange) * 100);
          const widthPercent = Math.max(15, ((day.temperature_max - day.temperature_min) / totalRange) * 100);

          return (
            <button
              key={`day-${day.date}-${idx}`}
              onClick={() => setSelectedDay(day)}
              className={`p-4 rounded-xl text-left transition-all flex flex-col justify-between border group relative ${
                isSelected
                  ? 'bg-sky-50 border-sky-400 shadow-xs ring-1 ring-sky-300'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {day.formattedDay}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {day.formattedDate}
                  </span>
                </div>

                {/* Weather Icon and Condition */}
                <div className="my-3 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/80 group-hover:scale-105 transition-transform shadow-2xs">
                    <WeatherIcon
                      name={codeInfo.iconName}
                      className={`w-6 h-6 ${codeInfo.textColor}`}
                    />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-800 block truncate">
                      {codeInfo.label}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      UV {day.uv_index_max}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temperatures */}
              <div className="mt-2 pt-2 border-t border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className="text-slate-500 font-medium">
                    {day.temperature_min}{tempSymbol}
                  </span>
                  <span className="text-slate-900 font-bold text-sm">
                    {day.temperature_max}{tempSymbol}
                  </span>
                </div>

                {/* Temperature bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                {/* Precipitation chance indicator */}
                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-blue-500" />
                    {day.precipitation_probability_max}%
                  </span>
                  <span className="text-slate-600 flex items-center gap-1 font-mono">
                    <Wind className="w-3 h-3 text-teal-600" />
                    {day.wind_speed_max}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Inspection Modal/Drawer */}
      {selectedDay && (
        <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200 relative animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => setSelectedDay(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              Detailed Outlook for {selectedDay.formattedDay}, {selectedDay.formattedDate}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
              {getWeatherCodeInfo(selectedDay.weather_code).label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                Temperature Bounds
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {selectedDay.temperature_min}{tempSymbol} to {selectedDay.temperature_max}{tempSymbol}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Feels like {selectedDay.apparent_temperature_min}{tempSymbol} - {selectedDay.apparent_temperature_max}{tempSymbol}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                Precipitation
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {selectedDay.precipitation_sum} mm
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Peak chance: {selectedDay.precipitation_probability_max}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                Peak Wind Gusts
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                {selectedDay.wind_speed_max} {speedSymbol}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Max daily sustained wind
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200/80 shadow-xs">
              <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Daylight & Solar
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <span>↑ {formatSunTime(selectedDay.sunrise)}</span>
                <span>↓ {formatSunTime(selectedDay.sunset)}</span>
              </div>
              <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                Peak UV: {selectedDay.uv_index_max}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
