/**
 * Market Optimization Dashboard Component
 * 시장 최적화 대시보드
 */

'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, BarChart3 } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import TimeSeriesChart from '@/components/common/TimeSeriesChart';
import { CROP_DATABASE, WHOLESALE_MARKETS } from '@/lib/constants';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { MarketPrice, ActiveCrop } from '@/types';

export default function MarketOptimization() {
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [activeCrops, setActiveCrops] = useState<ActiveCrop[]>([]);
  const [priceForecast, setPriceForecast] = useState<any[]>([]);

  useEffect(() => {
    const initializeData = () => {
      const crops: ActiveCrop[] = [
        { ...CROP_DATABASE[0], count: 850 },
        { ...CROP_DATABASE[1], count: 620 },
        { ...CROP_DATABASE[2], count: 450 },
        { ...CROP_DATABASE[3], count: 340 },
        { ...CROP_DATABASE[4], count: 280 },
        { ...CROP_DATABASE[5], count: 260 },
        { ...CROP_DATABASE[6], count: 220 },
        { ...CROP_DATABASE[7], count: 180 },
        { ...CROP_DATABASE[8], count: 100 },
        { ...CROP_DATABASE[9], count: 60 },
      ];
      setActiveCrops(crops);

      const prices: MarketPrice[] = [];
      crops.forEach((crop) => {
        const basePrice = crop.harvestWeight * (crop.pricePerKg || 10000);

        WHOLESALE_MARKETS.forEach((market) => {
          const currentPrice = basePrice * (0.85 + Math.random() * 0.3);
          prices.push({
            crop: crop.name,
            market: market.name,
            location: market.location,
            price: currentPrice,
            pricePerKg: currentPrice / crop.harvestWeight,
            change: -5 + Math.random() * 10,
            volume: Math.floor(1000 + Math.random() * 5000),
            timestamp: new Date(),
          });
        });
      });

      setMarketPrices(prices);

      // Generate price forecast for next 30 days (상추 기준)
      const forecast = [];
      const basePrice = 12000;
      for (let i = 0; i <= 30; i++) {
        forecast.push({
          날짜: `D+${i}`,
          예측가격: basePrice * (0.9 + Math.random() * 0.3 + Math.sin(i / 7) * 0.15),
          현재가격: i === 0 ? basePrice : undefined,
        });
      }
      setPriceForecast(forecast);
    };

    initializeData();
  }, []);

  // Calculate total revenue potential
  const totalRevenue = activeCrops.reduce(
    (sum, crop) => sum + crop.count * crop.harvestWeight * (crop.pricePerKg || 10000),
    0
  );

  const totalProduction = activeCrops.reduce(
    (sum, crop) => sum + crop.count * crop.harvestWeight,
    0
  );

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="예상 총 수익"
          value={formatNumber(Math.floor(totalRevenue / 10000))}
          unit="만원"
          icon={DollarSign}
          status="good"
          trend={5.2}
        />
        <MetricCard
          title="예상 총 생산량"
          value={formatNumber(totalProduction.toFixed(0))}
          unit="kg"
          icon={Package}
          status="good"
        />
        <MetricCard
          title="등록 시장"
          value={WHOLESALE_MARKETS.length}
          unit="곳"
          icon={BarChart3}
          status="good"
        />
        <MetricCard
          title="재배 작물"
          value={activeCrops.length}
          unit="종"
          icon={TrendingUp}
          status="good"
        />
      </div>

      {/* Market Prices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">도매시장 가격 정보</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">작물</th>
                <th className="text-left py-3 px-4">시장</th>
                <th className="text-left py-3 px-4">지역</th>
                <th className="text-right py-3 px-4">가격 (원/kg)</th>
                <th className="text-right py-3 px-4">변동률</th>
                <th className="text-right py-3 px-4">거래량 (kg)</th>
              </tr>
            </thead>
            <tbody>
              {marketPrices.slice(0, 20).map((price, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 px-4 font-semibold">{price.crop}</td>
                  <td className="py-3 px-4">{price.market}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {price.location}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {formatCurrency(Math.floor(price.pricePerKg))}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={
                        price.change > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {price.change > 0 ? '+' : ''}
                      {price.change.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-300">
                    {formatNumber(price.volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crop Profitability */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">작물별 수익성 분석</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCrops.map((crop) => {
            const expectedRevenue = crop.count * crop.harvestWeight * (crop.pricePerKg || 10000);
            const cost = crop.count * 500; // 개당 생산비용
            const profit = expectedRevenue - cost;
            const roi = ((profit / cost) * 100).toFixed(1);

            return (
              <div
                key={crop.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl">{crop.icon}</div>
                    <div className="font-semibold">{crop.name}</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {crop.count}주
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">예상 수익</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(Math.floor(expectedRevenue))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">생산 비용</span>
                    <span className="font-semibold">
                      {formatCurrency(cost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">순이익</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(Math.floor(profit))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-400">ROI</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      {roi}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Forecast Chart */}
      <TimeSeriesChart
        data={priceForecast}
        dataKeys={[
          { key: '예측가격', name: '예측 가격 (원/kg)', color: '#3b82f6' },
        ]}
        xAxisKey="날짜"
        title="상추 가격 예측 (30일)"
        height={300}
      />
    </div>
  );
}
