/**
 * Dashboard State Management Store (Zustand)
 * 대시보드 전역 상태 관리
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  DashboardTab,
  ViewMode,
  FarmStructure,
  RealtimeMetrics,
  Equipment,
  Alert,
} from '@/types';

interface DashboardState {
  // UI State
  activeTab: DashboardTab;
  viewMode: ViewMode;
  selectedHouse: number | null;
  selectedRack: number | null;
  selectedLayer: number | null;
  selectedCell: string | null;
  showEquipment: boolean;
  showSensors: boolean;

  // Data State
  farmStructure: FarmStructure | null;
  realtimeMetrics: RealtimeMetrics | null;
  equipment: Equipment[];
  alerts: Alert[];

  // Date Range
  dateRange: {
    start: Date;
    end: Date;
  };

  // Actions
  setActiveTab: (tab: DashboardTab) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedHouse: (house: number | null) => void;
  setSelectedRack: (rack: number | null) => void;
  setSelectedLayer: (layer: number | null) => void;
  setSelectedCell: (cell: string | null) => void;
  toggleEquipment: () => void;
  toggleSensors: () => void;

  updateFarmStructure: (farm: FarmStructure) => void;
  updateRealtimeMetrics: (metrics: RealtimeMetrics) => void;
  updateEquipment: (equipment: Equipment[]) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;

  setDateRange: (start: Date, end: Date) => void;
  resetSelection: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      // Initial State
      activeTab: 'facility',
      viewMode: 'overview',
      selectedHouse: null,
      selectedRack: null,
      selectedLayer: null,
      selectedCell: null,
      showEquipment: true,
      showSensors: true,

      farmStructure: null,
      realtimeMetrics: null,
      equipment: [],
      alerts: [],

      dateRange: {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        end: new Date(),
      },

      // UI Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSelectedHouse: (house) =>
        set({
          selectedHouse: house,
          selectedRack: null,
          selectedLayer: null,
          selectedCell: null,
          viewMode: house ? 'house' : 'overview',
        }),

      setSelectedRack: (rack) =>
        set({
          selectedRack: rack,
          selectedLayer: null,
          selectedCell: null,
          viewMode: rack ? 'rack' : 'house',
        }),

      setSelectedLayer: (layer) =>
        set({
          selectedLayer: layer,
          selectedCell: null,
          viewMode: layer ? 'layer' : 'rack',
        }),

      setSelectedCell: (cell) =>
        set({
          selectedCell: cell,
          viewMode: cell ? 'cell' : 'layer',
        }),

      toggleEquipment: () =>
        set((state) => ({ showEquipment: !state.showEquipment })),

      toggleSensors: () =>
        set((state) => ({ showSensors: !state.showSensors })),

      // Data Actions
      updateFarmStructure: (farm) =>
        set({ farmStructure: farm }),

      updateRealtimeMetrics: (metrics) =>
        set({ realtimeMetrics: metrics }),

      updateEquipment: (equipment) =>
        set({ equipment }),

      addAlert: (alert) =>
        set((state) => ({
          alerts: [alert, ...state.alerts],
        })),

      acknowledgeAlert: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId
              ? { ...alert, acknowledged: true }
              : alert
          ),
        })),

      clearAlerts: () => set({ alerts: [] }),

      setDateRange: (start, end) =>
        set({ dateRange: { start, end } }),

      resetSelection: () =>
        set({
          selectedHouse: null,
          selectedRack: null,
          selectedLayer: null,
          selectedCell: null,
          viewMode: 'overview',
        }),
    }),
    {
      name: 'dashboard-store',
    }
  )
);
