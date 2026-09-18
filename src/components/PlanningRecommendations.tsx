import React from 'react';
import {
  Sparkles,
  Activity,
  Umbrella,
  Shirt,
  Sun,
  ShieldCheck,
  AlertCircle,
  Clock,
  Car,
  CheckCircle,
} from 'lucide-react';
import { WeatherIntelligenceReport, TemperatureUnit } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface PlanningRecommendationsProps {
  intelligence: WeatherIntelligenceReport;
  unit: TemperatureUnit;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  intelligence,
  unit,
}) => {
  const {
    overallActivityScore,
    overallActivityLabel,
    umbrellaNeeded,
    umbrellaAdvice,
    umbrellaChance,
    attireRecommendation,
    layerDetails,
    uvLevel,
    uvValue,
    uvAdvice,
    outdoorWindow,
    commuteAdvice,
    cardHighlights,
  } = intelligence;

  // Status color mapper
  const getStatusBadge = (status: 'good' | 'moderate' | 'caution' | 'alert') => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
        };
      case 'moderate':
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-700',
          dot: 'bg-sky-500',
        };
      case 'caution':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
        };
      case 'alert':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500',
        };
    }
  };

  // Score color ring
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 60) return 'text-sky-600 stroke-sky-500';
    if (score >= 40) return 'text-amber-600 stroke-amber-500';
    return 'text-rose-600 stroke-rose-500';
  };

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (overallActivityScore / 100) * circumference;

  return (
    <div
      id="planning-intelligence-section"
      className="p-6 md:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm backdrop-blur-md"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Weather Intelligence & Daily Planning
            </h2>
            <p className="text-xs text-slate-500">
              Rule-based actionable recommendations for workouts, commuting, attire, and protection
            </p>
          </div>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 88 88">
              <circle
                cx="44"
                cy="44"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="44"
                cy="44"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${getScoreColor(overallActivityScore)} transition-all duration-1000 ease-out`}
                fill="transparent"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-slate-900">
              {overallActivityScore}
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Activity Index
            </div>
            <div className={`text-sm font-bold ${getScoreColor(overallActivityScore)}`}>
              {overallActivityLabel}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {cardHighlights.map((item, index) => {
          const badgeStyle = getStatusBadge(item.status);
          return (
            <div
              key={`intel-card-${index}`}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {item.title}
                  </span>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${badgeStyle.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`} />
                    {item.status.toUpperCase()}
                  </div>
                </div>

                <div className="flex items-start gap-2.5 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-200/70 text-sky-600 shadow-xs shrink-0 mt-0.5">
                    <WeatherIcon name={item.iconName} className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                    {item.headline}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Time Window & Commute Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4 pt-4 border-t border-slate-200/80">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-900">Recommended Outdoor Window: </span>
            <span className="text-sky-700 font-medium">{outdoorWindow}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <Car className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-900">Transit & Commute Alert: </span>
            <span className="text-slate-700">{commuteAdvice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
