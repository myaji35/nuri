import React, { useState, useEffect } from 'react';

// Dashboard 4: 작물 재배 관리
// 10개 작물 성장 단계, 재배주기별 출하 계획, 수익성 분석, 위험도 평가

export default function CropManagementDashboard() {
  const [activeCrops, setActiveCrops] = useState([]);
  const [growthTracking, setGrowthTracking] = useState([]);
  const [yieldAnalysis, setYieldAnalysis] = useState([]);
  const [harvestPlan, setHarvestPlan] = useState([]);
  
  const cropDatabase = [
    { id: 1, name: '상추', temp: [18, 23], humidity: [60, 75], pH: [5.8, 6.3], EC: [1.2, 1.8], lux: [10000, 15000], color: '#90EE90', cycle: 28, harvestWeight: 0.15, pricePerKg: 12000 },
    { id: 2, name: '청경채', temp: [16, 22], humidity: [65, 80], pH: [6.0, 6.5], EC: [1.5, 2.0], lux: [12000, 18000], color: '#98FB98', cycle: 35, harvestWeight: 0.25, pricePerKg: 10000 },
    { id: 3, name: '케일', temp: [15, 20], humidity: [60, 75], pH: [6.0, 6.8], EC: [1.8, 2.5], lux: [15000, 20000], color: '#2E8B57', cycle: 45, harvestWeight: 0.30, pricePerKg: 15000 },
    { id: 4, name: '루꼴라', temp: [16, 21], humidity: [55, 70], pH: [6.0, 7.0], EC: [1.6, 2.2], lux: [11000, 16000], color: '#7CFC00', cycle: 25, harvestWeight: 0.12, pricePerKg: 18000 },
    { id: 5, name: '바질', temp: [20, 25], humidity: [65, 75], pH: [5.5, 6.5], EC: [1.4, 2.0], lux: [14000, 18000], color: '#32CD32', cycle: 40, harvestWeight: 0.20, pricePerKg: 20000 },
    { id: 6, name: '민트', temp: [18, 24], humidity: [60, 70], pH: [6.0, 7.0], EC: [1.8, 2.4], lux: [10000, 14000], color: '#00FA9A', cycle: 30, harvestWeight: 0.18, pricePerKg: 22000 },
    { id: 7, name: '시금치', temp: [15, 20], humidity: [65, 75], pH: [6.5, 7.0], EC: [1.8, 2.3], lux: [12000, 16000], color: '#228B22', cycle: 32, harvestWeight: 0.22, pricePerKg: 9000 },
    { id: 8, name: '파슬리', temp: [18, 22], humidity: [60, 75], pH: [6.0, 7.0], EC: [1.6, 2.0], lux: [13000, 17000], color: '#3CB371', cycle: 38, harvestWeight: 0.16, pricePerKg: 16000 },
    { id: 9, name: '깻잎', temp: [20, 26], humidity: [65, 80], pH: [6.0, 6.5], EC: [1.5, 2.0], lux: [12000, 16000], color: '#6B8E23', cycle: 42, harvestWeight: 0.28, pricePerKg: 14000 },
    { id: 10, name: '로메인', temp: [17, 22], humidity: [60, 70], pH: [5.8, 6.5], EC: [1.4, 1.9], lux: [11000, 15000], color: '#9ACD32', cycle: 50, harvestWeight: 0.35, pricePerKg: 11000 }
  ];

  useEffect(() => {
    // Initialize active crops with growth data
    const crops = cropDatabase.map(crop => {
      const count = Math.floor(850 / crop.id + Math.random() * 200);
      const plantDate = new Date();
      plantDate.setDate(plantDate.getDate() - Math.floor(Math.random() * crop.cycle));
      
      const daysGrown = Math.floor((new Date() - plantDate) / (1000 * 60 * 60 * 24));
      const growthStage = Math.min(100, (daysGrown / crop.cycle) * 100);
      
      let stage = '발아';
      if (growthStage > 80) stage = '수확준비';
      else if (growthStage > 60) stage = '후기생장';
      else if (growthStage > 40) stage = '중기생장';
      else if (growthStage > 20) stage = '초기생장';
      
      return {
        ...crop,
        count,
        plantDate,
        daysGrown,
        growthStage,
        stage,
        health: 85 + Math.random() * 15,
        expectedHarvestDate: new Date(plantDate.getTime() + crop.cycle * 24 * 60 * 60 * 1000)
      };
    });
    
    setActiveCrops(crops);

    // Growth tracking data
    const tracking = crops.map(crop => ({
      crop: crop.name,
      color: crop.color,
      week1: Math.random() * 30,
      week2: 30 + Math.random() * 20,
      week3: 50 + Math.random() * 20,
      week4: 70 + Math.random() * 20,
      current: crop.growthStage
    }));
    setGrowthTracking(tracking);

    // Yield analysis
    const analysis = crops.map(crop => {
      const expectedYield = crop.count * crop.harvestWeight;
      const actualYieldRate = 0.85 + Math.random() * 0.15;
      const actualYield = expectedYield * actualYieldRate;
      const revenue = actualYield * crop.pricePerKg;
      const cost = crop.count * 500; // 개당 생산비용
      const profit = revenue - cost;
      const roi = (profit / cost) * 100;
      
      return {
        crop: crop.name,
        color: crop.color,
        expectedYield: expectedYield.toFixed(1),
        actualYield: actualYield.toFixed(1),
        yieldRate: (actualYieldRate * 100).toFixed(1),
        revenue: revenue.toFixed(0),
        cost: cost.toFixed(0),
        profit: profit.toFixed(0),
        roi: roi.toFixed(1),
        pricePerKg: crop.pricePerKg
      };
    });
    setYieldAnalysis(analysis);

    // Harvest plan (WorkDay only - Monday to Friday)
    const plan = [];
    crops.forEach(crop => {
      const harvestDate = new Date(crop.expectedHarvestDate);
      
      // Adjust to next WorkDay if falls on weekend
      const dayOfWeek = harvestDate.getDay();
      if (dayOfWeek === 0) { // Sunday -> Monday
        harvestDate.setDate(harvestDate.getDate() + 1);
      } else if (dayOfWeek === 6) { // Saturday -> Monday
        harvestDate.setDate(harvestDate.getDate() + 2);
      }
      
      plan.push({
        crop: crop.name,
        color: crop.color,
        harvestDate: harvestDate,
        quantity: crop.count,
        weight: (crop.count * crop.harvestWeight).toFixed(1),
        daysUntil: Math.ceil((harvestDate - new Date()) / (1000 * 60 * 60 * 24)),
        status: crop.growthStage > 90 ? '수확준비' : crop.growthStage > 70 ? '성장중' : '재배중',
        priority: crop.growthStage > 90 ? 'high' : crop.growthStage > 70 ? 'medium' : 'low'
      });
    });
    setHarvestPlan(plan.sort((a, b) => a.daysUntil - b.daysUntil));

    // Real-time update
    const interval = setInterval(() => {
      setActiveCrops(prev => prev.map(crop => ({
        ...crop,
        daysGrown: Math.floor((new Date() - crop.plantDate) / (1000 * 60 * 60 * 24)),
        growthStage: Math.min(100, crop.growthStage + 0.01),
        health: Math.max(75, Math.min(100, crop.health + (Math.random() - 0.5) * 2))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌱 작물 재배 관리</h1>
          <p className="text-gray-400">성장 단계 추적 · 수확 계획 · 수익성 분석 · 품질 관리</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <div className="text-green-400 text-2xl mb-2">🌿</div>
            <div className="text-gray-400 text-xs mb-1">재배 작물</div>
            <div className="text-white text-3xl font-bold">{activeCrops.length}</div>
            <div className="text-gray-500 text-xs mt-1">품종</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-400 text-2xl mb-2">📊</div>
            <div className="text-gray-400 text-xs mb-1">총 재배량</div>
            <div className="text-white text-3xl font-bold">
              {activeCrops.reduce((sum, c) => sum + c.count, 0).toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs mt-1">개</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
            <div className="text-purple-400 text-2xl mb-2">⚖️</div>
            <div className="text-gray-400 text-xs mb-1">예상 수확량</div>
            <div className="text-white text-3xl font-bold">
              {yieldAnalysis.reduce((sum, y) => sum + parseFloat(y.expectedYield), 0).toFixed(0)}
            </div>
            <div className="text-gray-500 text-xs mt-1">kg</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-500/30">
            <div className="text-yellow-400 text-2xl mb-2">💰</div>
            <div className="text-gray-400 text-xs mb-1">예상 매출</div>
            <div className="text-white text-3xl font-bold">
              {(yieldAnalysis.reduce((sum, y) => sum + parseFloat(y.revenue), 0) / 10000).toFixed(0)}
            </div>
            <div className="text-gray-500 text-xs mt-1">만원</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-4 border border-red-500/30">
            <div className="text-red-400 text-2xl mb-2">📈</div>
            <div className="text-gray-400 text-xs mb-1">평균 ROI</div>
            <div className="text-white text-3xl font-bold">
              {(yieldAnalysis.reduce((sum, y) => sum + parseFloat(y.roi), 0) / yieldAnalysis.length).toFixed(0)}%
            </div>
            <div className="text-gray-500 text-xs mt-1">수익률</div>
          </div>
        </div>

        {/* Growth Stage Tracking */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            작물별 성장 단계
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {activeCrops.map((crop, idx) => (
              <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${crop.color}30`, border: `2px solid ${crop.color}` }}
                    >
                      🌱
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{crop.name}</div>
                      <div className="text-gray-400 text-xs">
                        {crop.count}개 · D+{crop.daysGrown}일
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded font-semibold ${
                      crop.stage === '수확준비' ? 'bg-green-500/20 text-green-400' :
                      crop.stage === '후기생장' ? 'bg-blue-500/20 text-blue-400' :
                      crop.stage === '중기생장' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {crop.stage}
                    </div>
                    <div className="text-white text-2xl font-bold mt-1">
                      {crop.growthStage.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">성장 진행률</span>
                      <span style={{ color: crop.color }}>{crop.growthStage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${crop.growthStage}%`,
                          backgroundColor: crop.color
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">건강 상태</span>
                      <span className={crop.health > 90 ? 'text-green-400' : crop.health > 75 ? 'text-yellow-400' : 'text-red-400'}>
                        {crop.health.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          crop.health > 90 ? 'bg-green-500' : 
                          crop.health > 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${crop.health}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">식재일</div>
                      <div className="text-white font-semibold">
                        {crop.plantDate.getMonth() + 1}/{crop.plantDate.getDate()}
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">수확 예정</div>
                      <div className="text-cyan-400 font-semibold">
                        {crop.expectedHarvestDate.getMonth() + 1}/{crop.expectedHarvestDate.getDate()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Harvest Plan (WorkDay Only) */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            출하 계획 (WorkDay만)
          </h2>

          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <div className="text-blue-300 text-sm">
                <span className="font-bold">WorkDay 출하:</span> 모든 출하는 평일(월~금)에만 이루어집니다. 주말 출하 예정은 자동으로 다음 월요일로 조정됩니다.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {harvestPlan.map((plan, idx) => {
              const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][plan.harvestDate.getDay()];
              const isWorkDay = plan.harvestDate.getDay() >= 1 && plan.harvestDate.getDay() <= 5;
              
              return (
                <div 
                  key={idx}
                  className={`rounded-lg p-4 flex items-center justify-between ${
                    plan.priority === 'high' ? 'bg-green-500/20 border border-green-500/40' :
                    plan.priority === 'medium' ? 'bg-yellow-500/20 border border-yellow-500/40' :
                    'bg-gray-700/50 border border-gray-600/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex flex-col items-center justify-center"
                      style={{ backgroundColor: `${plan.color}30`, border: `2px solid ${plan.color}` }}
                    >
                      <div className="text-white text-xs">{plan.harvestDate.getMonth() + 1}월</div>
                      <div className="text-white text-2xl font-bold">{plan.harvestDate.getDate()}</div>
                      <div className={`text-xs font-bold ${isWorkDay ? 'text-green-400' : 'text-red-400'}`}>
                        {dayOfWeek}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-white font-bold text-lg">{plan.crop}</div>
                      <div className="text-gray-400 text-sm">
                        {plan.quantity}개 · {plan.weight}kg
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          plan.status === '수확준비' ? 'bg-green-500/20 text-green-400' :
                          plan.status === '성장중' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {plan.status}
                        </span>
                        {isWorkDay && (
                          <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-500/20 text-blue-400">
                            ✓ WorkDay
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-xs mb-1">D-Day</div>
                    <div className={`text-3xl font-bold ${
                      plan.daysUntil <= 3 ? 'text-red-400' :
                      plan.daysUntil <= 7 ? 'text-yellow-400' :
                      'text-cyan-400'
                    }`}>
                      {plan.daysUntil > 0 ? `D-${plan.daysUntil}` : 'Today'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yield Analysis */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            수익성 분석
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">작물</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">예상수확(kg)</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">실제수확(kg)</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">수확률(%)</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">kg당가격</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">매출</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">비용</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">순이익</th>
                  <th className="text-center py-3 px-2 text-gray-400 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {yieldAnalysis.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi)).map((analysis, idx) => (
                  <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: analysis.color }}
                        ></div>
                        <span className="text-white font-semibold">{analysis.crop}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">{analysis.expectedYield}</td>
                    <td className="text-center py-3 px-2 text-cyan-400 font-semibold">{analysis.actualYield}</td>
                    <td className="text-center py-3 px-2">
                      <span className={`font-semibold ${
                        parseFloat(analysis.yieldRate) > 95 ? 'text-green-400' :
                        parseFloat(analysis.yieldRate) > 85 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysis.yieldRate}%
                      </span>
                    </td>
                    <td className="text-center py-3 px-2 text-gray-300">
                      {analysis.pricePerKg.toLocaleString()}원
                    </td>
                    <td className="text-center py-3 px-2 text-blue-400 font-semibold">
                      {(parseFloat(analysis.revenue) / 10000).toFixed(0)}만
                    </td>
                    <td className="text-center py-3 px-2 text-orange-400">
                      {(parseFloat(analysis.cost) / 10000).toFixed(0)}만
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`font-semibold ${
                        parseFloat(analysis.profit) > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {parseFloat(analysis.profit) > 0 ? '+' : ''}{(parseFloat(analysis.profit) / 10000).toFixed(0)}만
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`font-bold text-lg ${
                        parseFloat(analysis.roi) > 100 ? 'text-green-400' :
                        parseFloat(analysis.roi) > 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {analysis.roi}%
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
