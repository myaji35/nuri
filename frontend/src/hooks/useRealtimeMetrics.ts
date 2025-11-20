/**
 * Realtime Metrics Hook
 * 실시간 메트릭 데이터 시뮬레이션 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { RealtimeMetrics } from '@/types';
import { UPDATE_INTERVALS } from '@/lib/constants';

export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    temperature: 20.5,
    humidity: 68,
    co2: 1050,
    light: 15000,
    ph: 6.2,
    ec: 1.8,
    power: 450,
    water: 1200,
    timestamp: new Date(),
  });

  const updateMetrics = useCallback(() => {
    setMetrics((prev) => ({
      temperature: 18 + Math.random() * 7,
      humidity: 60 + Math.random() * 20,
      co2: 800 + Math.random() * 400,
      light: 10000 + Math.random() * 10000,
      ph: 5.5 + Math.random() * 1.5,
      ec: 1.0 + Math.random() * 2.0,
      power: 400 + Math.random() * 100,
      water: 1000 + Math.random() * 400,
      timestamp: new Date(),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, UPDATE_INTERVALS.REALTIME_METRICS);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return metrics;
}
