import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        </div>
        <div className="w-32 h-8 bg-gray-200 rounded mb-2" />
        <div className="w-20 h-4 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-gray-900 leading-none">{value}</span>
      </div>

      {trend && (
        <p className={`text-xs mt-3 font-bold flex items-center gap-1 ${
          trendType === 'positive' ? 'text-green-600' : 
          trendType === 'negative' ? 'text-red-600' : 
          'text-gray-400'
        }`}>
          {trendType === 'positive' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
            </svg>
          )}
          {trendType === 'negative' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          )}
          {trend}
        </p>
      )}
    </div>
  );
};
