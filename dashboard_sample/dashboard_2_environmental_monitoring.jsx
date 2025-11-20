import React, { useState, useEffect } from 'react';

// Dashboard 2: 재배 환경 모니터링
// 센서 데이터, 온도/습도/pH/EC/CO2, 환경 제어 시스템

export default function EnvironmentalMonitoringDashboard() {
  const [sensorData, setSensorData] = useState({
    temperature: [],
    humidity: [],
    ph: [],
    ec: [],
    co2: [],
    lux: []
  });
  
  const [environmentalControl, setEnvironmentalControl] = useState({
    hvac: [],
    irrigation: [],
    lighting: []
  });
  
  const [activeCrops, setActiveCrops] = useState([]);
  
  const cropDatabase = [
    { id: 1, name: '상추', temp: [18, 23], humidity: [60, 75], pH: [5.8, 6.3], EC: [1.2, 1.8], lux: [10000, 15000], color: '#90EE90', cycle: 28, harvestWeight: 0.15 },
    { id: 2, name: '청경채', temp: [16, 22], humidity: [65, 80], pH: [6.0, 6.5], EC: [1.5, 2.0], lux: [12000, 18000], color: '#98FB98', cycle: 35, harvestWeight: 0.25 },
    { id: 3, name: '케일', temp: [15, 20], humidity: [60, 75], pH: [6.0, 6.8], EC: [1.8, 2.5], lux: [15000, 20000], color: '#2E8B57', cycle: 45, harvestWeight: 0.30 },
    { id: 4, name: '루꼴라', temp: [16, 21], humidity: [55, 70], pH: [6.0, 7.0], EC: [1.6, 2.2], lux: [11000, 16000], color: '#7CFC00', cycle: 25, harvestWeight: 0.12 },
    { id: 5, name: '바질', temp: [20, 25], humidity: [65, 75], pH: [5.5, 6.5], EC: [1.4, 2.0], lux: [14000, 18000], color: '#32CD32', cycle: 40, harvestWeight: 0.20 },
    { id: 6, name: '민트', temp: [18, 24], humidity: [60, 70], pH: [6.0, 7.0], EC: [1.8, 2.4], lux: [10000, 14000], color: '#00FA9A', cycle: 30, harvestWeight: 0.18 },
    { id: 7, name: '시금치', temp: [15, 20], humidity: [65, 75], pH: [6.5, 7.0], EC: [1.8, 2.3], lux: [12000, 16000], color: '#228B22', cycle: 32, harvestWeight: 0.22 },
    { id: 8, name: '파슬리', temp: [18, 22], humidity: [60, 75], pH: [6.0, 7.0], EC: [1.6, 2.0], lux: [13000, 17000], color: '#3CB371', cycle: 38, harvestWeight: 0.16 },
    { id: 9, name: '깻잎', temp: [20, 26], humidity: [65, 80], pH: [6.0, 6.5], EC: [1.5, 2.0], lux: [12000, 16000], color: '#6B8E23', cycle: 42, harvestWeight: 0.28 },
    { id: 10, name: '로메인', temp: [17, 22], humidity: [60, 70], pH: [5.8, 6.5], EC: [1.4, 1.9], lux: [11000, 15000], color: '#9ACD32', cycle: 50, harvestWeight: 0.35 }
  ];

  useEffect(() => {
    // Initialize active crops
    const crops = [
      { ...cropDatabase[0], count: 850, nuriCells: [] },
      { ...cropDatabase[1], count: 620, nuriCells: [] },
      { ...cropDatabase[2], count: 450, nuriCells: [] },
      { ...cropDatabase[3], count: 340, nuriCells: [] },
      { ...cropDatabase[4], count: 280, nuriCells: [] },
      { ...cropDatabase[5], count: 260, nuriCells: [] },
      { ...cropDatabase[6], count: 220, nuriCells: [] },
      { ...cropDatabase[7], count: 180, nuriCells: [] },
      { ...cropDatabase[8], count: 100, nuriCells: [] },
      { ...cropDatabase[9], count: 60, nuriCells: [] }
    ];
    setActiveCrops(crops);

    // Initialize sensor data for 5 houses
    const tempData = [];
    const humData = [];
    const phData = [];
    const ecData = [];
    const co2Data = [];
    const luxData = [];
    
    for (let house = 1; house <= 5; house++) {
      tempData.push({
        house: house,
        value: 18 + Math.random() * 5,
        target: 20,
        status: 'normal'
      });
      
      humData.push({
        house: house,
        value: 60 + Math.random() * 15,
        target: 70,
        status: 'normal'
      });
      
      phData.push({
        house: house,
        value: 5.8 + Math.random() * 0.8,
        target: 6.2,
        status: 'normal'
      });
      
      ecData.push({
        house: house,
        value: 1.2 + Math.random() * 0.8,
        target: 1.6,
        status: 'normal'
      });
      
      co2Data.push({
        house: house,
        value: 800 + Math.random() * 400,
        target: 1000,
        status: 'normal'
      });
      
      luxData.push({
        house: house,
        value: 10000 + Math.random() * 5000,
        target: 12000,
        status: 'normal'
      });
    }
    
    setSensorData({
      temperature: tempData,
      humidity: humData,
      ph: phData,
      ec: ecData,
      co2: co2Data,
      lux: luxData
    });

    // Initialize environmental control systems
    const hvacSystems = [];
    const irrigationSystems = [];
    const lightingSystems = [];
    
    for (let house = 1; house <= 5; house++) {
      hvacSystems.push({
        house: house,
        mode: 'auto',
        cooling: Math.random() > 0.5,
        heating: Math.random() > 0.7,
        ventilation: Math.random() * 100,
        powerUsage: 2000 + Math.random() * 1000
      });
      
      irrigationSystems.push({
        house: house,
        mode: 'scheduled',
        flowRate: 10 + Math.random() * 5,
        totalVolume: 1000 + Math.random() * 500,
        nextSchedule: new Date(Date.now() + Math.random() * 3600000)
      });
      
      lightingSystems.push({
        house: house,
        mode: 'auto',
        intensity: 70 + Math.random() * 30,
        spectrum: 'full',
        powerUsage: 1500 + Math.random() * 500
      });
    }
    
    setEnvironmentalControl({
      hvac: hvacSystems,
      irrigation: irrigationSystems,
      lighting: lightingSystems
    });

    // Real-time update
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: prev.temperature.map(t => ({
          ...t,
          value: Math.max(15, Math.min(28, t.value + (Math.random() - 0.5) * 0.5)),
          status: Math.abs(t.value - t.target) > 2 ? 'warning' : 'normal'
        })),
        humidity: prev.humidity.map(h => ({
          ...h,
          value: Math.max(50, Math.min(85, h.value + (Math.random() - 0.5) * 2)),
          status: Math.abs(h.value - h.target) > 10 ? 'warning' : 'normal'
        })),
        ph: prev.ph.map(p => ({
          ...p,
          value: Math.max(5.5, Math.min(7.0, p.value + (Math.random() - 0.5) * 0.1)),
          status: Math.abs(p.value - p.target) > 0.5 ? 'warning' : 'normal'
        })),
        ec: prev.ec.map(e => ({
          ...e,
          value: Math.max(1.0, Math.min(2.5, e.value + (Math.random() - 0.5) * 0.1)),
          status: Math.abs(e.value - e.target) > 0.4 ? 'warning' : 'normal'
        })),
        co2: prev.co2.map(c => ({
          ...c,
          value: Math.max(400, Math.min(1500, c.value + (Math.random() - 0.5) * 50)),
          status: Math.abs(c.value - c.target) > 300 ? 'warning' : 'normal'
        })),
        lux: prev.lux.map(l => ({
          ...l,
          value: Math.max(8000, Math.min(18000, l.value + (Math.random() - 0.5) * 500)),
          status: Math.abs(l.value - l.target) > 3000 ? 'warning' : 'normal'
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌡️ 재배 환경 모니터링</h1>
          <p className="text-gray-400">실시간 센서 데이터 · 환경 제어 시스템 · 최적 조건 관리</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30">
            <div className="text-red-400 text-2xl mb-2">🌡️</div>
            <div className="text-gray-400 text-xs mb-1">평균 온도</div>
            <div className="text-white text-3xl font-bold">
              {(sensorData.temperature.reduce((sum, t) => sum + t.value, 0) / sensorData.temperature.length).toFixed(1)}°C
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-400 text-2xl mb-2">💧</div>
            <div className="text-gray-400 text-xs mb-1">평균 습도</div>
            <div className="text-white text-3xl font-bold">
              {(sensorData.humidity.reduce((sum, h) => sum + h.value, 0) / sensorData.humidity.length).toFixed(0)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <div className="text-green-400 text-2xl mb-2">⚗️</div>
            <div className="text-gray-400 text-xs mb-1">평균 pH</div>
            <div className="text-white text-3xl font-bold">
              {(sensorData.ph.reduce((sum, p) => sum + p.value, 0) / sensorData.ph.length).toFixed(1)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
            <div className="text-purple-400 text-2xl mb-2">⚡</div>
            <div className="text-gray-400 text-xs mb-1">평균 EC</div>
            <div className="text-white text-3xl font-bold">
              {(sensorData.ec.reduce((sum, e) => sum + e.value, 0) / sensorData.ec.length).toFixed(1)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl p-4 border border-yellow-500/30">
            <div className="text-yellow-400 text-2xl mb-2">💨</div>
            <div className="text-gray-400 text-xs mb-1">평균 CO2</div>
            <div className="text-white text-3xl font-bold">
              {(sensorData.co2.reduce((sum, c) => sum + c.value, 0) / sensorData.co2.length).toFixed(0)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
            <div className="text-orange-400 text-2xl mb-2">💡</div>
            <div className="text-gray-400 text-xs mb-1">평균 조도</div>
            <div className="text-white text-3xl font-bold">
              {((sensorData.lux.reduce((sum, l) => sum + l.value, 0) / sensorData.lux.length) / 1000).toFixed(1)}K
            </div>
          </div>
        </div>

        {/* Sensor Data by House */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            하우스별 센서 데이터
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(house => {
              const temp = sensorData.temperature.find(t => t.house === house);
              const hum = sensorData.humidity.find(h => h.house === house);
              const ph = sensorData.ph.find(p => p.house === house);
              const ec = sensorData.ec.find(e => e.house === house);
              const co2 = sensorData.co2.find(c => c.house === house);
              const lux = sensorData.lux.find(l => l.house === house);
              
              return (
                <div key={house} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-center mb-3">
                    <div className="text-lg font-bold text-white">House {house}</div>
                    <div className="text-xs text-gray-400">실시간 센서</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">온도</span>
                        <span className={temp?.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
                          {temp?.value.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${temp?.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${(temp?.value / 30) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">습도</span>
                        <span className={hum?.status === 'warning' ? 'text-yellow-400' : 'text-blue-400'}>
                          {hum?.value.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${hum?.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                          style={{ width: `${hum?.value}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">pH</span>
                        <span className={ph?.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
                          {ph?.value.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${ph?.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${((ph?.value - 5) / 3) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">EC</span>
                        <span className={ec?.status === 'warning' ? 'text-yellow-400' : 'text-purple-400'}>
                          {ec?.value.toFixed(1)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${ec?.status === 'warning' ? 'bg-yellow-500' : 'bg-purple-500'}`}
                          style={{ width: `${(ec?.value / 3) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">CO2</span>
                        <span className={co2?.status === 'warning' ? 'text-yellow-400' : 'text-cyan-400'}>
                          {co2?.value.toFixed(0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${co2?.status === 'warning' ? 'bg-yellow-500' : 'bg-cyan-500'}`}
                          style={{ width: `${(co2?.value / 1500) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">조도</span>
                        <span className={lux?.status === 'warning' ? 'text-yellow-400' : 'text-orange-400'}>
                          {(lux?.value / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${lux?.status === 'warning' ? 'bg-yellow-500' : 'bg-orange-500'}`}
                          style={{ width: `${(lux?.value / 20000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Control Systems */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            환경 제어 시스템
          </h2>

          {/* HVAC System */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>❄️</span>
              HVAC 시스템 (냉난방 & 환기)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {environmentalControl.hvac.map((hvac, idx) => (
                <div key={idx} className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-bold">House {hvac.house}</div>
                    <div className="text-xs text-cyan-400">{hvac.mode}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">냉방:</span>
                      <span className={hvac.cooling ? 'text-blue-400' : 'text-gray-500'}>
                        {hvac.cooling ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">난방:</span>
                      <span className={hvac.heating ? 'text-red-400' : 'text-gray-500'}>
                        {hvac.heating ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">환기:</span>
                      <span className="text-green-400">{hvac.ventilation.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">전력:</span>
                      <span className="text-yellow-400">{hvac.powerUsage.toFixed(0)}W</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Irrigation System */}
          <div className="mb-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>💧</span>
              양액 순환 시스템
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {environmentalControl.irrigation.map((irr, idx) => (
                <div key={idx} className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-bold">House {irr.house}</div>
                    <div className="text-xs text-blue-400">{irr.mode}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">유량:</span>
                      <span className="text-cyan-400">{irr.flowRate.toFixed(1)}L/m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">총량:</span>
                      <span className="text-green-400">{irr.totalVolume.toFixed(0)}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">다음:</span>
                      <span className="text-yellow-400">
                        {irr.nextSchedule.getHours()}:{irr.nextSchedule.getMinutes().toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lighting System */}
          <div>
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>💡</span>
              LED 조명 시스템
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {environmentalControl.lighting.map((light, idx) => (
                <div key={idx} className="bg-gray-700/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-bold">House {light.house}</div>
                    <div className="text-xs text-orange-400">{light.mode}</div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">강도:</span>
                      <span className="text-yellow-400">{light.intensity.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">스펙트럼:</span>
                      <span className="text-purple-400">{light.spectrum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">전력:</span>
                      <span className="text-red-400">{light.powerUsage.toFixed(0)}W</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Crop Optimal Conditions */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            작물별 최적 환경 조건
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">작물</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">온도(°C)</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">습도(%)</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">pH</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">EC</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">Lux</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">재배량</th>
                </tr>
              </thead>
              <tbody>
                {activeCrops.map((crop, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: crop.color }}
                        ></div>
                        <span className="text-white font-semibold">{crop.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {crop.temp[0]} - {crop.temp[1]}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {crop.humidity[0]} - {crop.humidity[1]}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {crop.pH[0]} - {crop.pH[1]}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {crop.EC[0]} - {crop.EC[1]}
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {crop.lux[0].toLocaleString()} - {crop.lux[1].toLocaleString()}
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                        {crop.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
