/**
 * Application Constants
 * 애플리케이션 상수 정의
 */

import { CropType } from '@/types';

/**
 * 작물 데이터베이스
 * 모든 대시보드에서 공통으로 사용되는 10개 작물 정보
 */
export const CROP_DATABASE: CropType[] = [
  {
    id: 1,
    name: '상추',
    nameEn: 'Lettuce',
    temp: [18, 23],
    humidity: [60, 75],
    pH: [5.8, 6.3],
    EC: [1.2, 1.8],
    lux: [10000, 15000],
    color: '#10b981',
    icon: '🥬',
    cycle: 28,
    harvestWeight: 0.15,
    pricePerKg: 12000,
    price: 12000
  },
  {
    id: 2,
    name: '청경채',
    nameEn: 'Bok Choy',
    temp: [16, 22],
    humidity: [65, 80],
    pH: [6.0, 6.5],
    EC: [1.5, 2.0],
    lux: [12000, 18000],
    color: '#22c55e',
    icon: '🥬',
    cycle: 35,
    harvestWeight: 0.25,
    pricePerKg: 10000,
    price: 10000
  },
  {
    id: 3,
    name: '케일',
    nameEn: 'Kale',
    temp: [15, 20],
    humidity: [60, 75],
    pH: [6.0, 6.8],
    EC: [1.8, 2.5],
    lux: [15000, 20000],
    color: '#84cc16',
    icon: '🥬',
    cycle: 45,
    harvestWeight: 0.30,
    pricePerKg: 15000,
    price: 15000
  },
  {
    id: 4,
    name: '루꼴라',
    nameEn: 'Arugula',
    temp: [16, 21],
    humidity: [55, 70],
    pH: [6.0, 7.0],
    EC: [1.6, 2.2],
    lux: [11000, 16000],
    color: '#65a30d',
    icon: '🌿',
    cycle: 25,
    harvestWeight: 0.12,
    pricePerKg: 18000,
    price: 18000
  },
  {
    id: 5,
    name: '바질',
    nameEn: 'Basil',
    temp: [20, 25],
    humidity: [65, 75],
    pH: [5.5, 6.5],
    EC: [1.4, 2.0],
    lux: [14000, 18000],
    color: '#16a34a',
    icon: '🌿',
    cycle: 40,
    harvestWeight: 0.20,
    pricePerKg: 20000,
    price: 20000
  },
  {
    id: 6,
    name: '민트',
    nameEn: 'Mint',
    temp: [18, 24],
    humidity: [60, 70],
    pH: [6.0, 7.0],
    EC: [1.8, 2.4],
    lux: [10000, 14000],
    color: '#059669',
    icon: '🌿',
    cycle: 30,
    harvestWeight: 0.18,
    pricePerKg: 22000,
    price: 22000
  },
  {
    id: 7,
    name: '시금치',
    nameEn: 'Spinach',
    temp: [15, 20],
    humidity: [65, 75],
    pH: [6.5, 7.0],
    EC: [1.8, 2.3],
    lux: [12000, 16000],
    color: '#0d9488',
    icon: '🥬',
    cycle: 32,
    harvestWeight: 0.22,
    pricePerKg: 9000,
    price: 9000
  },
  {
    id: 8,
    name: '파슬리',
    nameEn: 'Parsley',
    temp: [18, 22],
    humidity: [60, 75],
    pH: [6.0, 7.0],
    EC: [1.6, 2.0],
    lux: [13000, 17000],
    color: '#0891b2',
    icon: '🌿',
    cycle: 38,
    harvestWeight: 0.16,
    pricePerKg: 16000,
    price: 16000
  },
  {
    id: 9,
    name: '깻잎',
    nameEn: 'Perilla',
    temp: [20, 26],
    humidity: [65, 80],
    pH: [6.0, 6.5],
    EC: [1.5, 2.0],
    lux: [12000, 16000],
    color: '#0e7490',
    icon: '🍃',
    cycle: 42,
    harvestWeight: 0.28,
    pricePerKg: 14000,
    price: 14000
  },
  {
    id: 10,
    name: '로메인',
    nameEn: 'Romaine Lettuce',
    temp: [17, 22],
    humidity: [60, 70],
    pH: [5.8, 6.5],
    EC: [1.4, 1.9],
    lux: [11000, 15000],
    color: '#14532d',
    icon: '🥬',
    cycle: 50,
    harvestWeight: 0.35,
    pricePerKg: 11000,
    price: 11000
  }
];

/**
 * 농장 구조 상수
 */
export const FARM_CONFIG = {
  TOTAL_HOUSES: 5,
  RACKS_PER_HOUSE: 6,
  LAYERS_PER_RACK: 4,
  CELLS_PER_LAYER: 28,
  TOTAL_CELLS: 3360, // 5 * 6 * 4 * 28
} as const;

/**
 * 도매시장 목록
 */
export const WHOLESALE_MARKETS = [
  { id: 1, name: '가락시장', location: '서울', type: '종합' as const },
  { id: 2, name: '강서시장', location: '서울', type: '농산물' as const },
  { id: 3, name: '엄궁시장', location: '부산', type: '농산물' as const },
  { id: 4, name: '북부시장', location: '대구', type: '농산물' as const },
  { id: 5, name: '서부시장', location: '대전', type: '농산물' as const },
  { id: 6, name: '광주시장', location: '광주', type: '농산물' as const },
];

/**
 * 메트릭 임계값
 */
export const METRIC_THRESHOLDS = {
  temperature: {
    min: 15,
    max: 26,
    optimal: [18, 23],
  },
  humidity: {
    min: 55,
    max: 85,
    optimal: [60, 75],
  },
  co2: {
    min: 600,
    max: 1500,
    optimal: [800, 1200],
  },
  ph: {
    min: 5.5,
    max: 7.5,
    optimal: [6.0, 6.5],
  },
  ec: {
    min: 1.0,
    max: 3.0,
    optimal: [1.4, 2.0],
  },
  lux: {
    min: 8000,
    max: 22000,
    optimal: [12000, 16000],
  },
} as const;

/**
 * 업데이트 주기 (ms)
 */
export const UPDATE_INTERVALS = {
  REALTIME_METRICS: 5000, // 5초
  SENSOR_DATA: 10000, // 10초
  EQUIPMENT_STATUS: 3000, // 3초
  MARKET_PRICES: 60000, // 1분
  GROWTH_TRACKING: 300000, // 5분
} as const;

/**
 * 성장 단계 라벨
 */
export const GROWTH_STAGES = {
  0: '발아',
  20: '초기생장',
  40: '중기생장',
  60: '후기생장',
  80: '수확준비',
} as const;

/**
 * 색상 팔레트
 */
export const COLORS = {
  status: {
    good: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    offline: '#6b7280',
  },
  equipment: {
    active: '#3b82f6',
    idle: '#8b5cf6',
    maintenance: '#f59e0b',
    error: '#ef4444',
  },
} as const;
