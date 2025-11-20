import React, { useState, useEffect } from 'react';
import { Activity, Zap, Droplet, Wind, Sun, ThermometerSun, Sprout, AlertTriangle, CheckCircle, Clock, Settings } from 'lucide-react';

// Nuri Farm Complete Facility Monitoring System
// Web-based Real-time Visualization Solution

export default function FacilityMonitoringSystem() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState('overview'); // overview, house, rack, cell
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  
  // Farm Structure Data
  const [farmStructure, setFarmStructure] = useState({
    name: '누리팜 스마트팜',
    totalHouses: 5,
    totalRacks: 30,
    totalLayers: 120,
    totalCells: 3360,
    houses: []
  });

  // Real-time Metrics
  const [metrics, setMetrics] = useState({
    temperature: 22.5,
    humidity: 68,
    co2: 1050,
    light: 15000,
    ph: 6.2,
    ec: 1.8,
    power: 450,
    water: 1200
  });

  // Equipment Status
  const [equipment, setEquipment] = useState({
    hoists: [],
    avgs: [],
    mobileRacks: []
  });

  // Alerts
  const [alerts, setAlerts] = useState([]);

  // Crop Types
  const cropTypes = [
    { id: 1, name: '상추', color: '#10b981', icon: '🥬' },
    { id: 2, name: '청경채', color: '#22c55e', icon: '🥬' },
    { id: 3, name: '케일', color: '#84cc16', icon: '🥬' },
    { id: 4, name: '루꼴라', color: '#65a30d', icon: '🌿' },
    { id: 5, name: '바질', color: '#16a34a', icon: '🌿' },
    { id: 6, name: '민트', color: '#059669', icon: '🌿' },
    { id: 7, name: '시금치', color: '#0d9488', icon: '🥬' },
    { id: 8, name: '파슬리', color: '#0891b2', icon: '🌿' },
    { id: 9, name: '깻잎', color: '#0e7490', icon: '🍃' },
    { id: 10, name: '로메인', color: '#14532d', icon: '🥬' }
  ];

  useEffect(() => {
    // Initialize Farm Structure
    const initializeFarm = () => {
      const houses = [];
      
      for (let h = 1; h <= 5; h++) {
        const racks = [];
        
        for (let r = 1; r <= 6; r++) {
          const layers = [];
          const rackType = r === 1 || r === 6 ? 'fixed' : r === 2 || r === 3 ? 'mobile-a' : 'mobile-b';
          
          for (let l = 1; l <= 4; l++) {
            const cells = [];
            
            for (let c = 1; c <= 28; c++) {
              const crop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
              const isActive = Math.random() > 0.02;
              
              cells.push({
                id: `H${h}-R${r}-L${l}-C${c}`,
                column: c,
                crop: crop,
                growthStage: Math.random() * 100,
                health: isActive ? 85 + Math.random() * 15 : 0,
                isActive: isActive,
                temperature: 18 + Math.random() * 7,
                humidity: 60 + Math.random() * 20,
                ph: 5.5 + Math.random() * 1.3,
                ec: 1.0 + Math.random() * 1.5
              });
            }
            
            layers.push({
              id: l,
              cells: cells,
              activeCells: cells.filter(c => c.isActive).length
            });
          }
          
          racks.push({
            id: r,
            type: rackType,
            layers: layers,
            position: rackType !== 'fixed' ? (Math.random() > 0.5 ? 'open' : 'closed') : 'fixed',
            isMoving: false,
            activeCells: layers.reduce((sum, l) => sum + l.activeCells, 0)
          });
        }
        
        houses.push({
          id: h,
          name: `House ${h}`,
          racks: racks,
          activeCells: racks.reduce((sum, r) => sum + r.activeCells, 0),
          temperature: 20 + Math.random() * 5,
          humidity: 65 + Math.random() * 15,
          co2: 1000 + Math.random() * 200,
          status: Math.random() > 0.1 ? 'operational' : 'maintenance'
        });
      }
      
      setFarmStructure(prev => ({
        ...prev,
        houses: houses
      }));
    };

    // Initialize Equipment
    const initializeEquipment = () => {
      const hoists = [];
      for (let i = 1; i <= 5; i++) {
        hoists.push({
          id: i,
          house: i,
          status: Math.random() > 0.2 ? 'idle' : 'working',
          position: { rack: Math.floor(Math.random() * 6) + 1, layer: Math.floor(Math.random() * 4) + 1 },
          load: Math.random() > 0.5 ? Math.random() * 50 : 0
        });
      }

      const avgs = [];
      for (let i = 1; i <= 3; i++) {
        avgs.push({
          id: i,
          name: `AVG-${i}`,
          status: Math.random() > 0.1 ? 'active' : 'charging',
          battery: 40 + Math.random() * 60,
          currentHouse: Math.floor(Math.random() * 5) + 1,
          speed: Math.random() * 1.2
        });
      }

      setEquipment({ hoists, avgs, mobileRacks: [] });
    };

    initializeFarm();
    initializeEquipment();

    // Real-time updates
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      // Update metrics smoothly
      setMetrics(prev => ({
        temperature: Math.max(18, Math.min(28, prev.temperature * 0.95 + (22.5 + (Math.random() - 0.5) * 1) * 0.05)),
        humidity: Math.max(55, Math.min(80, prev.humidity * 0.95 + (68 + (Math.random() - 0.5) * 3) * 0.05)),
        co2: Math.max(800, Math.min(1300, prev.co2 * 0.95 + (1050 + (Math.random() - 0.5) * 50) * 0.05)),
        light: Math.max(10000, Math.min(20000, prev.light * 0.95 + (15000 + (Math.random() - 0.5) * 1000) * 0.05)),
        ph: Math.max(5.5, Math.min(6.8, prev.ph * 0.97 + (6.2 + (Math.random() - 0.5) * 0.1) * 0.03)),
        ec: Math.max(1.0, Math.min(2.5, prev.ec * 0.97 + (1.8 + (Math.random() - 0.5) * 0.1) * 0.03)),
        power: Math.max(400, Math.min(500, prev.power * 0.9 + (450 + (Math.random() - 0.5) * 10) * 0.1)),
        water: Math.max(1000, Math.min(1500, prev.water * 0.9 + (1200 + (Math.random() - 0.5) * 50) * 0.1))
      }));

      // Update equipment
      setEquipment(prev => ({
        hoists: prev.hoists.map(h => ({
          ...h,
          status: Math.random() > 0.85 ? (h.status === 'idle' ? 'working' : 'idle') : h.status,
          load: h.status === 'working' ? Math.random() * 50 : 0
        })),
        avgs: prev.avgs.map(a => ({
          ...a,
          battery: a.status === 'charging' 
            ? Math.min(100, a.battery + 1)
            : Math.max(20, a.battery - 0.3),
          status: a.battery < 25 ? 'charging' : a.battery > 80 && a.status === 'charging' ? 'active' : a.status,
          currentHouse: a.status === 'active' ? Math.floor(Math.random() * 5) + 1 : a.currentHouse
        })),
        mobileRacks: prev.mobileRacks
      }));

      // Generate alerts
      const newAlerts = [];
      if (metrics.temperature > 26) {
        newAlerts.push({ type: 'warning', message: '온도가 높습니다', severity: 'high' });
      }
      if (metrics.co2 < 900) {
        newAlerts.push({ type: 'info', message: 'CO2 보충 권장', severity: 'medium' });
      }
      setAlerts(newAlerts);

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getGrowthColor = (stage) => {
    if (stage >= 80) return '#22c55e';
    if (stage >= 60) return '#3b82f6';
    if (stage >= 40) return '#eab308';
    if (stage >= 20) return '#f97316';
    return '#6b7280';
  };

  const getHealthStatus = (health) => {
    if (health >= 90) return { text: '우수', color: 'text-green-400', bg: 'bg-green-500' };
    if (health >= 75) return { text: '양호', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { text: '주의', color: 'text-red-400', bg: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🌱</div>
            <div>
              <h1 className="text-2xl font-bold text-white">누리팜 시설 모니터링</h1>
              <p className="text-sm text-gray-400">Nuri Farm Facility Monitoring System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* View Toggle */}
            <div className="flex gap-2">
              {['overview', 'house', 'detail'].map(view => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedView === view
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {view === 'overview' ? '전체 뷰' : view === 'house' ? '하우스 뷰' : '상세 뷰'}
                </button>
              ))}
            </div>

            {/* Display Options */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEquipment(!showEquipment)}
                className={`px-3 py-2 rounded text-xs ${showEquipment ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}
              >
                장비
              </button>
              <button
                onClick={() => setShowSensors(!showSensors)}
                className={`px-3 py-2 rounded text-xs ${showSensors ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'}`}
              >
                센서
              </button>
            </div>

            {/* Time */}
            <div className="text-right">
              <div className="text-cyan-400 text-xl font-bold">
                {currentTime.toLocaleTimeString('ko-KR')}
              </div>
              <div className="text-gray-500 text-xs">
                {currentTime.toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1920px] mx-auto">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4 flex gap-3">
            {alerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-yellow-500/20 border border-yellow-500/30'
                }`}
              >
                <AlertTriangle className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                <span className="text-white text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-8 gap-3 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Sprout className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">CELLS</span>
            </div>
            <div className="text-white text-xl font-bold">3,360</div>
            <div className="text-gray-500 text-xs">총 누리셀</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <ThermometerSun className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-purple-400">TEMP</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.temperature.toFixed(1)}°C</div>
            <div className="text-gray-500 text-xs">평균 온도</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-cyan-400">HUMID</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.humidity.toFixed(0)}%</div>
            <div className="text-gray-500 text-xs">평균 습도</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Wind className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">CO2</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.co2.toFixed(0)}</div>
            <div className="text-gray-500 text-xs">ppm</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Sun className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-yellow-400">LIGHT</span>
            </div>
            <div className="text-white text-xl font-bold">{(metrics.light/1000).toFixed(1)}K</div>
            <div className="text-gray-500 text-xs">Lux</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-orange-400">⚗️</span>
              <span className="text-xs text-orange-400">pH</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.ph.toFixed(2)}</div>
            <div className="text-gray-500 text-xs">양액 pH</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-yellow-400">POWER</span>
            </div>
            <div className="text-white text-xl font-bold">{metrics.power.toFixed(0)}</div>
            <div className="text-gray-500 text-xs">kW</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="flex items-center justify-between mb-1">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-blue-400">STATUS</span>
            </div>
            <div className="text-green-400 text-xl font-bold">정상</div>
            <div className="text-gray-500 text-xs">시스템 상태</div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="grid grid-cols-4 gap-6">
          {/* Facility 3D View */}
          <div className="col-span-3 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🏭</span>
                시설 구조 시각화
              </h2>
              <div className="text-sm text-gray-400">
                {selectedHouse ? `House ${selectedHouse}` : '전체 시설'} 
                {selectedRack ? ` > Rack ${selectedRack}` : ''}
              </div>
            </div>

            {/* Facility Layout - Bird's Eye View */}
            <div className="bg-gray-900/50 rounded-xl p-6 mb-4">
              {/* Houses Grid */}
              <div className="grid grid-cols-5 gap-4">
                {farmStructure.houses.map((house) => (
                  <div 
                    key={house.id}
                    onClick={() => {
                      setSelectedHouse(house.id === selectedHouse ? null : house.id);
                      setSelectedRack(null);
                    }}
                    className={`relative bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border-2 transition-all cursor-pointer hover:scale-[1.02] ${
                      selectedHouse === house.id 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' 
                        : 'border-gray-600/50 hover:border-gray-500'
                    }`}
                  >
                    {/* House Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-bold">🏠 House {house.id}</div>
                      <div className={`w-3 h-3 rounded-full ${
                        house.status === 'operational' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                      }`} />
                    </div>

                    {/* Rack Visualization (6 Racks) */}
                    <div className="grid grid-cols-6 gap-1 mb-3">
                      {house.racks.map((rack) => (
                        <div 
                          key={rack.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHouse(house.id);
                            setSelectedRack(rack.id === selectedRack ? null : rack.id);
                          }}
                          className={`aspect-[1/3] rounded transition-all cursor-pointer ${
                            selectedRack === rack.id && selectedHouse === house.id
                              ? 'ring-2 ring-cyan-400'
                              : ''
                          } ${
                            rack.type === 'fixed' ? 'bg-gray-600' :
                            rack.type === 'mobile-a' ? 'bg-blue-600/60' : 'bg-purple-600/60'
                          }`}
                        >
                          {/* 4 Layers */}
                          <div className="h-full flex flex-col gap-0.5 p-0.5">
                            {rack.layers.map((layer) => (
                              <div 
                                key={layer.id}
                                className="flex-1 rounded-sm bg-gray-900/50"
                                style={{
                                  background: `linear-gradient(90deg, ${
                                    layer.activeCells > 25 ? '#22c55e' : 
                                    layer.activeCells > 20 ? '#3b82f6' : 
                                    layer.activeCells > 15 ? '#eab308' : '#f97316'
                                  }40, transparent)`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* House Stats */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">활성 셀:</span>
                        <span className="text-green-400 font-semibold">{house.activeCells}/672</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">온도:</span>
                        <span className="text-purple-400">{house.temperature.toFixed(1)}°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CO2:</span>
                        <span className="text-green-400">{house.co2.toFixed(0)} ppm</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${(house.activeCells / 672) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Equipment Indicators */}
                    {showEquipment && (
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        {equipment.hoists.find(h => h.house === house.id)?.status === 'working' && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-[8px]">
                            🏗️
                          </div>
                        )}
                        {equipment.avgs.find(a => a.currentHouse === house.id && a.status === 'active') && (
                          <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-[8px]">
                            🤖
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected House Detail */}
            {selectedHouse && (
              <div className="bg-gray-900/50 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>📊</span>
                  House {selectedHouse} - 랙 상세
                </h3>
                
                <div className="grid grid-cols-6 gap-3">
                  {farmStructure.houses.find(h => h.id === selectedHouse)?.racks.map((rack) => (
                    <div 
                      key={rack.id}
                      onClick={() => setSelectedRack(rack.id === selectedRack ? null : rack.id)}
                      className={`rounded-lg p-3 border-2 cursor-pointer transition-all ${
                        selectedRack === rack.id 
                          ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' 
                          : rack.type === 'fixed' ? 'border-gray-500/50 bg-gray-700/30' :
                            rack.type === 'mobile-a' ? 'border-blue-500/50 bg-blue-500/10' :
                            'border-purple-500/50 bg-purple-500/10'
                      }`}
                    >
                      <div className="text-center mb-2">
                        <div className="text-white font-bold">Rack {rack.id}</div>
                        <div className={`text-xs ${
                          rack.type === 'fixed' ? 'text-gray-400' :
                          rack.type === 'mobile-a' ? 'text-blue-400' : 'text-purple-400'
                        }`}>
                          {rack.type === 'fixed' ? '고정형' : rack.type === 'mobile-a' ? '모빌 A' : '모빌 B'}
                        </div>
                        {rack.isMoving && (
                          <div className="text-yellow-400 text-xs animate-pulse">⟷ 이동중</div>
                        )}
                      </div>

                      {/* Layer Visualization */}
                      <div className="space-y-1 mb-2">
                        {rack.layers.map((layer) => (
                          <div key={layer.id} className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 w-5">L{layer.id}</span>
                            <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                style={{ width: `${(layer.activeCells / 28) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-6">{layer.activeCells}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-center">
                        <span className="text-gray-400">활성: </span>
                        <span className="text-green-400 font-bold">{rack.activeCells}/112</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Rack Cell Grid */}
                {selectedRack && (
                  <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-3">
                      Rack {selectedRack} - 셀 그리드 (28 x 4)
                    </h4>
                    <div className="space-y-2">
                      {farmStructure.houses.find(h => h.id === selectedHouse)?.racks.find(r => r.id === selectedRack)?.layers.map((layer) => (
                        <div key={layer.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-12">Layer {layer.id}</span>
                          <div className="flex-1 grid grid-cols-28 gap-0.5">
                            {layer.cells.map((cell) => (
                              <div
                                key={cell.id}
                                onClick={() => setSelectedCell(selectedCell?.id === cell.id ? null : cell)}
                                className={`aspect-square rounded-sm cursor-pointer transition-all hover:scale-150 hover:z-10 ${
                                  !cell.isActive ? 'bg-gray-700' : ''
                                } ${
                                  selectedCell?.id === cell.id ? 'ring-2 ring-white scale-150 z-10' : ''
                                }`}
                                style={{
                                  backgroundColor: cell.isActive ? getGrowthColor(cell.growthStage) : undefined
                                }}
                                title={`${cell.id}\n${cell.crop.name}\n성장: ${cell.growthStage.toFixed(0)}%`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-green-500" />
                        <span className="text-gray-400">80%+</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        <span className="text-gray-400">60-79%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-yellow-500" />
                        <span className="text-gray-400">40-59%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-orange-500" />
                        <span className="text-gray-400">20-39%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded bg-gray-500" />
                        <span className="text-gray-400">0-19%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Details & Equipment */}
          <div className="space-y-4">
            {/* Selected Cell Detail */}
            {selectedCell ? (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <span>{selectedCell.crop.icon}</span>
                    셀 상세
                  </h3>
                  <button 
                    onClick={() => setSelectedCell(null)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-cyan-400 text-xs mb-1">ID</div>
                    <div className="text-white font-bold">{selectedCell.id}</div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-green-400 text-xs mb-1">작물</div>
                    <div className="text-white font-bold" style={{ color: selectedCell.crop.color }}>
                      {selectedCell.crop.name}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-yellow-400 text-xs mb-2">성장 단계</div>
                    <div className="text-white text-2xl font-bold mb-2">
                      {selectedCell.growthStage.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${selectedCell.growthStage}%`,
                          backgroundColor: getGrowthColor(selectedCell.growthStage)
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-blue-400 text-xs mb-1">건강도</div>
                    <div className={`text-2xl font-bold ${getHealthStatus(selectedCell.health).color}`}>
                      {selectedCell.health.toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-purple-400 text-xs">온도</div>
                      <div className="text-white font-semibold">{selectedCell.temperature.toFixed(1)}°C</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-cyan-400 text-xs">습도</div>
                      <div className="text-white font-semibold">{selectedCell.humidity.toFixed(0)}%</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-orange-400 text-xs">pH</div>
                      <div className="text-white font-semibold">{selectedCell.ph.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="text-red-400 text-xs">EC</div>
                      <div className="text-white font-semibold">{selectedCell.ec.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Equipment Status */
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  장비 상태
                </h3>

                {/* Hoists */}
                <div className="mb-4">
                  <div className="text-gray-400 text-xs mb-2">🏗️ 호이스트</div>
                  <div className="space-y-2">
                    {equipment.hoists.map((hoist) => (
                      <div 
                        key={hoist.id}
                        className={`flex items-center justify-between p-2 rounded ${
                          hoist.status === 'working' ? 'bg-green-500/10' : 'bg-gray-700/30'
                        }`}
                      >
                        <span className="text-white text-sm">H{hoist.house}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          hoist.status === 'working' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                        }`}>
                          {hoist.status === 'working' ? '작업중' : '대기'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AVGs */}
                <div>
                  <div className="text-gray-400 text-xs mb-2">🤖 AVG</div>
                  <div className="space-y-2">
                    {equipment.avgs.map((avg) => (
                      <div 
                        key={avg.id}
                        className={`p-2 rounded ${
                          avg.status === 'active' ? 'bg-cyan-500/10' : 'bg-yellow-500/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm">{avg.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            avg.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {avg.status === 'active' ? '운행' : '충전'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                avg.battery > 70 ? 'bg-green-500' :
                                avg.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${avg.battery}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{avg.battery.toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* System Summary */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                시스템 요약
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">총 하우스</span>
                  <span className="text-white font-bold">5개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">총 랙</span>
                  <span className="text-white font-bold">30개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">총 누리셀</span>
                  <span className="text-white font-bold">3,360개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">활성 셀</span>
                  <span className="text-green-400 font-bold">
                    {farmStructure.houses.reduce((sum, h) => sum + h.activeCells, 0)}개
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">가동률</span>
                  <span className="text-cyan-400 font-bold">
                    {((farmStructure.houses.reduce((sum, h) => sum + h.activeCells, 0) / 3360) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">시스템 정상 운영중</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
              <h3 className="text-white font-bold mb-3">빠른 작업</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm text-left">
                  📊 리포트 생성
                </button>
                <button className="w-full px-3 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-sm text-left">
                  🌱 수확 스케줄
                </button>
                <button className="w-full px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 text-sm text-left">
                  ⚙️ 시스템 설정
                </button>
                <button className="w-full px-3 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 text-sm text-left">
                  📈 분석 대시보드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
