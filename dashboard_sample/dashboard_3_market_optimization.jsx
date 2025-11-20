import React, { useState, useEffect } from 'react';

// Dashboard 3: 시장 & 출하 최적화
// 전국 도매시장 모니터링, AI 가격 예측, 출하 스케줄 관리

export default function MarketOptimizationDashboard() {
  const [marketData, setMarketData] = useState({
    prices: [],
    trends: [],
    forecast: [],
    markets: []
  });
  
  const [plantingOptimization, setPlantingOptimization] = useState({
    recommendations: [],
    profitability: [],
    riskAnalysis: []
  });
  
  const [harvestSchedule, setHarvestSchedule] = useState([]);
  
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
    const crops = [
      { ...cropDatabase[0], count: 850 },
      { ...cropDatabase[1], count: 620 },
      { ...cropDatabase[2], count: 450 },
      { ...cropDatabase[3], count: 340 },
      { ...cropDatabase[4], count: 280 },
      { ...cropDatabase[5], count: 260 },
      { ...cropDatabase[6], count: 220 },
      { ...cropDatabase[7], count: 180 },
      { ...cropDatabase[8], count: 100 },
      { ...cropDatabase[9], count: 60 }
    ];

    // Initialize wholesale markets
    const markets = [
      { id: 1, name: '가락시장', location: '서울', type: '종합' },
      { id: 2, name: '강서시장', location: '서울', type: '농산물' },
      { id: 3, name: '엄궁시장', location: '부산', type: '농산물' },
      { id: 4, name: '북부시장', location: '대구', type: '농산물' },
      { id: 5, name: '서부시장', location: '대전', type: '농산물' },
      { id: 6, name: '광주시장', location: '광주', type: '농산물' }
    ];
    
    const marketPrices = [];
    const marketForecast = [];
    
    crops.forEach(crop => {
      const basePrice = crop.harvestWeight * (8000 + Math.random() * 4000);
      
      markets.forEach(market => {
        const currentPrice = basePrice * (0.85 + Math.random() * 0.3);
        marketPrices.push({
          crop: crop.name,
          market: market.name,
          location: market.location,
          price: currentPrice,
          pricePerKg: currentPrice / crop.harvestWeight,
          change: -5 + Math.random() * 10,
          volume: Math.floor(1000 + Math.random() * 5000),
          timestamp: new Date()
        });
        
        const forecast = [];
        for (let i = 1; i <= 60; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          forecast.push({
            date: date,
            predictedPrice: basePrice * (0.9 + Math.random() * 0.3 + Math.sin(i / 7) * 0.15),
            confidence: 95 - i * 0.5
          });
        }
        marketForecast.push({
          crop: crop.name,
          market: market.name,
          data: forecast
        });
      });
    });
    
    setMarketData({
      prices: marketPrices,
      trends: [],
      forecast: marketForecast,
      markets: markets
    });

    // Generate harvest schedule (WorkDay only: Monday-Friday)
    const today = new Date();
    const schedule = [];
    
    crops.forEach(crop => {
      const batchSize = Math.ceil(crop.count / (crop.cycle / 7));
      let daysAdded = 0;
      let dayOffset = 0;
      
      // Generate harvest schedule for next 30 days, WorkDays only
      while (daysAdded < 5) {  // ~5 harvests per crop over 30 days
        const harvestDate = new Date(today);
        harvestDate.setDate(today.getDate() + dayOffset);
        
        const dayOfWeek = harvestDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
        
        // Only schedule on WorkDays (Monday=1 to Friday=5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          schedule.push({
            date: new Date(harvestDate),
            crop: crop.name,
            quantity: batchSize,
            weight: (batchSize * crop.harvestWeight).toFixed(1),
            status: dayOffset < 7 ? '준비중' : '예정',
            color: crop.color,
            dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][dayOfWeek]
          });
          daysAdded++;
          dayOffset += 7; // Next week same day
        } else {
          dayOffset++; // Skip to next day
        }
      }
    });
    
    setHarvestSchedule(schedule.sort((a, b) => a.date - b.date));

    // AI Recommendations
    const recommendations = [];
    crops.forEach(crop => {
      const avgFuturePrice = marketForecast
        .filter(f => f.crop === crop.name)
        .reduce((sum, f) => {
          const futurePrices = f.data.slice(crop.cycle, crop.cycle + 7);
          return sum + futurePrices.reduce((s, d) => s + d.predictedPrice, 0) / futurePrices.length;
        }, 0) / markets.length;
      
      const currentAvgPrice = marketPrices
        .filter(p => p.crop === crop.name)
        .reduce((sum, p) => sum + p.price, 0) / markets.length;
      
      const priceGainPotential = ((avgFuturePrice - currentAvgPrice) / currentAvgPrice) * 100;
      const productionCost = crop.count * crop.harvestWeight * 3000;
      const expectedRevenue = crop.count * avgFuturePrice;
      const profit = expectedRevenue - productionCost;
      const roi = (profit / productionCost) * 100;
      
      const priceVolatility = Math.random() * 800;
      const riskLevel = priceVolatility > 500 ? 'high' : priceVolatility > 200 ? 'medium' : 'low';
      
      let action = 'hold';
      let confidence = 0;
      
      if (priceGainPotential > 15 && riskLevel !== 'high') {
        action = 'increase';
        confidence = 85 + Math.random() * 10;
      } else if (priceGainPotential < -10 || riskLevel === 'high') {
        action = 'decrease';
        confidence = 75 + Math.random() * 15;
      } else {
        action = 'maintain';
        confidence = 70 + Math.random() * 20;
      }
      
      recommendations.push({
        crop: crop.name,
        action: action,
        confidence: confidence,
        currentPrice: currentAvgPrice,
        forecastPrice: avgFuturePrice,
        priceGain: priceGainPotential,
        optimalPlantDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        optimalHarvestDate: new Date(Date.now() + (crop.cycle + Math.random() * 3) * 24 * 60 * 60 * 1000),
        expectedProfit: profit,
        roi: roi,
        riskLevel: riskLevel,
        marketDemand: 'high',
        recommendedQuantity: action === 'increase' ? Math.floor(crop.count * 1.2) : 
                            action === 'decrease' ? Math.floor(crop.count * 0.8) : crop.count
      });
    });
    
    setPlantingOptimization({
      recommendations: recommendations.sort((a, b) => b.roi - a.roi),
      profitability: recommendations.map(r => ({
        crop: r.crop,
        profit: r.expectedProfit,
        roi: r.roi
      })),
      riskAnalysis: recommendations.map(r => ({
        crop: r.crop,
        risk: r.riskLevel,
        volatility: Math.random() * 1000
      }))
    });

    // Real-time price update
    const interval = setInterval(() => {
      setMarketData(prev => ({
        ...prev,
        prices: prev.prices.map(p => ({
          ...p,
          price: p.price * (0.98 + Math.random() * 0.04),
          change: -3 + Math.random() * 6,
          volume: Math.floor(p.volume * (0.95 + Math.random() * 0.1))
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
          <h1 className="text-4xl font-bold text-white mb-2">💰 시장 & 출하 최적화</h1>
          <p className="text-gray-400">전국 도매시장 모니터링 · AI 가격 예측 · 출하 스케줄 관리</p>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {marketData.markets?.map((market, idx) => {
            const marketPrices = marketData.prices.filter(p => p.market === market.name);
            const avgPrice = marketPrices.reduce((sum, p) => sum + p.pricePerKg, 0) / marketPrices.length;
            const avgChange = marketPrices.reduce((sum, p) => sum + p.change, 0) / marketPrices.length;
            
            return (
              <div key={idx} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div className="text-white font-bold text-sm mb-1">{market.name}</div>
                <div className="text-xs text-gray-400 mb-2">{market.location}</div>
                <div className="flex items-center justify-between">
                  <div className="text-white text-lg font-bold">
                    {avgPrice.toLocaleString()}원
                  </div>
                  <div className={`text-xs font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {avgChange >= 0 ? '↑' : '↓'} {Math.abs(avgChange).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Crop Price Comparison */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            작물별 시장 가격 현황
          </h2>
          
          <div className="grid grid-cols-10 gap-2">
            {cropDatabase.map((crop, idx) => {
              const cropPrices = marketData.prices.filter(p => p.crop === crop.name);
              const avgPrice = cropPrices.reduce((sum, p) => sum + p.pricePerKg, 0) / cropPrices.length || 0;
              const maxPrice = Math.max(...cropPrices.map(p => p.pricePerKg), 0);
              const minPrice = Math.min(...cropPrices.map(p => p.pricePerKg), Infinity);
              
              return (
                <div key={idx} className="bg-gray-700/30 rounded p-2">
                  <div className="flex items-center gap-1 mb-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: crop.color }}
                    ></div>
                    <div className="text-white text-xs font-semibold">{crop.name}</div>
                  </div>
                  <div className="text-cyan-400 text-sm font-bold mb-1">
                    {avgPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>최고</span>
                      <span className="text-green-400">{maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>최저</span>
                      <span className="text-red-400">{minPrice === Infinity ? '0' : minPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Planting Recommendations */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            AI 식재 최적화 권고
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 text-2xl mb-2">📈</div>
              <div className="text-gray-400 text-xs mb-1">증량 권장</div>
              <div className="text-white text-2xl font-bold">
                {plantingOptimization.recommendations.filter(r => r.action === 'increase').length}
              </div>
              <div className="text-gray-500 text-xs mt-1">작물</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/30">
              <div className="text-yellow-400 text-2xl mb-2">➡️</div>
              <div className="text-gray-400 text-xs mb-1">현상 유지</div>
              <div className="text-white text-2xl font-bold">
                {plantingOptimization.recommendations.filter(r => r.action === 'maintain').length}
              </div>
              <div className="text-gray-500 text-xs mt-1">작물</div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/30">
              <div className="text-red-400 text-2xl mb-2">📉</div>
              <div className="text-gray-400 text-xs mb-1">감량 권장</div>
              <div className="text-white text-2xl font-bold">
                {plantingOptimization.recommendations.filter(r => r.action === 'decrease').length}
              </div>
              <div className="text-gray-500 text-xs mt-1">작물</div>
            </div>
          </div>

          <div className="space-y-2">
            {plantingOptimization.recommendations.slice(0, 5).map((rec, idx) => {
              const crop = cropDatabase.find(c => c.name === rec.crop);
              return (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${crop?.color}20`, border: `2px solid ${crop?.color}` }}
                      >
                        🌿
                      </div>
                      <div>
                        <div className="text-white font-bold">{rec.crop}</div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded ${
                            rec.action === 'increase' ? 'bg-green-500/20 text-green-400' :
                            rec.action === 'decrease' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {rec.action === 'increase' ? '증량' : rec.action === 'decrease' ? '감량' : '유지'}
                          </span>
                          <span className="text-gray-400">신뢰도: {rec.confidence.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">예상 ROI</div>
                      <div className={`text-2xl font-bold ${rec.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {rec.roi >= 0 ? '+' : ''}{rec.roi.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">현재가</div>
                      <div className="text-white font-bold">
                        {rec.currentPrice.toLocaleString()}원
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">예상가</div>
                      <div className="text-cyan-400 font-bold">
                        {rec.forecastPrice.toLocaleString()}원
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">가격상승</div>
                      <div className={`font-bold ${rec.priceGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {rec.priceGain >= 0 ? '+' : ''}{rec.priceGain.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded p-2">
                      <div className="text-gray-500 mb-1">위험도</div>
                      <div className={`font-bold ${
                        rec.riskLevel === 'low' ? 'text-green-400' :
                        rec.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {rec.riskLevel === 'low' ? '낮음' : rec.riskLevel === 'medium' ? '보통' : '높음'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Harvest Schedule */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            출하 스케줄 (향후 30일)
          </h2>
          
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <div className="text-blue-300 text-sm">
                <span className="font-bold">WorkDay 출하 정책:</span> 출하는 평일(월~금)에만 이루어지며, 주말(토~일)에는 출하하지 않습니다.
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div 
                key={idx} 
                className={`text-center text-xs font-semibold py-2 ${
                  idx === 0 || idx === 6 ? 'text-red-400' : 'text-gray-400'
                }`}
              >
                {day}
                {idx === 0 || idx === 6 ? ' 🚫' : ''}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dayOfWeek = date.getDay(); // 0=Sunday, 6=Saturday
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              
              const daySchedule = harvestSchedule.filter(s => 
                s.date.toDateString() === date.toDateString()
              );
              
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-lg p-2 transition-all ${
                    isWeekend
                      ? 'bg-red-500/10 border border-red-500/30 opacity-50 cursor-not-allowed'
                      : daySchedule.length > 0 
                        ? 'bg-green-500/20 border border-green-500/50 hover:scale-105 cursor-pointer' 
                        : 'bg-gray-700/30 border border-gray-600/30 hover:bg-gray-700/50 cursor-pointer'
                  }`}
                  title={isWeekend ? `${date.getMonth()+1}/${date.getDate()} (주말 - 출하 불가)` : `${date.getMonth()+1}/${date.getDate()}`}
                >
                  <div className={`text-xs font-bold mb-1 ${
                    isWeekend ? 'text-red-400' : 'text-white'
                  }`}>
                    {date.getDate()}
                    {isWeekend && <span className="ml-1">🚫</span>}
                  </div>
                  {!isWeekend && daySchedule.length > 0 && (
                    <div className="space-y-1">
                      {daySchedule.slice(0, 2).map((schedule, idx) => (
                        <div 
                          key={idx}
                          className="text-xs rounded px-1 truncate font-semibold"
                          style={{ backgroundColor: `${schedule.color}40`, color: schedule.color }}
                          title={`${schedule.crop}: ${schedule.weight}kg (${schedule.quantity}개)`}
                        >
                          {schedule.crop.slice(0, 2)}
                        </div>
                      ))}
                      {daySchedule.length > 2 && (
                        <div className="text-xs text-gray-400">+{daySchedule.length - 2}</div>
                      )}
                    </div>
                  )}
                  {isWeekend && (
                    <div className="text-xs text-red-400/50 text-center mt-1">
                      휴무
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Harvest Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
              <div className="text-green-400 text-2xl mb-2">📦</div>
              <div className="text-gray-400 text-xs mb-1">총 출하 예정</div>
              <div className="text-white text-3xl font-bold">
                {harvestSchedule.length}
              </div>
              <div className="text-gray-500 text-xs mt-1">건 (WorkDay)</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/30">
              <div className="text-blue-400 text-2xl mb-2">⚖️</div>
              <div className="text-gray-400 text-xs mb-1">총 중량</div>
              <div className="text-white text-3xl font-bold">
                {harvestSchedule.reduce((sum, s) => sum + parseFloat(s.weight), 0).toFixed(0)}
              </div>
              <div className="text-gray-500 text-xs mt-1">kg</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
              <div className="text-purple-400 text-2xl mb-2">📅</div>
              <div className="text-gray-400 text-xs mb-1">평일 출하일</div>
              <div className="text-white text-3xl font-bold">
                {new Set(harvestSchedule.map(s => s.date.toDateString())).size}
              </div>
              <div className="text-gray-500 text-xs mt-1">일</div>
            </div>
          </div>
        </div>

        {/* Market Forecast Chart */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">📈</span>
            60일 가격 예측
          </h2>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="h-64 flex items-end justify-between gap-1">
              {Array.from({ length: 60 }, (_, i) => {
                const avgForecast = 8000 + Math.sin(i / 5) * 2000 + i * 10;
                const maxValue = 15000;
                const height = (avgForecast / maxValue) * 100;
                
                return (
                  <div 
                    key={i}
                    className="flex-1 bg-gradient-to-t from-cyan-500/50 to-blue-500/50 rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`Day ${i + 1}: ${avgForecast.toLocaleString()}원`}
                  ></div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>오늘</span>
              <span>30일</span>
              <span>60일</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
