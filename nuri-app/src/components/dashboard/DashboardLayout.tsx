/**
 * Dashboard Layout Component
 * 대시보드 공통 레이아웃
 */

'use client';

import React from 'react';
import { Clock, Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useDashboardStore } from '@/stores/useDashboardStore';

interface DashboardLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DashboardLayout({
  title,
  children,
  actions,
}: DashboardLayoutProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const alerts = useDashboardStore((state) => state.alerts);
  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {title}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    누리팜 스마트팜 종합 관리 시스템
                  </p>
                </div>
              </div>
            </div>

            {/* Actions & Time */}
            <div className="flex items-center space-x-4">
              {actions}

              {/* Alert Badge */}
              {unacknowledgedAlerts.length > 0 && (
                <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unacknowledgedAlerts.length}
                  </span>
                </button>
              )}

              {/* Current Time */}
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
                <Clock className="w-5 h-5" />
                <div className="text-sm">
                  <div className="font-semibold">{formatDate(currentTime, 'time')}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(currentTime, 'short')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
