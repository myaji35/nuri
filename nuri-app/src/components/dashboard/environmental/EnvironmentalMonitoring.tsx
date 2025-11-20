/**
 * Environmental Monitoring Dashboard Component
 * 환경 모니터링 대시보드
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ThermometerSun, Droplet, Wind, Sun, TestTube } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import TimeSeriesChart from '@/components/common/TimeSeriesChart';
import { CROP_DATABASE, METRIC_THRESHOLDS } from '@/lib/constants';
import { getMetricStatus } from '@/lib/utils';
import type { SensorReading, EnvironmentalData, ActiveCrop } from '@/types';

export default function EnvironmentalMonitoring() {
  const [sensorData, setSensorData] = useState<EnvironmentalData | null>(null);
  const [activeCrops, setActiveCrops] = useState<ActiveCrop[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  useEffect(() => {
    // Initialize sensor data for 5 houses
    const initializeData = () => {
      const tempData: SensorReading[] = [];
      const humData: SensorReading[] = [];
      const phData: SensorReading[] = [];
      const ecData: SensorReading[] = [];
      const co2Data: SensorReading[] = [];
      const luxData: SensorReading[] = [];

      for (let house = 1; house <= 5; house++) {
        const temp = 18 + Math.random() * 5;
        tempData.push({
          house,
          value: temp,
          target: 20,
          status: getMetricStatus(temp, 'temperature'),
        });

        const hum = 60 + Math.random() * 15;
        humData.push({
          house,
          value: hum,
          target: 70,
          status: getMetricStatus(hum, 'humidity'),
        });

        const ph = 5.8 + Math.random() * 0.8;
        phData.push({
          house,
          value: ph,
          target: 6.2,
          status: getMetricStatus(ph, 'ph'),
        });

        const ec = 1.2 + Math.random() * 0.8;
        ecData.push({
          house,
          value: ec,
          target: 1.6,
          status: getMetricStatus(ec, 'ec'),
        });

        const co2 = 800 + Math.random() * 400;
        co2Data.push({
          house,
          value: co2,
          target: 1000,
          status: getMetricStatus(co2, 'co2'),
        });

        const lux = 10000 + Math.random() * 5000;
        luxData.push({
          house,
          value: lux,
          target: 12000,
          status: getMetricStatus(lux, 'lux'),
        });
      }

      setSensorData({
        temperature: tempData,
        humidity: humData,
        ph: phData,
        ec: ecData,
        co2: co2Data,
        lux: luxData,
      });

      // Initialize active crops
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

      // Generate time series data (last 24 hours)
      const now = new Date();
      const tsData = [];
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        tsData.push({
          time: `${time.getHours()}:00`,
          온도: 18 + Math.random() * 5,
          습도: 60 + Math.random() * 15,
          CO2: 800 + Math.random() * 400,
        });
      }
      setTimeSeriesData(tsData);
    };

    initializeData();

    // Update every 10 seconds
    const interval = setInterval(initializeData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!sensorData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">센서 데이터 로딩 중...</div>
      </div>
    );
  }

  // Calculate averages
  const avgTemp = (sensorData.temperature.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(1);
  const avgHum = (sensorData.humidity.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(1);
  const avgCO2 = (sensorData.co2.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(0);
  const avgLux = (sensorData.lux.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(0);
  const avgPH = (sensorData.ph.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(2);
  const avgEC = (sensorData.ec.reduce((sum, s) => sum + s.value, 0) / 5).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Average Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="평균 온도"
          value={avgTemp}
          unit="°C"
          icon={ThermometerSun}
          status="good"
        />
        <MetricCard
          title="평균 습도"
          value={avgHum}
          unit="%"
          icon={Droplet}
          status="good"
        />
        <MetricCard
          title="평균 CO₂"
          value={avgCO2}
          unit="ppm"
          icon={Wind}
          status="good"
        />
        <MetricCard
          title="평균 조도"
          value={avgLux}
          unit="lux"
          icon={Sun}
          status="good"
        />
        <MetricCard
          title="평균 pH"
          value={avgPH}
          unit=""
          icon={TestTube}
          status="good"
        />
        <MetricCard
          title="평균 EC"
          value={avgEC}
          unit="mS/cm"
          icon={TestTube}
          status="good"
        />
      </div>

      {/* House-wise Sensor Data */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">하우스별 센서 데이터</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4">하우스</th>
                <th className="text-center py-3 px-4">온도 (°C)</th>
                <th className="text-center py-3 px-4">습도 (%)</th>
                <th className="text-center py-3 px-4">CO₂ (ppm)</th>
                <th className="text-center py-3 px-4">조도 (lux)</th>
                <th className="text-center py-3 px-4">pH</th>
                <th className="text-center py-3 px-4">EC (mS/cm)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((house) => (
                <tr
                  key={house}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                >
                  <td className="py-3 px-4 font-semibold">하우스 {house}</td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.temperature[house - 1].status)}>
                      {sensorData.temperature[house - 1].value.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.humidity[house - 1].status)}>
                      {sensorData.humidity[house - 1].value.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.co2[house - 1].status)}>
                      {sensorData.co2[house - 1].value.toFixed(0)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.lux[house - 1].status)}>
                      {sensorData.lux[house - 1].value.toFixed(0)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.ph[house - 1].status)}>
                      {sensorData.ph[house - 1].value.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <span className={getStatusColor(sensorData.ec[house - 1].status)}>
                      {sensorData.ec[house - 1].value.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Crops */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">재배 중인 작물</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {activeCrops.map((crop) => (
            <div
              key={crop.id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
              style={{ borderLeftWidth: '4px', borderLeftColor: crop.color }}
            >
              <div className="text-2xl mb-1">{crop.icon}</div>
              <div className="font-semibold">{crop.name}</div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                {crop.count}주
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                온도: {crop.temp[0]}-{crop.temp[1]}°C
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 gap-6">
        <TimeSeriesChart
          data={timeSeriesData}
          dataKeys={[
            { key: '온도', name: '온도 (°C)', color: '#ef4444' },
            { key: '습도', name: '습도 (%)', color: '#3b82f6' },
          ]}
          title="온도/습도 시계열 데이터 (24시간)"
          height={250}
        />
        <TimeSeriesChart
          data={timeSeriesData}
          dataKeys={[
            { key: 'CO2', name: 'CO₂ (ppm)', color: '#10b981' },
          ]}
          title="CO₂ 농도 변화 (24시간)"
          height={250}
        />
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'normal':
      return 'text-green-600 dark:text-green-400 font-semibold';
    case 'warning':
      return 'text-amber-600 dark:text-amber-400 font-semibold';
    case 'critical':
      return 'text-red-600 dark:text-red-400 font-semibold';
    default:
      return 'text-slate-600 dark:text-slate-300';
  }
}
