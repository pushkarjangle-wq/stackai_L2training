import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current weather skeleton */}
      <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-32 bg-slate-200/70 rounded" />
          </div>
          <div className="h-8 w-8 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex justify-between items-center my-4">
          <div className="h-16 w-32 bg-slate-200 rounded-xl" />
          <div className="h-16 w-16 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-200">
          <div className="h-12 bg-slate-200/70 rounded-xl" />
          <div className="h-12 bg-slate-200/70 rounded-xl" />
          <div className="h-12 bg-slate-200/70 rounded-xl" />
          <div className="h-12 bg-slate-200/70 rounded-xl" />
        </div>
      </div>

      {/* Intelligence skeleton */}
      <div className="h-64 rounded-2xl bg-slate-50 border border-slate-200/80 p-6">
        <div className="h-6 w-56 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 bg-slate-200/60 rounded-xl" />
          <div className="h-32 bg-slate-200/60 rounded-xl" />
          <div className="h-32 bg-slate-200/60 rounded-xl" />
          <div className="h-32 bg-slate-200/60 rounded-xl" />
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200/80 p-6">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="h-48 bg-slate-200/50 rounded-xl" />
      </div>
    </div>
  );
};
