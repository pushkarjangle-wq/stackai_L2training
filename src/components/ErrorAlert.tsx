import React from 'react';
import { AlertCircle, RefreshCw, MapPin, X } from 'lucide-react';
import { POPULAR_CITIES } from '../services/weatherApi';
import { GeoLocationResult } from '../types';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onSelectCity?: (city: GeoLocationResult) => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onSelectCity,
  onDismiss,
}) => {
  return (
    <div
      id="weather-error-alert"
      className="p-5 rounded-2xl bg-rose-50/90 border border-rose-200 shadow-sm backdrop-blur-md text-slate-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 border border-rose-200 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">
              Unable to complete weather query
            </h3>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              {message}
            </p>

            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 border border-transparent text-xs font-semibold text-white shadow-xs transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Request
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-rose-400 hover:text-rose-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {onSelectCity && (
        <div className="mt-4 pt-3.5 border-t border-rose-200/80">
          <span className="text-xs text-slate-600 block mb-2">
            Or choose a major city to restore forecast:
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CITIES.slice(0, 4).map((city) => (
              <button
                key={`error-suggest-${city.id}`}
                onClick={() => onSelectCity(city)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-all flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-sky-500" />
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
