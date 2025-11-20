/**
 * Metric Card Component
 * 메트릭 표시 카드
 */

'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number; // percentage change
  status?: 'good' | 'warning' | 'critical';
  description?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  status = 'good',
  description,
  className,
}: MetricCardProps) {
  const statusColors = {
    good: 'from-green-500 to-emerald-600',
    warning: 'from-amber-500 to-orange-600',
    critical: 'from-red-500 to-rose-600',
  };

  const trendColor = trend && trend > 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-lg',
        className
      )}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={cn('p-3 rounded-lg bg-gradient-to-br', statusColors[status])}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Trend Indicator */}
        {trend !== undefined && (
          <div className={cn('flex items-center text-sm font-semibold', trendColor)}>
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4">
        {title}
      </h3>

      {/* Value */}
      <div className="flex items-baseline mt-2">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        {unit && (
          <span className="ml-2 text-lg text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}
