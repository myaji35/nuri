// @ts-nocheck
'use client';

export default function TestGlobe() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle, #1e3a5f 0%, #0a1929 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
    }}>
      {/* Simple CSS Globe */}
      <div style={{
        position: 'absolute',
        width: '90%',
        height: '90%',
        borderRadius: '50%',
        border: '2px solid rgba(144, 238, 144, 0.3)',
        boxShadow: '0 0 30px rgba(144, 238, 144, 0.2)'
      }}>
        {/* Grid lines */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          {/* Latitude lines */}
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />

          {/* Longitude lines */}
          <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />
          <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="rgba(144, 238, 144, 0.2)" strokeWidth="0.5" />

          {/* Markers */}
          <circle cx="50" cy="30" r="2" fill="#FFD700" opacity="0.8">
            <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="45" r="2" fill="#FFD700" opacity="0.8">
            <animate attributeName="r" values="2;3;2" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="60" r="2" fill="#FFD700" opacity="0.8">
            <animate attributeName="r" values="2;3;2" dur="2s" begin="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Center text */}
      <div style={{
        position: 'absolute',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(255, 255, 255, 0.2)'
      }}>
        NURI
      </div>
    </div>
  );
}