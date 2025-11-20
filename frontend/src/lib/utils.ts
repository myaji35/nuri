/**
 * Utility Functions
 * 유틸리티 함수
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MetricStatus } from '@/types';
import { METRIC_THRESHOLDS } from './constants';

/**
 * Tailwind CSS 클래스 병합
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 메트릭 상태 판정
 */
export function getMetricStatus(
  value: number,
  metricType: keyof typeof METRIC_THRESHOLDS
): MetricStatus {
  const thresholds = METRIC_THRESHOLDS[metricType];

  if (value < thresholds.min || value > thresholds.max) {
    return 'critical';
  }

  const [optimalMin, optimalMax] = thresholds.optimal;
  if (value < optimalMin * 0.95 || value > optimalMax * 1.05) {
    return 'warning';
  }

  return 'normal';
}

/**
 * 퍼센트 변화 계산
 */
export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * 숫자 포맷팅 (한국어)
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 통화 포맷팅 (원화)
 */
export function formatCurrency(amount: number): string {
  return `₩${formatNumber(amount)}`;
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: Date, format: 'short' | 'long' | 'time' = 'short'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    case 'long':
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      });
    case 'time':
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return date.toISOString();
  }
}

/**
 * 작업일 여부 확인 (월~금)
 */
export function isWorkDay(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

/**
 * 다음 작업일로 조정
 */
export function getNextWorkDay(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();

  if (day === 0) { // Sunday -> Monday
    result.setDate(result.getDate() + 1);
  } else if (day === 6) { // Saturday -> Monday
    result.setDate(result.getDate() + 2);
  }

  return result;
}

/**
 * 성장 단계 레벨 판정
 */
export function getGrowthStageLabel(percentage: number): string {
  if (percentage >= 80) return '수확준비';
  if (percentage >= 60) return '후기생장';
  if (percentage >= 40) return '중기생장';
  if (percentage >= 20) return '초기생장';
  return '발아';
}

/**
 * 건강도에 따른 색상 반환
 */
export function getHealthColor(health: number): string {
  if (health >= 90) return '#10b981'; // green
  if (health >= 70) return '#3b82f6'; // blue
  if (health >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

/**
 * 랜덤 ID 생성
 */
export function generateId(prefix: string = ''): string {
  const random = Math.random().toString(36).substring(2, 11);
  return prefix ? `${prefix}-${random}` : random;
}

/**
 * 배열 셔플
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 범위 내 랜덤 값 생성
 */
export function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * 배열을 특정 크기로 청크 분할
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쓰로틀 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
