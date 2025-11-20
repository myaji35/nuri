/**
 * Market and Sales Type Definitions
 * 시장 및 판매 타입 정의
 */

import { CropType } from './farm';

export interface WholesaleMarket {
  id: number;
  name: string;
  location: string;
  type: '종합' | '농산물' | '수산물';
}

export interface MarketPrice {
  crop: string;
  market: string;
  location: string;
  price: number;
  pricePerKg: number;
  change: number; // percentage
  volume: number; // kg
  timestamp: Date;
}

export interface PriceForecast {
  date: Date;
  predictedPrice: number;
  confidence: number; // 0-100
  lowerBound?: number;
  upperBound?: number;
}

export interface MarketForecast {
  crop: string;
  market: string;
  data: PriceForecast[];
}

export interface PlantingRecommendation {
  crop: CropType;
  recommendedQuantity: number;
  expectedRevenue: number;
  expectedProfit: number;
  profitMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string;
}

export interface HarvestSchedule {
  id: string;
  crop: string;
  quantity: number;
  harvestDate: Date;
  expectedWeight: number;
  targetMarket: string;
  estimatedRevenue: number;
  status: 'planned' | 'ready' | 'harvesting' | 'completed' | 'delayed';
  assignedWorkers?: number;
}

export interface YieldAnalysis {
  crop: string;
  color: string;
  expectedYield: string;
  actualYield: string;
  yieldRate: string; // percentage
  revenue: string;
  cost: string;
  profit: string;
  roi: string; // percentage
  pricePerKg: number;
}

export interface GrowthTracking {
  crop: string;
  color: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  current: number;
}

export interface ActiveCrop extends CropType {
  count: number;
  plantDate?: Date;
  daysGrown?: number;
  growthStage?: number;
  stage?: '발아' | '초기생장' | '중기생장' | '후기생장' | '수확준비';
  health?: number;
  expectedHarvestDate?: Date;
  nuriCells?: string[];
}
