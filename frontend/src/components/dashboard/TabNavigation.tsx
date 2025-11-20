/**
 * Tab Navigation Component
 * 대시보드 탭 네비게이션
 */

'use client';

import React from 'react';
import { Activity, Zap, Wind, TrendingUp, Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores/useDashboardStore';
import type { DashboardTab } from '@/types';

const TABS = [
  {
    id: 'facility' as DashboardTab,
    name: '시설 모니터링',
    icon: Activity,
    description: '하우스/랙/셀 구조 및 장비 상태',
  },
  {
    id: 'twin' as DashboardTab,
    name: '디지털 트윈',
    icon: Zap,
    description: '3D 시각화 및 실시간 모니터링',
  },
  {
    id: 'environmental' as DashboardTab,
    name: '환경 모니터링',
    icon: Wind,
    description: '온도/습도/CO2/pH/EC 센서 데이터',
  },
  {
    id: 'market' as DashboardTab,
    name: '시장 최적화',
    icon: TrendingUp,
    description: '가격 예측 및 수익성 분석',
  },
  {
    id: 'crop' as DashboardTab,
    name: '작물 관리',
    icon: Sprout,
    description: '성장 추적 및 수확 일정',
  },
];

export default function TabNavigation() {
  const activeTab = useDashboardStore((state) => state.activeTab);
  const setActiveTab = useDashboardStore((state) => state.setActiveTab);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2">
      <div className="grid grid-cols-5 gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-green-500',
                isActive
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md'
              )}
            >
              {/* Icon */}
              <Icon
                className={cn(
                  'w-8 h-8 mb-2 transition-transform',
                  isActive && 'animate-pulse'
                )}
              />

              {/* Tab Name */}
              <div className="text-sm font-semibold text-center">
                {tab.name}
              </div>

              {/* Description */}
              <div className={cn(
                'text-xs text-center mt-1 transition-opacity',
                isActive ? 'opacity-90' : 'opacity-60'
              )}>
                {tab.description}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-12 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
