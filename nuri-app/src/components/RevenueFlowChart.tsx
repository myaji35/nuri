'use client';

import { ResponsiveSankey } from '@nivo/sankey';
import { generateRevenueFlowData, generateSimpleRevenueFlowData } from '@/lib/revenueStore';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, BarChart3, TrendingUp } from 'lucide-react';

interface RevenueFlowChartProps {
  year?: string;
  height?: number;
}

type ChartMode = 'simple' | 'business';

export default function RevenueFlowChart({ year, height = 600 }: RevenueFlowChartProps) {
  const [data, setData] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(32); // YoY 성장률
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>('simple');

  useEffect(() => {
    // 실제 수익 데이터에서 직접 총액 계산
    const { getRevenues } = require('@/lib/revenueStore');
    const allData = getRevenues().filter((item: any) => {
      if (year && year !== 'all') return item.year === year;
      return true;
    });

    const revenues = allData.filter((item: any) => item.type === 'income');
    const expenses = allData.filter((item: any) => item.type === 'expense');

    const actualIncome = revenues.reduce((sum: number, r: any) => sum + r.amount, 0);
    const actualExpense = expenses.reduce((sum: number, r: any) => sum + r.amount, 0);
    const actualProfit = actualIncome - actualExpense;

    setTotalRevenue(actualIncome / 1000000);
    setTotalExpense(actualExpense / 1000000);
    setProfit(actualProfit / 1000000);

    // 차트 모드에 따라 데이터 생성
    const flowData = chartMode === 'simple'
      ? generateSimpleRevenueFlowData(year)
      : generateRevenueFlowData(year);

    setData(flowData);

    console.log('=== Chart Component Debug ===');
    console.log('Mode:', chartMode);
    console.log('Total Income:', actualIncome, 'Total Expense:', actualExpense);
    console.log('Profit:', actualProfit);
    console.log('Flow Data:', flowData);
  }, [year, chartMode]);

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <p className="text-gray-500">수익 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // 비즈니스 인사이트 모드에서 Revenue Sources와 Customer Segments 계산
  const [revenueSources, setRevenueSources] = useState<Array<{name: string, amount: number, percentage: number}>>([]);
  const [customerSegments, setCustomerSegments] = useState<Array<{name: string, amount: number, percentage: number}>>([]);

  useEffect(() => {
    if (chartMode === 'business') {
      const { getRevenues, inferCustomerSegment } = require('@/lib/revenueStore');
      const revenues = getRevenues().filter((item: any) => {
        if (year && year !== 'all') return item.year === year && item.type === 'income';
        return item.type === 'income';
      });

      // Revenue Sources 계산
      const sources = {
        'Smart Farm Solutions': revenues.filter((r: any) => r.category === 'sales').reduce((sum: number, r: any) => sum + r.amount, 0),
        'Consulting Services': revenues.filter((r: any) => r.category === 'service').reduce((sum: number, r: any) => sum + r.amount, 0),
        'Training Programs': revenues.filter((r: any) => r.category === 'subsidy').reduce((sum: number, r: any) => sum + r.amount, 0),
        'Equipment Sales': revenues.filter((r: any) => r.category === 'other_income' || r.category === 'investment').reduce((sum: number, r: any) => sum + r.amount, 0),
      };

      const total = Object.values(sources).reduce((sum: number, val: number) => sum + val, 0);

      const sourcesArray = Object.entries(sources)
        .filter(([_, amount]) => amount > 0)
        .map(([name, amount]) => ({
          name,
          amount: amount / 1000,  // K 단위
          percentage: Math.round((amount / total) * 100)
        }))
        .sort((a, b) => b.amount - a.amount);

      setRevenueSources(sourcesArray);

      // Customer Segments 계산
      const segments: Record<string, number> = {
        'B2B Enterprise': 0,
        'B2B SMB': 0,
        'Government': 0,
        'NGO/Non-profit': 0
      };

      revenues.forEach((item: any) => {
        const segment = inferCustomerSegment(item.description, item.category);
        const mappedSegment =
          segment === '대기업' ? 'B2B Enterprise' :
          segment === '중소기업' ? 'B2B SMB' :
          segment === '정부/공공' ? 'Government' :
          segment === 'NGO/비영리' ? 'NGO/Non-profit' : null;

        if (mappedSegment && segments[mappedSegment] !== undefined) {
          segments[mappedSegment] += item.amount;
        } else {
          // 기본 분배
          if (item.category === 'subsidy') {
            segments['Government'] += item.amount;
          } else if (item.category === 'sales') {
            segments['B2B SMB'] += item.amount * 0.7;
            segments['B2B Enterprise'] += item.amount * 0.3;
          } else {
            segments['B2B SMB'] += item.amount * 0.5;
            segments['Government'] += item.amount * 0.3;
            segments['NGO/Non-profit'] += item.amount * 0.2;
          }
        }
      });

      const segmentsArray = Object.entries(segments)
        .filter(([_, amount]) => amount > 0)
        .map(([name, amount]) => ({
          name,
          amount: amount / 1000,  // K 단위
          percentage: Math.round((amount / total) * 100)
        }))
        .sort((a, b) => b.amount - a.amount);

      setCustomerSegments(segmentsArray);
    }
  }, [year, chartMode]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">수익 흐름 시각화</h2>
        <div className="flex items-center gap-4">
          {chartMode === 'simple' ? (
            <>
              <div className="text-right">
                <div className="text-sm text-gray-600">총 수입:</div>
                <div className="text-2xl font-bold text-green-600">
                  ₩{totalRevenue.toFixed(0)}M
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">총 지출:</div>
                <div className="text-2xl font-bold text-red-600">
                  ₩{totalExpense.toFixed(0)}M
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">순이익:</div>
                <div className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₩{profit.toFixed(0)}M
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-right">
                <div className="text-sm text-gray-600">Annual Revenue:</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${(totalRevenue / 1000).toFixed(1)}M
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">YoY Growth:</div>
                <div className="text-2xl font-bold text-green-600">
                  +32%
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chart Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setChartMode('simple')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            chartMode === 'simple'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          계정과목별 흐름
        </button>
        <button
          onClick={() => setChartMode('business')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            chartMode === 'business'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          비즈니스 인사이트
        </button>
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveSankey
          data={data}
          margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          align="justify"
          colors={(node) => (node as any).nodeColor || '#69b3a2'}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          label={(node) => `${node.id}`}
          labelPosition="outside"
          labelOrientation="horizontal"
          labelPadding={16}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1]]
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 60,
              itemWidth: 150,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemsSpacing: 2,
              itemTextColor: '#666',
              symbolSize: 12,
              symbolShape: 'circle',
              data: [
                {
                  id: 'sources',
                  label: 'Revenue Sources',
                  color: '#10b981'
                },
                {
                  id: 'categories',
                  label: 'Revenue Categories',
                  color: '#3b82f6'
                },
                {
                  id: 'segments',
                  label: 'Customer Segments',
                  color: '#8b5cf6'
                }
              ],
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#000'
                  }
                }
              ]
            }
          ]}
          nodeTooltip={({ node }) => (
            <div className="bg-white px-3 py-2 shadow-lg rounded-lg border">
              <div className="font-semibold text-gray-900">{node.id}</div>
              <div className="text-sm text-gray-600">
                ₩{node.value?.toFixed(1)}M
              </div>
            </div>
          )}
        />
      </div>

      {/* Revenue Sources and Customer Segments - Business Mode Only */}
      {chartMode === 'business' && (revenueSources.length > 0 || customerSegments.length > 0) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Sources */}
          {revenueSources.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Sources</h3>
              <div className="space-y-3">
                {revenueSources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">${source.amount.toFixed(0)}K</span>
                      <span className="text-sm text-gray-500 w-12 text-right">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Segments */}
          {customerSegments.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Segments</h3>
              <div className="space-y-3">
                {customerSegments.map((segment, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">${segment.amount.toFixed(0)}K</span>
                      <span className="text-sm text-gray-500 w-12 text-right">{segment.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend Description */}
      <div className="mt-8">
        <div className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
          <button
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-bold text-lg text-blue-900">차트 읽는 방법</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">
                {isGuideOpen ? '감추기' : '펼치기'}
              </span>
              {isGuideOpen ? (
                <ChevronUp className="w-5 h-5 text-blue-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-700" />
              )}
            </div>
          </button>

          {isGuideOpen && (
            <div className="p-6 pt-0 border-t border-blue-200">
              {chartMode === 'simple' ? (
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold mb-1">수입 항목 (왼쪽, 파란색)</p>
                      <p>개별 수입 거래가 "계정과목(설명)" 형식으로 표시됩니다:</p>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        <li>• 예: <strong>기타수입(괴산군 출자금)</strong></li>
                        <li>• 예: <strong>매출(스마트팜 플랫폼 매출)</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold mb-1">지출 항목 (중간, 빨간색)</p>
                      <p>수입에서 각 지출 항목으로 직접 연결됩니다:</p>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        <li>• 예: <strong>장비구매(농자재 및 원재료)</strong></li>
                        <li>• 예: <strong>인건비</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold mb-1">당기순익 (오른쪽)</p>
                      <p>수입에서 지출을 차감한 후 남은 금액이 당기순익으로 흐릅니다.</p>
                      <p className="mt-1">• 지출 항목도 당기순익으로 연결되어 자금 흐름을 보여줍니다.</p>
                      <p className="mt-1 text-xs">• 녹색: 흑자 / 빨간색: 적자</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <p className="font-semibold">💡 Tip:</p>
                    <p>막대의 두께는 금액의 크기를 나타냅니다. 수입이 어떻게 지출로 사용되고 최종적으로 얼마의 당기순익이 남는지 한눈에 파악할 수 있습니다.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold mb-1">수익원 (왼쪽)</p>
                      <p>실제 데이터베이스의 수익 카테고리입니다:</p>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        <li>• <strong>플랫폼</strong>: 매출 (sales 카테고리)</li>
                        <li>• <strong>서비스</strong>: 용역수입 + 기타수입 + 투자수익 (service, other_income, investment 카테고리)</li>
                        <li>• <strong>프로그램</strong>: 보조금 (subsidy 카테고리)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold mb-1">수익 분류 (중간)</p>
                      <p>수익원을 비즈니스 유형별로 재분류합니다:</p>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        <li>• <strong>기술수익</strong>: 기술 관련 수익</li>
                        <li>• <strong>서비스수익</strong>: 서비스 관련 수익</li>
                        <li>• <strong>제품수익</strong>: 제품 판매 수익</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold mb-1">고객 세그먼트 (오른쪽)</p>
                      <p>최종적으로 어떤 고객으로부터 수익이 발생하는지 보여줍니다:</p>
                      <ul className="mt-1 ml-4 space-y-0.5">
                        <li>• <strong>대기업</strong>: 대기업 고객</li>
                        <li>• <strong>중소기업</strong>: 중소기업 고객</li>
                        <li>• <strong>정부/공공</strong>: 정부/공공기관</li>
                        <li>• <strong>NGO/비영리</strong>: NGO/비영리단체</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-blue-300">
                    <p className="font-semibold">💡 Tip:</p>
                    <p>막대의 두께는 금액의 크기를 나타냅니다. 흐름을 따라가면 각 수익원이 어떻게 분류되고 최종적으로 어떤 고객 세그먼트에서 발생하는지 알 수 있습니다.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
