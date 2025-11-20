/**
 * Rack Detail View Component
 * 랙 상세 뷰 - 4층 x 28셀 원형 시각화
 */

'use client';

import React, { useState } from 'react';
import { X, Sprout, Droplet, ThermometerSun, Wind, Sun, TestTube } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Rack, Cell, Layer } from '@/types';

interface RackDetailViewProps {
  rack: Rack;
  houseName: string;
  onClose: () => void;
}

export default function RackDetailView({ rack, houseName, onClose }: RackDetailViewProps) {
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const currentLayer = rack.layers[activeLayer];

  // Calculate rack statistics
  const totalCells = rack.layers.reduce((sum, layer) => sum + layer.cells.length, 0);
  const activeCells = rack.layers.reduce(
    (sum, layer) => sum + layer.cells.filter((c) => c.crop).length,
    0
  );
  const avgGrowth = activeCells > 0
    ? rack.layers.reduce(
        (sum, layer) =>
          sum + layer.cells.filter((c) => c.crop).reduce((s, c) => s + (c.growthStage || 0), 0),
        0
      ) / activeCells
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">📍 {houseName}</div>
              <h2 className="text-2xl font-bold">
                Rack {rack.id} ({rack.type === 'fixed' ? 'Fixed' : rack.type === 'mobile-a' ? 'Mobile-A' : 'Mobile-B'})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs opacity-75">총 셀 수</div>
              <div className="text-2xl font-bold">{totalCells}개</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs opacity-75">활성 셀</div>
              <div className="text-2xl font-bold">{activeCells}개</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs opacity-75">평균 성장률</div>
              <div className="text-2xl font-bold">{avgGrowth.toFixed(0)}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs opacity-75">가동률</div>
              <div className="text-2xl font-bold">{((activeCells / totalCells) * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Layer Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {rack.layers.map((layer, idx) => {
              const layerActiveCells = layer.cells.filter((c) => c.crop).length;
              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(idx)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeLayer === idx
                      ? 'bg-emerald-500 text-white shadow-lg scale-105'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <div className="text-sm">{layer.level}층</div>
                  <div className="text-xs opacity-75">
                    {layerActiveCells}/{layer.cells.length}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cell Grid - 7 columns x 4 rows */}
          <div className="grid grid-cols-7 gap-3 mb-6">
            {currentLayer.cells.map((cell) => {
              const statusColor = cell.crop
                ? cell.growthStage! >= 80
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : cell.growthStage! >= 60
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : cell.growthStage! >= 40
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50';

              return (
                <button
                  key={cell.id}
                  onClick={() => setSelectedCell(cell)}
                  className={`aspect-square rounded-full border-4 ${statusColor}
                    hover:scale-110 hover:shadow-lg transition-all duration-200
                    flex flex-col items-center justify-center p-2 relative group`}
                >
                  {cell.crop ? (
                    <>
                      <div className="text-2xl mb-1">{cell.crop.icon}</div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {cell.growthStage?.toFixed(0)}%
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </>
                  ) : (
                    <div className="text-slate-400 dark:text-slate-500 text-xs">Empty</div>
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Cell {cell.position}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" />
              <span>수확준비 (80%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-4 border-green-500 bg-green-50 dark:bg-green-900/20" />
              <span>후기 (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" />
              <span>중기 (40-59%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20" />
              <span>초기 (40% 미만)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-4 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50" />
              <span>비어있음</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cell Detail Modal */}
      {selectedCell && (
        <CellDetailModal cell={selectedCell} onClose={() => setSelectedCell(null)} />
      )}
    </div>
  );
}

// Cell Detail Modal Component
function CellDetailModal({ cell, onClose }: { cell: Cell; onClose: () => void }) {
  if (!cell.crop) {
    return (
      <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-md">
          <div className="text-center text-slate-500">
            <Sprout className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>이 셀은 비어있습니다</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const plantDate = new Date();
  plantDate.setDate(plantDate.getDate() - (cell.crop.cycle * (cell.growthStage || 0)) / 100);

  const harvestDate = new Date(plantDate);
  harvestDate.setDate(harvestDate.getDate() + cell.crop.cycle);

  const daysUntilHarvest = Math.ceil(
    (harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Mock sensor data for this cell
  const temp = 18 + Math.random() * 5;
  const humidity = 60 + Math.random() * 15;
  const ph = 5.8 + Math.random() * 0.8;
  const ec = 1.2 + Math.random() * 0.8;
  const lux = 10000 + Math.random() * 5000;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 text-white rounded-t-xl"
          style={{ backgroundColor: cell.crop.color }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{cell.crop.icon}</div>
              <div>
                <h3 className="text-2xl font-bold">{cell.crop.name}</h3>
                <p className="text-sm opacity-90">Cell {cell.position}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Growth Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                성장률
              </span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {cell.growthStage?.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                style={{ width: `${cell.growthStage}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              단계: {cell.growthStage! >= 80 ? '수확준비' : cell.growthStage! >= 60 ? '후기생장' : cell.growthStage! >= 40 ? '중기생장' : cell.growthStage! >= 20 ? '초기생장' : '발아'}
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">파종일</div>
              <div className="font-semibold">{formatDate(plantDate)}</div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">수확 예정</div>
              <div className="font-semibold">
                {formatDate(harvestDate)}
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {daysUntilHarvest > 0 ? `${daysUntilHarvest}일 후` : '오늘'}
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Data */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <ThermometerSun className="w-4 h-4 mr-2" />
              환경 데이터
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-slate-600 dark:text-slate-400">온도</span>
                <span className="font-semibold">{temp.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-slate-600 dark:text-slate-400">습도</span>
                <span className="font-semibold">{humidity.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-slate-600 dark:text-slate-400">pH</span>
                <span className="font-semibold">{ph.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                <span className="text-slate-600 dark:text-slate-400">EC</span>
                <span className="font-semibold">{ec.toFixed(2)} mS/cm</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded col-span-2">
                <span className="text-slate-600 dark:text-slate-400">조도</span>
                <span className="font-semibold">{lux.toFixed(0)} lux</span>
              </div>
            </div>
          </div>

          {/* Expected Harvest */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
            <h4 className="font-semibold mb-2 text-emerald-900 dark:text-emerald-100">
              예상 수확량
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600 dark:text-slate-400">무게</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {cell.crop.harvestWeight.toFixed(1)} kg
                </div>
              </div>
              <div>
                <div className="text-slate-600 dark:text-slate-400">예상 가격</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {(cell.crop.harvestWeight * (cell.crop.pricePerKg || 10000)).toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors">
              성장 이력 보기
            </button>
            <button className="flex-1 py-2 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-semibold transition-colors">
              센서 차트
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
