/**
 * Smart Farm Digital Twin Component
 * 스마트팜 디지털 트윈
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Zap, BarChart3, Settings } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import { FARM_CONFIG } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';

export default function SmartFarmTwin() {
  const [systemHealth, setSystemHealth] = useState(95);
  const [activeCells, setActiveCells] = useState(3290);
  const [powerConsumption, setPowerConsumption] = useState(450);
  const [waterUsage, setWaterUsage] = useState(1200);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemHealth(94 + Math.random() * 4);
      setPowerConsumption(430 + Math.random() * 40);
      setWaterUsage(1150 + Math.random() * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="시스템 건강도"
          value={systemHealth.toFixed(1)}
          unit="%"
          icon={Activity}
          status="good"
          trend={0.5}
        />
        <MetricCard
          title="활성 셀"
          value={formatNumber(activeCells)}
          unit={`/ ${formatNumber(FARM_CONFIG.TOTAL_CELLS)}`}
          icon={BarChart3}
          status="good"
        />
        <MetricCard
          title="전력 소비"
          value={formatNumber(powerConsumption.toFixed(0))}
          unit="kW"
          icon={Zap}
          status="good"
          trend={-2.3}
        />
        <MetricCard
          title="물 사용량"
          value={formatNumber(waterUsage.toFixed(0))}
          unit="L/h"
          icon={Settings}
          status="good"
          trend={1.2}
        />
      </div>

      {/* 3D Visualization Placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">3D 농장 뷰</h3>
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏭</div>
            <div className="text-lg font-semibold text-slate-600 dark:text-slate-300">
              3D 디지털 트윈 뷰
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Three.js 3D 시각화가 여기에 표시됩니다
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-semibold mb-3">호이스트 상태</h4>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((id) => (
              <div key={id} className="flex items-center justify-between">
                <span className="text-sm">Hoist {id}</span>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                  정상
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-semibold mb-3">AVG 로봇 상태</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((id) => (
              <div key={id} className="flex items-center justify-between">
                <span className="text-sm">AVG {id}</span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                  작동중
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h4 className="font-semibold mb-3">이동식 랙 상태</h4>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="flex items-center justify-between">
                <span className="text-sm">Rack {id}</span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
                  대기
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Log */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">실시간 활동 로그</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { time: '10:35:22', event: 'Hoist 3 이동 완료 - Rack 4 → Rack 5', type: 'success' },
            { time: '10:34:15', event: 'AVG 2 자동 관수 시작 - House 2', type: 'info' },
            { time: '10:33:48', event: '환경 센서 데이터 업데이트 완료', type: 'info' },
            { time: '10:32:10', event: '이동식 Rack 2 위치 조정', type: 'success' },
            { time: '10:30:55', event: 'LED 조명 자동 조절 - House 3', type: 'info' },
          ].map((log, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700/30"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {log.time}
              </span>
              <span className="text-sm flex-1">{log.event}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  log.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}
              >
                {log.type === 'success' ? '완료' : '진행중'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
