/**
 * Metrics and Sensor Data Type Definitions
 * 메트릭 및 센서 데이터 타입 정의
 */

export type MetricStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface SensorReading {
  house: number;
  value: number;
  target: number;
  status: MetricStatus;
  timestamp?: Date;
}

export interface RealtimeMetrics {
  temperature: number;
  humidity: number;
  co2: number;
  light: number;
  ph: number;
  ec: number;
  power: number;
  water: number;
  timestamp?: Date;
}

export interface EnvironmentalData {
  temperature: SensorReading[];
  humidity: SensorReading[];
  ph: SensorReading[];
  ec: SensorReading[];
  co2: SensorReading[];
  lux: SensorReading[];
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'hoist' | 'avg' | 'mobile-rack' | 'hvac' | 'irrigation' | 'lighting';
  status: 'active' | 'idle' | 'maintenance' | 'error';
  position?: {
    x: number;
    y: number;
    z: number;
  };
  targetPosition?: {
    x: number;
    y: number;
    z: number;
  };
  speed?: number;
  battery?: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

export interface Hoist extends Equipment {
  type: 'hoist';
  house: number;
  currentRack?: number;
  targetRack?: number;
  carryingLoad: boolean;
}

export interface AVG extends Equipment {
  type: 'avg';
  house: number;
  route?: string[];
  cargoType?: string;
}

export interface MobileRack extends Equipment {
  type: 'mobile-rack';
  house: number;
  rackId: number;
  isOpen: boolean;
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  source: string; // e.g., "House 1 - Rack 3"
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}
