import { create } from 'zustand';
import type { HoverState, CountryHoverData, TooltipPosition } from '@/types';

export const useHoverStore = create<HoverState>((set) => ({
  isHovering: false,
  countryData: null,
  position: { x: 0, y: 0 },
  setHovered: (countryData: CountryHoverData | null, position: TooltipPosition) =>
    set({ isHovering: true, countryData, position }),
  clearHovered: () =>
    set({ isHovering: false, countryData: null }),
}));
