/**
 * Farm Structure Type Definitions
 * 농장 구조 타입 정의
 */

export interface CropType {
  id: number;
  name: string;
  nameEn?: string;
  temp: [number, number]; // [min, max]
  humidity: [number, number];
  pH: [number, number];
  EC: [number, number];
  lux: [number, number];
  color: string;
  icon?: string;
  cycle: number; // 재배 주기 (일)
  harvestWeight: number; // kg
  pricePerKg?: number;
  price?: number;
}

export interface Cell {
  id: string; // H1-R1-L1-C1 형식
  position: number; // 셀 위치 (1-28)
  column: number;
  crop?: CropType;
  growthStage?: number; // 0-100
  health: number; // 0-100
  isActive: boolean;
  temperature: number;
  humidity: number;
  ph: number;
  ec: number;
  plantDate?: Date;
  expectedHarvestDate?: Date;
}

export interface Layer {
  id: number;
  level: number; // 층 번호 (1-4)
  cells: Cell[];
  activeCells: number;
}

export interface Rack {
  id: number;
  type: 'fixed' | 'mobile-a' | 'mobile-b';
  layers: Layer[];
  activeLayers: number;
  totalCells: number;
  activeCells: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  isMoving?: boolean;
}

export interface House {
  id: number;
  name: string;
  racks: Rack[];
  totalLayers: number;
  totalCells: number;
  activeCells: number;
  temperature?: number;
  humidity?: number;
  co2?: number;
  light?: number;
}

export interface FarmStructure {
  name: string;
  totalHouses: number;
  totalRacks: number;
  totalLayers: number;
  totalCells: number;
  activeCells?: number;
  houses: House[];
}
