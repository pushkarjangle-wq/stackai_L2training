import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Thermometer,
  CloudRain,
  Wind,
  Sun,
  TrendingUp,
} from 'lucide-react';
import { HourlyWeatherItem, TemperatureUnit, WindSpeedUnit } from '../types';
import { getWeatherCodeInfo } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcon';

interface WeatherChartsProps {
  hourly: HourlyWeatherItem[];
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

type ChartTab = 'temperature' | 'precipitation' | 'wind_uv';

export const WeatherCharts: React.FC<WeatherChartsProps> = ({
  hourly,
  tempUnit,
  windUnit,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('temperature');

  const tempSymbol = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const speedSymbol = windUnit === 'mph' ? 'mph' : 'km/h';

  // Format data for Recharts
  const chartData = hourly.map((item) => ({
    time: item.formattedHour,
    fullTime: `${item.formattedDate} ${item.formattedHour}`,
    temperature: item.temperature,
    feelsLike: item.apparent_temperature,
    precipProb: item.precipitation_probability,
    precipitation: item.precipitation,
    windSpeed: item.wind_speed,
    uvIndex: item.uv_index,
    humidity: item.humidity,
    code: item.weather_code,
  }));

  // Custom Light Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    const weatherInfo = getWeatherCodeInfo(data.code, 1);

    return (
      <div className="bg-white/95 border border-slate-200 p-3.5 rounded-xl shadow-xl backdrop-blur-md text-xs z-50">
        <div className="font-semibold text-slate-800 border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between gap-3">
          <span>{data.fullTime}</span>
          <span className="text-sky-600 font-mono">{weatherInfo.label}</span>
        </div>

        <div className="space-y-1.5">
          {activeTab === 'temperature' && (
            <>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-sky-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Temperature:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.temperature}{tempSymbol}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-indigo-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Feels Like:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.feelsLike}{tempSymbol}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-500">
                <span>Humidity:</span>
                <span className="font-mono text-slate-700">{data.humidity}%</span>
              </div>
            </>
          )}

          {activeTab === 'precipitation' && (
            <>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-blue-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Rain Probability:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.precipProb}%</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-cyan-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-600 inline-block" /> Volume:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.precipitation} mm</span>
              </div>
            </>
          )}

          {activeTab === 'wind_uv' && (
            <>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-teal-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" /> Wind Speed:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.windSpeed} {speedSymbol}</span>
              </div>
              <div className="flex justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> UV Index:
                </span>
                <span className="font-mono font-bold text-slate-900">{data.uvIndex}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="weather-charts-section"
      className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm backdrop-blur-md"
    >
      {/* Header and Chart Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              24-Hour Forecast Trends
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive hourly meteorological progression & probability curve
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            id="chart-tab-temp"
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'temperature'
                ? 'bg-white text-sky-700 border border-slate-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            Temperature
          </button>
          <button
            id="chart-tab-precip"
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'precipitation'
                ? 'bg-white text-blue-700 border border-slate-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rain & Probability
          </button>
          <button
            id="chart-tab-wind-uv"
            onClick={() => setActiveTab('wind_uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'wind_uv'
                ? 'bg-white text-teal-700 border border-slate-200/80 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind & UV
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="h-64 sm:h-72 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temperature' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={['auto', 'auto']}
                unit={tempSymbol}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                name={`Temperature (${tempSymbol})`}
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name={`Feels Like (${tempSymbol})`}
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#feelsGradient)"
              />
            </AreaChart>
          ) : activeTab === 'precipitation' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="precipProb"
                name="Rain Probability (%)"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                unit={` ${speedSymbol}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 12]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="windSpeed"
                name={`Wind (${speedSymbol})`}
                stroke="#0d9488"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#0d9488' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uvIndex"
                name="UV Index"
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 2, fill: '#d97706' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Hourly Quick-Scroll Bar */}
      <div className="mt-6 pt-5 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider">Hourly Snapshot</span>
          <span>Scroll to explore &rarr;</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
          {hourly.map((hour, idx) => {
            const hourCode = getWeatherCodeInfo(hour.weather_code, 1);
            return (
              <div
                key={`hourly-pill-${idx}`}
                className="flex flex-col items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60 min-w-[76px] shrink-0 transition-colors"
              >
                <span className="text-xs font-medium text-slate-600">
                  {hour.formattedHour}
                </span>

                <div className="my-2">
                  <WeatherIcon
                    name={hourCode.iconName}
                    className={`w-6 h-6 ${hourCode.textColor}`}
                  />
                </div>

                <span className="text-sm font-bold text-slate-900 font-mono">
                  {hour.temperature}{tempSymbol}
                </span>

                {hour.precipitation_probability > 0 ? (
                  <span className="text-[10px] font-semibold text-blue-600 mt-1 flex items-center gap-0.5">
                    <CloudRain className="w-2.5 h-2.5" />
                    {hour.precipitation_probability}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 mt-1">0%</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
