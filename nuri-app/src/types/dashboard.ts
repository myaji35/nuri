/**
 * Dashboard and UI Type Definitions
 * 대시보드 및 UI 타입 정의
 */

import { LucideIcon } from 'lucide-react';

export type DashboardTab =
  | 'facility'
  | 'twin'
  | 'environmental'
  | 'market'
  | 'crop';

export interface TabConfig {
  id: DashboardTab;
  name: string;
  icon: LucideIcon;
  description?: string;
}

export type ViewMode = 'overview' | 'house' | 'rack' | 'layer' | 'cell';

export interface DashboardState {
  activeTab: DashboardTab;
  viewMode: ViewMode;
  selectedHouse: number | null;
  selectedRack: number | null;
  selectedLayer: number | null;
  selectedCell: string | null;
  showEquipment: boolean;
  showSensors: boolean;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface MetricCard {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: number; // percentage change
  status?: 'good' | 'warning' | 'critical';
  description?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}
