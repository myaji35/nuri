// @ts-nocheck
'use client';

import dynamic from 'next/dynamic';

const GlobeWithBorders = dynamic(() => import('./GlobeWithBorders'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <div>Loading 3D Globe...</div>
      </div>
    </div>
  ),
});

export default function GlobeWrapper() {
  return <GlobeWithBorders />;
}