/**
 * Crop Management Dashboard Component
 * 작물 관리 대시보드
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, TrendingUp, Package } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import TimeSeriesChart from '@/components/common/TimeSeriesChart';
import { CROP_DATABASE } from '@/lib/constants';
import { formatDate, formatCurrency, getGrowthStageLabel } from '@/lib/utils';
import type { ActiveCrop, HarvestSchedule, GrowthTracking } from '@/types';

export default function CropManagement() {
  const [activeCrops, setActiveCrops] = useState<ActiveCrop[]>([]);
  const [harvestSchedule, setHarvestSchedule] = useState<HarvestSchedule[]>([]);
  const [growthTracking, setGrowthTracking] = useState<GrowthTracking[]>([]);
  const [growthChartData, setGrowthChartData] = useState<any[]>([]);

  useEffect(() => {
    const initializeData = () => {
      // Initialize active crops with growth data
      const crops: ActiveCrop[] = CROP_DATABASE.map((crop) => {
        const count = Math.floor(850 / crop.id + Math.random() * 200);
        const plantDate = new Date();
        plantDate.setDate(plantDate.getDate() - Math.floor(Math.random() * crop.cycle));

        const daysGrown = Math.floor((new Date().getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24));
        const growthStage = Math.min(100, (daysGrown / crop.cycle) * 100);
        const stage = getGrowthStageLabel(growthStage) as ActiveCrop['stage'];

        const expectedHarvestDate = new Date(plantDate);
        expectedHarvestDate.setDate(expectedHarvestDate.getDate() + crop.cycle);

        return {
          ...crop,
          count,
          plantDate,
          daysGrown,
          growthStage,
          stage,
          health: 85 + Math.random() * 15,
          expectedHarvestDate,
        };
      });

      setActiveCrops(crops);

      // Growth tracking
      const tracking: GrowthTracking[] = crops.map((crop) => ({
        crop: crop.name,
        color: crop.color,
        week1: Math.random() * 30,
        week2: 30 + Math.random() * 20,
        week3: 50 + Math.random() * 20,
        week4: 70 + Math.random() * 20,
        current: crop.growthStage || 0,
      }));
      setGrowthTracking(tracking);

      // Harvest schedule
      const schedule: HarvestSchedule[] = crops.map((crop, idx) => ({
        id: `harvest-${idx}`,
        crop: crop.name,
        quantity: crop.count,
        harvestDate: crop.expectedHarvestDate!,
        expectedWeight: crop.count * crop.harvestWeight,
        targetMarket: '가락시장',
        estimatedRevenue: crop.count * crop.harvestWeight * (crop.pricePerKg || 10000),
        status: crop.growthStage! >= 80 ? 'ready' : 'planned',
      }));

      setHarvestSchedule(schedule);

      // Transform growth tracking data for chart
      const chartData = [
        { 주차: '1주', ...Object.fromEntries(tracking.map(t => [t.crop, t.week1])) },
        { 주차: '2주', ...Object.fromEntries(tracking.map(t => [t.crop, t.week2])) },
        { 주차: '3주', ...Object.fromEntries(tracking.map(t => [t.crop, t.week3])) },
        { 주차: '4주', ...Object.fromEntries(tracking.map(t => [t.crop, t.week4])) },
        { 주차: '현재', ...Object.fromEntries(tracking.map(t => [t.crop, t.current])) },
      ];
      setGrowthChartData(chartData);
    };

    initializeData();
  }, []);

  const totalPlants = activeCrops.reduce((sum, crop) => sum + crop.count, 0);
  const readyToHarvest = harvestSchedule.filter((h) => h.status === 'ready').length;
  const avgGrowth = (activeCrops.reduce((sum, crop) => sum + (crop.growthStage || 0), 0) / activeCrops.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="총 재배 주수"
          value={totalPlants}
          unit="주"
          icon={Sprout}
          status="good"
        />
        <MetricCard
          title="수확 준비"
          value={readyToHarvest}
          unit="작물"
          icon={Package}
          status="good"
        />
        <MetricCard
          title="평균 성장률"
          value={avgGrowth}
          unit="%"
          icon={TrendingUp}
          status="good"
        />
        <MetricCard
          title="예정 수확일"
          value={harvestSchedule.length}
          unit="건"
          icon={Calendar}
          status="good"
        />
      </div>

      {/* Active Crops Growth Status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">재배 작물 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCrops.map((crop) => (
            <div
              key={crop.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
              style={{ borderLeftWidth: '4px', borderLeftColor: crop.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">{crop.icon}</div>
                  <div>
                    <div className="font-semibold">{crop.name}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {crop.count}주 재배 중
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-600 dark:text-slate-400">성장 단계</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {crop.stage}
                  </div>
                </div>
              </div>

              {/* Growth Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>성장률</span>
                  <span className="font-semibold">{crop.growthStage?.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                    style={{ width: `${crop.growthStage}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-600 dark:text-slate-400">재배 일수</div>
                  <div className="font-semibold">{crop.daysGrown}일</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">건강도</div>
                  <div className="font-semibold">{crop.health?.toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">파종일</div>
                  <div className="font-semibold">{formatDate(crop.plantDate!)}</div>
                </div>
                <div>
                  <div className="text-slate-600 dark:text-slate-400">수확 예정</div>
                  <div className="font-semibold">{formatDate(crop.expectedHarvestDate!)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Harvest Schedule */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">수확 일정</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">작물</th>
                <th className="text-center py-3 px-4">수량</th>
                <th className="text-center py-3 px-4">예상 중량</th>
                <th className="text-center py-3 px-4">수확 예정일</th>
                <th className="text-center py-3 px-4">예상 수익</th>
                <th className="text-center py-3 px-4">상태</th>
              </tr>
            </thead>
            <tbody>
              {harvestSchedule.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 px-4 font-semibold">{schedule.crop}</td>
                  <td className="text-center py-3 px-4">{schedule.quantity}주</td>
                  <td className="text-center py-3 px-4">
                    {schedule.expectedWeight.toFixed(1)} kg
                  </td>
                  <td className="text-center py-3 px-4">
                    {formatDate(schedule.harvestDate)}
                  </td>
                  <td className="text-center py-3 px-4 font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(Math.floor(schedule.estimatedRevenue))}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        schedule.status === 'ready'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {schedule.status === 'ready' ? '수확준비' : '재배중'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Progression Chart */}
      {growthChartData.length > 0 && growthTracking.length > 0 && (
        <TimeSeriesChart
          data={growthChartData}
          dataKeys={growthTracking.slice(0, 5).map((tracking) => ({
            key: tracking.crop,
            name: tracking.crop,
            color: tracking.color,
          }))}
          xAxisKey="주차"
          title="주요 작물 성장 추이 (주차별)"
          height={300}
        />
      )}
    </div>
  );
}
