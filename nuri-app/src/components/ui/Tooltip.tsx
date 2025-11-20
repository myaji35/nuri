'use client';

import { useHoverStore } from '@/stores/hoverStore';

export default function Tooltip() {
  const { isHovering, countryData, position } = useHoverStore();

  if (!isHovering || !countryData) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg bg-gray-800 p-3 text-sm text-white shadow-lg transition-opacity"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(10px, 10px)', // Offset from the cursor
      }}
    >
      <h3 className="font-bold">{countryData.name}</h3>
      {countryData.data?.gdp && <p>GDP: ${countryData.data.gdp}T</p>}
      {countryData.data?.population && <p>Population: {countryData.data.population}M</p>}
    </div>
  );
}
