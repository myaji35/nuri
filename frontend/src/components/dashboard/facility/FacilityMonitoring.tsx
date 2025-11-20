/**
 * Facility Monitoring Dashboard Component
 * 시설 모니터링 대시보드
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Droplet, ThermometerSun, Wind, AlertTriangle } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import RackDetailView from './RackDetailView';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { CROP_DATABASE, FARM_CONFIG } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import type { FarmStructure, House, Rack, Layer, Cell } from '@/types';

export default function FacilityMonitoring() {
  const [farmStructure, setFarmStructure] = useState<FarmStructure | null>(null);
  const [selectedRack, setSelectedRack] = useState<{ rack: Rack; houseName: string } | null>(null);
  const selectedHouse = useDashboardStore((state) => state.selectedHouse);
  const setSelectedHouse = useDashboardStore((state) => state.setSelectedHouse);

  useEffect(() => {
    // Initialize farm structure
    const initializeFarm = () => {
      const houses: House[] = [];

      for (let h = 1; h <= FARM_CONFIG.TOTAL_HOUSES; h++) {
        const racks: Rack[] = [];

        for (let r = 1; r <= FARM_CONFIG.RACKS_PER_HOUSE; r++) {
          const layers: Layer[] = [];
          const rackType = r === 1 || r === 6 ? 'fixed' : r === 2 || r === 3 ? 'mobile-a' : 'mobile-b';

          for (let l = 1; l <= FARM_CONFIG.LAYERS_PER_RACK; l++) {
            const cells: Cell[] = [];

            for (let c = 1; c <= FARM_CONFIG.CELLS_PER_LAYER; c++) {
              const crop = CROP_DATABASE[Math.floor(Math.random() * CROP_DATABASE.length)];
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
            totalCells: FARM_CONFIG.CELLS_PER_LAYER * FARM_CONFIG.LAYERS_PER_RACK,
            activeCells: layers.reduce((sum, layer) => sum + layer.activeCells, 0),
          });
        }

        const houseActiveCells = racks.reduce((sum, rack) => sum + rack.activeCells, 0);

        houses.push({
          id: h,
          name: `하우스 ${h}`,
          racks: racks,
          totalLayers: FARM_CONFIG.RACKS_PER_HOUSE * FARM_CONFIG.LAYERS_PER_RACK,
          totalCells: FARM_CONFIG.RACKS_PER_HOUSE * FARM_CONFIG.LAYERS_PER_RACK * FARM_CONFIG.CELLS_PER_LAYER,
          activeCells: houseActiveCells,
          temperature: 18 + Math.random() * 7,
          humidity: 60 + Math.random() * 20,
          co2: 800 + Math.random() * 400,
          light: 10000 + Math.random() * 5000,
        });
      }

      const totalActiveCells = houses.reduce((sum, house) => sum + house.activeCells, 0);

      setFarmStructure({
        name: '누리팜 스마트팜',
        totalHouses: FARM_CONFIG.TOTAL_HOUSES,
        totalRacks: FARM_CONFIG.TOTAL_HOUSES * FARM_CONFIG.RACKS_PER_HOUSE,
        totalLayers: FARM_CONFIG.TOTAL_HOUSES * FARM_CONFIG.RACKS_PER_HOUSE * FARM_CONFIG.LAYERS_PER_RACK,
        totalCells: FARM_CONFIG.TOTAL_CELLS,
        activeCells: totalActiveCells,
        houses: houses,
      });
    };

    initializeFarm();
  }, []);

  if (!farmStructure) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">데이터 로딩 중...</div>
      </div>
    );
  }

  const utilizationRate = ((farmStructure.activeCells! / farmStructure.totalCells) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="전체 셀 수"
          value={formatNumber(farmStructure.totalCells)}
          unit="개"
          icon={Activity}
          status="good"
        />
        <MetricCard
          title="활성 셀"
          value={formatNumber(farmStructure.activeCells!)}
          unit="개"
          icon={Activity}
          status="good"
          description={`가동률 ${utilizationRate}%`}
        />
        <MetricCard
          title="총 랙 수"
          value={formatNumber(farmStructure.totalRacks)}
          unit="개"
          icon={Activity}
          status="good"
        />
        <MetricCard
          title="하우스 수"
          value={formatNumber(farmStructure.totalHouses)}
          unit="동"
          icon={Activity}
          status="good"
        />
      </div>

      {/* House Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-xl font-bold mb-4">하우스 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {farmStructure.houses.map((house) => (
            <button
              key={house.id}
              onClick={() => setSelectedHouse(selectedHouse === house.id ? null : house.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedHouse === house.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
              }`}
            >
              <div className="text-lg font-bold mb-2">{house.name}</div>
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center">
                  <ThermometerSun className="w-4 h-4 mr-1" />
                  {house.temperature?.toFixed(1)}°C
                </div>
                <div className="flex items-center">
                  <Droplet className="w-4 h-4 mr-1" />
                  {house.humidity?.toFixed(1)}%
                </div>
                <div className="flex items-center">
                  <Wind className="w-4 h-4 mr-1" />
                  {house.co2?.toFixed(0)} ppm
                </div>
                <div className="text-xs font-semibold text-green-600 dark:text-green-400 mt-2">
                  {house.activeCells} / {house.totalCells} 활성
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected House Details */}
      {selectedHouse && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-xl font-bold mb-4">
            하우스 {selectedHouse} - 랙 구조
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {farmStructure.houses[selectedHouse - 1].racks.map((rack) => (
              <button
                key={rack.id}
                onClick={() =>
                  setSelectedRack({
                    rack,
                    houseName: `하우스 ${selectedHouse}`,
                  })
                }
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="font-semibold mb-2">Rack {rack.id}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>타입: {rack.type}</div>
                  <div>레이어: {rack.layers.length}개</div>
                  <div className="text-green-600 dark:text-green-400 font-semibold">
                    {rack.activeCells} / {rack.totalCells}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rack Detail View */}
      {selectedRack && (
        <RackDetailView
          rack={selectedRack.rack}
          houseName={selectedRack.houseName}
          onClose={() => setSelectedRack(null)}
        />
      )}
    </div>
  );
}
