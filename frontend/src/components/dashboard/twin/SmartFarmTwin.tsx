/**
 * Smart Farm Digital Twin Component
 * 스마트팜 디지털 트윈 - 3D 시각화 포함
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Activity, Zap, BarChart3, Settings } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import { CROP_DATABASE, FARM_CONFIG } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import type { FarmStructure, House, Rack, Layer, Cell } from '@/types';

// Dynamic import for 3D components (client-side only)
const FarmScene3D = dynamic(() => import('./FarmScene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl flex items-center justify-center">
      <div className="text-white">3D 씬 로딩 중...</div>
    </div>
  ),
});

const RackDetail3D = dynamic(() => import('./RackDetail3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl flex items-center justify-center">
      <div className="text-white">랙 3D 로딩 중...</div>
    </div>
  ),
});

export default function SmartFarmTwin() {
  const [farmStructure, setFarmStructure] = useState<FarmStructure | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [systemHealth, setSystemHealth] = useState(95);
  const [powerConsumption, setPowerConsumption] = useState(450);
  const [waterUsage, setWaterUsage] = useState(1200);

  useEffect(() => {
    // Initialize farm structure
    const initializeFarm = () => {
      const houses: House[] = [];

      for (let h = 1; h <= FARM_CONFIG.TOTAL_HOUSES; h++) {
        const racks: Rack[] = [];

        for (let r = 1; r <= FARM_CONFIG.RACKS_PER_HOUSE; r++) {
          const layers: Layer[] = [];
          const rackType =
            r === 1 || r === 6 ? 'fixed' : r === 2 || r === 3 ? 'mobile-a' : 'mobile-b';

          for (let l = 1; l <= FARM_CONFIG.LAYERS_PER_RACK; l++) {
            const cells: Cell[] = [];

            for (let c = 1; c <= FARM_CONFIG.CELLS_PER_LAYER; c++) {
              const crop =
                CROP_DATABASE[Math.floor(Math.random() * CROP_DATABASE.length)];
              const isActive = Math.random() > 0.02;

              cells.push({
                id: `H${h}-R${r}-L${l}-C${c}`,
                position: c,
                column: c,
                crop: isActive ? crop : undefined,
                growthStage: isActive ? Math.random() * 100 : undefined,
                health: isActive ? 85 + Math.random() * 15 : 0,
                isActive: isActive,
                temperature: 18 + Math.random() * 7,
                humidity: 60 + Math.random() * 20,
                ph: 5.5 + Math.random() * 1.3,
                ec: 1.0 + Math.random() * 1.5,
              });
            }

            layers.push({
              id: l,
              level: l,
              cells: cells,
              activeCells: cells.filter((c) => c.isActive).length,
            });
          }

          racks.push({
            id: r,
            type: rackType,
            layers: layers,
            activeLayers: layers.length,
            totalCells:
              FARM_CONFIG.CELLS_PER_LAYER * FARM_CONFIG.LAYERS_PER_RACK,
            activeCells: layers.reduce((sum, layer) => sum + layer.activeCells, 0),
          });
        }

        const houseActiveCells = racks.reduce(
          (sum, rack) => sum + rack.activeCells,
          0
        );

        houses.push({
          id: h,
          name: `하우스 ${h}`,
          racks: racks,
          totalLayers:
            FARM_CONFIG.RACKS_PER_HOUSE * FARM_CONFIG.LAYERS_PER_RACK,
          totalCells:
            FARM_CONFIG.RACKS_PER_HOUSE *
            FARM_CONFIG.LAYERS_PER_RACK *
            FARM_CONFIG.CELLS_PER_LAYER,
          activeCells: houseActiveCells,
          temperature: 18 + Math.random() * 7,
          humidity: 60 + Math.random() * 20,
          co2: 800 + Math.random() * 400,
          light: 10000 + Math.random() * 5000,
        });
      }

      const totalActiveCells = houses.reduce(
        (sum, house) => sum + house.activeCells,
        0
      );

      setFarmStructure({
        name: '누리팜 스마트팜',
        totalHouses: FARM_CONFIG.TOTAL_HOUSES,
        totalRacks: FARM_CONFIG.TOTAL_HOUSES * FARM_CONFIG.RACKS_PER_HOUSE,
        totalLayers:
          FARM_CONFIG.TOTAL_HOUSES *
          FARM_CONFIG.RACKS_PER_HOUSE *
          FARM_CONFIG.LAYERS_PER_RACK,
        totalCells: FARM_CONFIG.TOTAL_CELLS,
        activeCells: totalActiveCells,
        houses: houses,
      });
    };

    initializeFarm();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemHealth(94 + Math.random() * 4);
      setPowerConsumption(430 + Math.random() * 40);
      setWaterUsage(1150 + Math.random() * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!farmStructure) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">데이터 로딩 중...</div>
      </div>
    );
  }

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
          value={formatNumber(farmStructure.activeCells || 0)}
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

      {/* 3D Farm Visualization */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">3D 농장 디지털 트윈</h3>
          {selectedHouse && (
            <button
              onClick={() => setSelectedHouse(null)}
              className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              전체 뷰로 돌아가기
            </button>
          )}
        </div>
        <Suspense
          fallback={
            <div className="w-full h-[600px] bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
          }
        >
          <FarmScene3D
            houses={farmStructure.houses}
            onHouseClick={setSelectedHouse}
            selectedHouse={selectedHouse}
          />
        </Suspense>
      </div>

      {/* Rack Detail 3D View */}
      {selectedHouse && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold mb-4">
            {farmStructure.houses[selectedHouse - 1].name} - 랙 시스템 3D
          </h3>
          <Suspense
            fallback={
              <div className="w-full h-[500px] bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
            }
          >
            <RackDetail3D
              racks={farmStructure.houses[selectedHouse - 1].racks}
              houseName={farmStructure.houses[selectedHouse - 1].name}
            />
          </Suspense>
        </div>
      )}

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
            {
              time: '10:35:22',
              event: 'Hoist 3 이동 완료 - Rack 4 → Rack 5',
              type: 'success',
            },
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
