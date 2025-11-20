import React, { useState, useEffect } from 'react';
import { Activity, Zap, Droplet, Wind, Sun, ThermometerSun, Sprout } from 'lucide-react';

// Nuri Farm Smart Farm Digital Twin
// Complete 3D visualization and real-time monitoring system

export default function SmartFarmDigitalTwin() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  
  const [farmData, setFarmData] = useState({
    houses: [],
    totalCells: 3360,
    activeCells: 0,
    totalProduction: 0,
    systemHealth: 0
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    temperature: 0,
    humidity: 0,
    co2: 0,
    light: 0,
    ph: 0,
    ec: 0,
    power: 0,
    water: 0
  });

  const [automation, setAutomation] = useState({
    hoists: [],
    avgs: [],
    mobileRacks: []
  });

  const [alerts, setAlerts] = useState([]);

  const cropTypes = [
    { id: 1, name: '상추', nameEn: 'Lettuce', color: '#10b981', icon: '🥬', cycle: 28, weight: 0.15, price: 12000 },
    { id: 2, name: '청경채', nameEn: 'Bok Choy', color: '#22c55e', icon: '🥬', cycle: 35, weight: 0.25, price: 10000 },
    { id: 3, name: '케일', nameEn: 'Kale', color: '#84cc16', icon: '🥬', cycle: 45, weight: 0.30, price: 15000 },
    { id: 4, name: '루꼴라', nameEn: 'Arugula', color: '#65a30d', icon: '🌿', cycle: 25, weight: 0.12, price: 18000 },
    { id: 5, name: '바질', nameEn: 'Basil', color: '#16a34a', icon: '🌿', cycle: 40, weight: 0.20, price: 20000 },
    { id: 6, name: '민트', nameEn: 'Mint', color: '#059669', icon: '🌿', cycle: 30, weight: 0.18, price: 22000 },
    { id: 7, name: '시금치', nameEn: 'Spinach', color: '#0d9488', icon: '🥬', cycle: 32, weight: 0.22, price: 9000 },
    { id: 8, name: '파슬리', nameEn: 'Parsley', color: '#0891b2', icon: '🌿', cycle: 38, weight: 0.16, price: 16000 },
    { id: 9, name: '깻잎', nameEn: 'Perilla', color: '#0e7490', icon: '🍃', cycle: 42, weight: 0.28, price: 14000 },
    { id: 10, name: '로메인', nameEn: 'Romaine', color: '#14532d', icon: '🥬', cycle: 50, weight: 0.35, price: 11000 }
  ];

  useEffect(() => {
    const initializeFarm = () => {
      const houses = [];
      let totalActiveCells = 0;
      let totalProduction = 0;

      for (let h = 1; h <= 5; h++) {
        const racks = [];
        
        for (let r = 1; r <= 6; r++) {
          const layers = [];
          const rackType = r === 1 || r === 6 ? 'fixed' : r === 2 || r === 3 ? 'mobile-a' : 'mobile-b';
          
          for (let l = 1; l <= 4; l++) {
            const cells = [];
            
            for (let c = 1; c <= 28; c++) {
              const crop = cropTypes[Math.floor(Math.random() * cropTypes.length)];
              const growthStage = Math.random() * 100;
              const isActive = Math.random() > 0.02;
              const health = isActive ? 85 + Math.random() * 15 : 0;
              
              if (isActive) {
                totalActiveCells++;
                if (growthStage >= 95) {
                  totalProduction += crop.weight;
                }
              }

              cells.push({
                id: `H${h}-R${r}-L${l}-C${c}`,
                house: h,
                rack: r,
                layer: l,
                column: c,
                crop: crop,
                growthStage: growthStage,
                isActive: isActive,
                health: health,
                temperature: 18 + Math.random() * 7,
                humidity: 60 + Math.random() * 20,
                ph: 5.5 + Math.random() * 1.3,
                ec: 1.0 + Math.random() * 1.5,
                light: 10000 + Math.random() * 8000,
                co2: 800 + Math.random() * 400,
                waterLevel: 70 + Math.random() * 30,
                lastWatered: new Date(Date.now() - Math.random() * 3600000),
                nextHarvest: new Date(Date.now() + Math.random() * 30 * 24 * 3600000)
              });
            }
            
            layers.push({
              id: l,
              cells: cells,
              avgTemperature: cells.reduce((sum, c) => sum + c.temperature, 0) / cells.length,
              avgHumidity: cells.reduce((sum, c) => sum + c.humidity, 0) / cells.length,
              avgHealth: cells.reduce((sum, c) => sum + c.health, 0) / cells.length
            });
          }
          
          racks.push({
            id: r,
            type: rackType,
            name: rackType === 'fixed' ? '고정형' : rackType === 'mobile-a' ? '모빌 A' : '모빌 B',
            layers: layers,
            position: rackType !== 'fixed' ? (Math.random() > 0.5 ? 'open' : 'closed') : 'fixed',
            isMoving: false,
            totalCells: 112,
            activeCells: layers.reduce((sum, l) => sum + l.cells.filter(c => c.isActive).length, 0)
          });
        }
        
        houses.push({
          id: h,
          name: `House ${h}`,
          racks: racks,
          totalCells: 672,
          activeCells: racks.reduce((sum, r) => sum + r.activeCells, 0),
          temperature: 20 + Math.random() * 5,
          humidity: 65 + Math.random() * 15,
          co2: 1000 + Math.random() * 200,
          power: 80 + Math.random() * 40,
          waterUsage: 250 + Math.random() * 100,
          status: 'operational'
        });
      }

      const systemHealth = (totalActiveCells / 3360) * 100;

      setFarmData({
        houses: houses,
        totalCells: 3360,
        activeCells: totalActiveCells,
        totalProduction: totalProduction,
        systemHealth: systemHealth
      });
    };

    const initializeAutomation = () => {
      const hoists = [];
      for (let i = 1; i <= 5; i++) {
        hoists.push({
          id: `hoist-${i}`,
          house: i,
          status: Math.random() > 0.2 ? 'idle' : 'working',
          position: {
            rack: Math.floor(Math.random() * 6) + 1,
            layer: Math.floor(Math.random() * 4) + 1,
            column: Math.floor(Math.random() * 28) + 1
          },
          currentLoad: Math.random() > 0.5 ? Math.random() * 50 : 0,
          totalLifts: Math.floor(Math.random() * 10000) + 50000,
          todayLifts: Math.floor(Math.random() * 50) + 20
        });
      }

      const avgs = [];
      for (let i = 1; i <= 3; i++) {
        avgs.push({
          id: `avg-${i}`,
          name: `AVG-${i}`,
          status: Math.random() > 0.1 ? 'active' : 'charging',
          battery: 40 + Math.random() * 60,
          currentHouse: Math.floor(Math.random() * 5) + 1,
          speed: Math.random() * 1.2,
          todayTrips: Math.floor(Math.random() * 30) + 40
        });
      }

      const mobileRacks = [];
      farmData.houses.forEach(house => {
        house.racks.forEach(rack => {
          if (rack.type !== 'fixed') {
            mobileRacks.push({
              id: `H${house.id}-R${rack.id}`,
              house: house.id,
              rack: rack.id,
              type: rack.type,
              position: rack.position,
              isMoving: rack.isMoving
            });
          }
        });
      });

      setAutomation({
        hoists: hoists,
        avgs: avgs,
        mobileRacks: mobileRacks
      });
    };

    const calculateMetrics = () => {
      if (farmData.houses.length === 0) return;

      let totalTemp = 0, totalHumidity = 0, totalCO2 = 0, totalLight = 0;
      let totalPH = 0, totalEC = 0, totalPower = 0, totalWater = 0;
      let count = 0;

      farmData.houses.forEach(house => {
        house.racks.forEach(rack => {
          rack.layers.forEach(layer => {
            layer.cells.forEach(cell => {
              if (cell.isActive) {
                totalTemp += cell.temperature;
                totalHumidity += cell.humidity;
                totalCO2 += cell.co2;
                totalLight += cell.light;
                totalPH += cell.ph;
                totalEC += cell.ec;
                count++;
              }
            });
          });
        });
        totalPower += house.power;
        totalWater += house.waterUsage;
      });

      setRealtimeMetrics({
        temperature: totalTemp / count || 0,
        humidity: totalHumidity / count || 0,
        co2: totalCO2 / count || 0,
        light: totalLight / count || 0,
        ph: totalPH / count || 0,
        ec: totalEC / count || 0,
        power: totalPower,
        water: totalWater
      });
    };

    const generateAlerts = () => {
      const newAlerts = [];

      farmData.houses.forEach(house => {
        if (house.temperature > 26) {
          newAlerts.push({
            type: 'warning',
            severity: 'high',
            message: `House ${house.id}: 온도가 높습니다 (${house.temperature.toFixed(1)}°C)`,
            house: house.id
          });
        }

        if (house.co2 < 800) {
          newAlerts.push({
            type: 'info',
            severity: 'medium',
            message: `House ${house.id}: CO2 보충 필요 (${house.co2.toFixed(0)} ppm)`,
            house: house.id
          });
        }
      });

      automation.hoists.forEach(hoist => {
        if (hoist.currentLoad > 45) {
          newAlerts.push({
            type: 'warning',
            severity: 'medium',
            message: `Hoist ${hoist.house}: 하중 주의 (${hoist.currentLoad.toFixed(1)}kg)`,
            house: hoist.house
          });
        }
      });

      automation.avgs.forEach(avg => {
        if (avg.battery < 30) {
          newAlerts.push({
            type: 'alert',
            severity: 'high',
            message: `${avg.name}: 배터리 부족 (${avg.battery.toFixed(0)}%)`,
            system: 'avg'
          });
        }
      });

      setAlerts(newAlerts.slice(0, 5));
    };

    initializeFarm();
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      setFarmData(prev => {
        const updatedHouses = prev.houses.map(house => {
          const updatedRacks = house.racks.map(rack => {
            const updatedLayers = rack.layers.map(layer => {
              const updatedCells = layer.cells.map(cell => {
                if (!cell.isActive) return cell;

                return {
                  ...cell,
                  growthStage: Math.min(100, cell.growthStage + Math.random() * 0.5),
                  temperature: Math.max(18, Math.min(28, cell.temperature + (Math.random() - 0.5) * 0.5)),
                  humidity: Math.max(50, Math.min(85, cell.humidity + (Math.random() - 0.5) * 2)),
                  ph: Math.max(5.5, Math.min(6.8, cell.ph + (Math.random() - 0.5) * 0.05)),
                  ec: Math.max(1.0, Math.min(2.5, cell.ec + (Math.random() - 0.5) * 0.05)),
                  light: Math.max(8000, Math.min(20000, cell.light + (Math.random() - 0.5) * 500)),
                  co2: Math.max(600, Math.min(1500, cell.co2 + (Math.random() - 0.5) * 50)),
                  waterLevel: Math.max(50, Math.min(100, cell.waterLevel + (Math.random() - 0.5) * 3)),
                  health: Math.max(70, Math.min(100, cell.health + (Math.random() - 0.5) * 2))
                };
              });

              return {
                ...layer,
                cells: updatedCells,
                avgTemperature: updatedCells.reduce((sum, c) => sum + c.temperature, 0) / updatedCells.length,
                avgHumidity: updatedCells.reduce((sum, c) => sum + c.humidity, 0) / updatedCells.length,
                avgHealth: updatedCells.reduce((sum, c) => sum + c.health, 0) / updatedCells.length
              };
            });

            return {
              ...rack,
              layers: updatedLayers,
              isMoving: Math.random() > 0.98,
              position: rack.isMoving ? (rack.position === 'open' ? 'closed' : 'open') : rack.position
            };
          });

          return {
            ...house,
            racks: updatedRacks,
            temperature: Math.max(18, Math.min(28, house.temperature + (Math.random() - 0.5) * 0.3)),
            humidity: Math.max(55, Math.min(80, house.humidity + (Math.random() - 0.5) * 1.5)),
            co2: Math.max(800, Math.min(1500, house.co2 + (Math.random() - 0.5) * 20)),
            power: Math.max(70, Math.min(150, house.power + (Math.random() - 0.5) * 5)),
            waterUsage: Math.max(200, Math.min(400, house.waterUsage + (Math.random() - 0.5) * 10))
          };
        });

        return {
          ...prev,
          houses: updatedHouses
        };
      });

      setAutomation(prev => ({
        hoists: prev.hoists.map(hoist => ({
          ...hoist,
          status: Math.random() > 0.2 ? 'idle' : 'working',
          position: hoist.status === 'working' ? {
            rack: Math.floor(Math.random() * 6) + 1,
            layer: Math.floor(Math.random() * 4) + 1,
            column: Math.floor(Math.random() * 28) + 1
          } : hoist.position,
          currentLoad: hoist.status === 'working' ? Math.random() * 50 : 0,
          todayLifts: hoist.todayLifts + (Math.random() > 0.7 ? 1 : 0)
        })),
        avgs: prev.avgs.map(avg => ({
          ...avg,
          battery: avg.status === 'charging' 
            ? Math.min(100, avg.battery + 2) 
            : Math.max(20, avg.battery - 0.5),
          status: avg.battery < 25 ? 'charging' : 
                  avg.battery > 80 && avg.status === 'charging' ? 'active' : avg.status,
          currentHouse: avg.status === 'active' ? Math.floor(Math.random() * 5) + 1 : avg.currentHouse,
          speed: avg.status === 'active' ? Math.random() * 1.2 : 0,
          todayTrips: avg.todayTrips + (avg.status === 'active' && Math.random() > 0.95 ? 1 : 0)
        })),
        mobileRacks: prev.mobileRacks
      }));

      calculateMetrics();
      generateAlerts();

    }, 5000);

    initializeAutomation();
    calculateMetrics();
    generateAlerts();

    return () => clearInterval(interval);
  }, [farmData.houses.length]);

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthBg = (health) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGrowthColor = (stage) => {
    if (stage >= 80) return 'bg-green-500';
    if (stage >= 60) return 'bg-blue-500';
    if (stage >= 40) return 'bg-yellow-500';
    if (stage >= 20) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              🌱 누리팜 디지털 트윈
            </h1>
            <p className="text-gray-400 text-lg">Nuri Farm Smart Farm Digital Twin - Real-time 3D Monitoring System</p>
          </div>
          <div className="text-right">
            <div className="text-cyan-400 text-3xl font-bold">
              {currentTime.toLocaleTimeString('ko-KR')}
            </div>
            <div className="text-gray-500">
              {currentTime.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Sprout className="text-green-400 w-8 h-8" />
              <div className="text-xs text-green-400 font-bold">TOTAL</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">총 누리셀</div>
            <div className="text-white text-3xl font-bold">{farmData.totalCells.toLocaleString()}</div>
            <div className="text-green-400 text-sm">개</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Activity className="text-blue-400 w-8 h-8" />
              <div className="text-xs text-blue-400 font-bold">ACTIVE</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">활성 셀</div>
            <div className="text-white text-3xl font-bold">{farmData.activeCells.toLocaleString()}</div>
            <div className="text-blue-400 text-sm">{((farmData.activeCells / farmData.totalCells) * 100).toFixed(1)}%</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ThermometerSun className="text-purple-400 w-8 h-8" />
              <div className="text-xs text-purple-400 font-bold">TEMP</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">평균 온도</div>
            <div className="text-white text-3xl font-bold">{realtimeMetrics.temperature.toFixed(1)}</div>
            <div className="text-purple-400 text-sm">°C</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="text-cyan-400 w-8 h-8" />
              <div className="text-xs text-cyan-400 font-bold">HUMIDITY</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">평균 습도</div>
            <div className="text-white text-3xl font-bold">{realtimeMetrics.humidity.toFixed(1)}</div>
            <div className="text-cyan-400 text-sm">%</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Zap className="text-yellow-400 w-8 h-8" />
              <div className="text-xs text-yellow-400 font-bold">POWER</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">총 전력</div>
            <div className="text-white text-3xl font-bold">{realtimeMetrics.power.toFixed(0)}</div>
            <div className="text-yellow-400 text-sm">kW</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-orange-400 text-2xl">💚</div>
              <div className="text-xs text-orange-400 font-bold">HEALTH</div>
            </div>
            <div className="text-gray-400 text-xs mb-1">시스템 건강도</div>
            <div className="text-white text-3xl font-bold">{farmData.systemHealth.toFixed(1)}</div>
            <div className="text-orange-400 text-sm">%</div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-4 border border-gray-700/50 shadow-xl mb-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              실시간 알림
              <span className="ml-auto text-xs text-gray-500">{alerts.length}개</span>
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {alerts.map((alert, idx) => (
                <div 
                  key={idx}
                  className={`rounded-lg p-3 border flex items-center gap-2 ${
                    alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                    alert.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-500 animate-pulse' :
                    alert.severity === 'medium' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-white text-xs">{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            3D 농장 레이아웃
            <div className="ml-auto flex gap-2">
              <button 
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'overview' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                전체 뷰
              </button>
              <button 
                onClick={() => setViewMode('house')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'house' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                하우스 뷰
              </button>
            </div>
          </h2>

          <div className="bg-gray-900/50 rounded-lg p-6">
            <div className="grid grid-cols-5 gap-6">
              {farmData.houses.map((house) => (
                <div 
                  key={house.id}
                  onClick={() => setSelectedHouse(house.id === selectedHouse ? null : house.id)}
                  className={`bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-4 border-2 transition-all cursor-pointer hover:scale-105 ${
                    selectedHouse === house.id 
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/50' 
                      : 'border-gray-600/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-xl font-bold text-white mb-1">🏠 House {house.id}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      house.status === 'operational' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {house.status === 'operational' ? '정상 운영' : '점검중'}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">활성 셀:</span>
                      <span className="text-white font-bold">{house.activeCells}/{house.totalCells}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">온도:</span>
                      <span className="text-purple-400 font-semibold">{house.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">습도:</span>
                      <span className="text-cyan-400 font-semibold">{house.humidity.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CO2:</span>
                      <span className="text-green-400 font-semibold">{house.co2.toFixed(0)} ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">전력:</span>
                      <span className="text-yellow-400 font-semibold">{house.power.toFixed(1)} kW</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${(house.activeCells / house.totalCells) * 100}%` }}
                      />
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">
                      {((house.activeCells / house.totalCells) * 100).toFixed(1)}% 가동중
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedHouse && farmData.houses.find(h => h.id === selectedHouse) && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              House {selectedHouse} - 상세 정보
              <button 
                onClick={() => setSelectedHouse(null)}
                className="ml-auto px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
              >
                닫기
              </button>
            </h2>

            <div className="bg-gray-900/50 rounded-lg p-6 mb-4">
              <h3 className="text-white font-bold mb-4">6단 랙 구조</h3>
              <div className="grid grid-cols-6 gap-4">
                {farmData.houses.find(h => h.id === selectedHouse).racks.map((rack) => (
                  <div 
                    key={rack.id}
                    onClick={() => setSelectedRack(rack.id === selectedRack ? null : rack.id)}
                    className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                      selectedRack === rack.id 
                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/50' 
                        : rack.type === 'fixed' 
                          ? 'border-gray-500/50 bg-gray-700/30' 
                          : rack.type === 'mobile-a'
                            ? 'border-blue-500/50 bg-blue-500/10'
                            : 'border-purple-500/50 bg-purple-500/10'
                    }`}
                  >
                    <div className="text-center mb-2">
                      <div className="text-lg font-bold text-white">Rack {rack.id}</div>
                      <div className={`text-xs ${
                        rack.type === 'fixed' ? 'text-gray-400' : 
                        rack.type === 'mobile-a' ? 'text-blue-400' : 'text-purple-400'
                      }`}>
                        {rack.name}
                      </div>
                      {rack.isMoving && (
                        <div className="text-yellow-400 text-xs animate-bounce">⟷ 이동중</div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">활성:</span>
                        <span className="text-green-400">{rack.activeCells}/112</span>
                      </div>
                      {rack.type !== 'fixed' && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">위치:</span>
                          <span className="text-cyan-400">{rack.position === 'open' ? '열림' : '닫힘'}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="w-full bg-gray-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            rack.type === 'fixed' ? 'bg-gray-500' :
                            rack.type === 'mobile-a' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${(rack.activeCells / rack.totalCells) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRack && (
              <div className="bg-gray-900/50 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">
                  Rack {selectedRack} - 4개 층 상세
                </h3>
                <div className="space-y-3">
                  {farmData.houses.find(h => h.id === selectedHouse).racks.find(r => r.id === selectedRack).layers.map((layer) => (
                    <div key={layer.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-white font-bold">Layer {layer.id}</div>
                          <div className="text-xs text-gray-400">28개 컬럼</div>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <div className="text-purple-400">평균 온도: {layer.avgTemperature.toFixed(1)}°C</div>
                          <div className="text-cyan-400">평균 습도: {layer.avgHumidity.toFixed(1)}%</div>
                          <div className="text-green-400">평균 건강도: {layer.avgHealth.toFixed(1)}%</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-28 gap-1">
                        {layer.cells.map((cell) => (
                          <div
                            key={cell.id}
                            onClick={() => setSelectedCell(cell.id === selectedCell?.id ? null : cell)}
                            className={`aspect-square rounded cursor-pointer transition-all hover:scale-125 hover:z-10 ${
                              !cell.isActive ? 'bg-gray-700' : getGrowthColor(cell.growthStage)
                            } ${
                              selectedCell?.id === cell.id ? 'ring-2 ring-white scale-125 z-10' : ''
                            }`}
                            title={`${cell.id}\n${cell.crop.name}\n성장: ${cell.growthStage.toFixed(0)}%\n건강도: ${cell.health.toFixed(0)}%`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedCell && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-2xl">{selectedCell.crop.icon}</span>
                  누리셀 상세 정보 - {selectedCell.id}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-lg" style={{ color: selectedCell.crop.color }}>
                    {selectedCell.crop.name} ({selectedCell.crop.nameEn})
                  </span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedCell.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedCell.isActive ? '활성' : '비활성'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
                닫기
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                <div className="text-green-400 text-sm mb-2 font-semibold">성장 단계</div>
                <div className="text-white text-4xl font-bold mb-2">{selectedCell.growthStage.toFixed(1)}%</div>
                <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${getGrowthColor(selectedCell.growthStage)}`}
                    style={{ width: `${selectedCell.growthStage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  재배 주기: {selectedCell.crop.cycle}일
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="text-blue-400 text-sm mb-2 font-semibold">건강도</div>
                <div className={`text-4xl font-bold mb-2 ${getHealthColor(selectedCell.health)}`}>
                  {selectedCell.health.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-600 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full ${getHealthBg(selectedCell.health)}`}
                    style={{ width: `${selectedCell.health}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {selectedCell.health >= 90 ? '매우 건강' : 
                   selectedCell.health >= 75 ? '건강' : '주의 필요'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
                <div className="text-purple-400 text-sm mb-3 font-semibold">환경 데이터</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">온도:</span>
                    <span className="text-purple-400 font-semibold">{selectedCell.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">습도:</span>
                    <span className="text-cyan-400 font-semibold">{selectedCell.humidity.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CO2:</span>
                    <span className="text-green-400 font-semibold">{selectedCell.co2.toFixed(0)} ppm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">조도:</span>
                    <span className="text-yellow-400 font-semibold">{selectedCell.light.toFixed(0)} Lux</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/30">
                <div className="text-orange-400 text-sm mb-3 font-semibold">양액 정보</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">pH:</span>
                    <span className="text-orange-400 font-semibold">{selectedCell.ph.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">EC:</span>
                    <span className="text-red-400 font-semibold">{selectedCell.ec.toFixed(2)} mS/cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">수위:</span>
                    <span className="text-blue-400 font-semibold">{selectedCell.waterLevel.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">급수:</span>
                    <span className="text-gray-400 font-semibold">
                      {Math.floor((Date.now() - selectedCell.lastWatered.getTime()) / 60000)}분 전
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">작물 정보</h3>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 text-xs mb-1">재배 주기</div>
                  <div className="text-white font-semibold">{selectedCell.crop.cycle}일</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">수확 중량</div>
                  <div className="text-white font-semibold">{selectedCell.crop.weight}kg</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">kg당 가격</div>
                  <div className="text-white font-semibold">{selectedCell.crop.price.toLocaleString()}원</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">예상 수확일</div>
                  <div className="text-white font-semibold">
                    {selectedCell.nextHarvest.toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">예상 수익</div>
                  <div className="text-green-400 font-bold">
                    {(selectedCell.crop.weight * selectedCell.crop.price).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🏗️</span>
              천장형 호이스트
            </h3>
            <div className="space-y-3">
              {automation.hoists.map((hoist) => (
                <div 
                  key={hoist.id}
                  className={`rounded-lg p-3 border transition-all ${
                    hoist.status === 'working' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-gray-700/30 border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">House {hoist.house}</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      hoist.status === 'working' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {hoist.status === 'working' ? '작업중' : '대기'}
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>위치:</span>
                      <span className="text-cyan-400">R{hoist.position.rack}-L{hoist.position.layer}-C{hoist.position.column}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>하중:</span>
                      <span className="text-orange-400">{hoist.currentLoad.toFixed(1)}kg</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>금일 작업:</span>
                      <span className="text-white">{hoist.todayLifts}회</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🤖</span>
              AVG 물류 시스템
            </h3>
            <div className="space-y-3">
              {automation.avgs.map((avg) => (
                <div 
                  key={avg.id}
                  className={`rounded-lg p-3 border transition-all ${
                    avg.status === 'active' 
                      ? 'bg-cyan-500/10 border-cyan-500/30' 
                      : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">{avg.name}</span>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      avg.status === 'active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {avg.status === 'active' ? '운행중' : '충전중'}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">배터리</span>
                      <span className={`font-semibold ${
                        avg.battery > 70 ? 'text-green-400' :
                        avg.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {avg.battery.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          avg.battery > 70 ? 'bg-green-500' :
                          avg.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${avg.battery}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>위치:</span>
                      <span className="text-white">House {avg.currentHouse}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>속도:</span>
                      <span className="text-cyan-400">{avg.speed.toFixed(1)} m/s</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>금일 운행:</span>
                      <span className="text-white">{avg.todayTrips}회</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📈</span>
              실시간 평균 지표
            </h3>
            <div className="space-y-3">
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThermometerSun className="text-purple-400 w-5 h-5" />
                    <span className="text-purple-400 text-sm font-semibold">온도</span>
                  </div>
                  <span className="text-white text-xl font-bold">{realtimeMetrics.temperature.toFixed(1)}°C</span>
                </div>
              </div>

              <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplet className="text-cyan-400 w-5 h-5" />
                    <span className="text-cyan-400 text-sm font-semibold">습도</span>
                  </div>
                  <span className="text-white text-xl font-bold">{realtimeMetrics.humidity.toFixed(1)}%</span>
                </div>
              </div>

              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="text-green-400 w-5 h-5" />
                    <span className="text-green-400 text-sm font-semibold">CO2</span>
                  </div>
                  <span className="text-white text-xl font-bold">{realtimeMetrics.co2.toFixed(0)} ppm</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="text-yellow-400 w-5 h-5" />
                    <span className="text-yellow-400 text-sm font-semibold">조도</span>
                  </div>
                  <span className="text-white text-xl font-bold">{(realtimeMetrics.light / 1000).toFixed(1)}K Lux</span>
                </div>
              </div>

              <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 text-lg">⚗️</span>
                    <span className="text-orange-400 text-sm font-semibold">pH</span>
                  </div>
                  <span className="text-white text-xl font-bold">{realtimeMetrics.ph.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-lg">💧</span>
                    <span className="text-red-400 text-sm font-semibold">EC</span>
                  </div>
                  <span className="text-white text-xl font-bold">{realtimeMetrics.ec.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
