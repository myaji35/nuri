'use client';

import SimpleGlobe from '@/components/globe/SimpleGlobe';

export default function GlobeTestPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <h1 style={{ color: 'white', textAlign: 'center', paddingTop: '20px' }}>
        Globe Test Page
      </h1>
      <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
        <SimpleGlobe />
      </div>
    </div>
  );
}