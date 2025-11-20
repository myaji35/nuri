'use client';

import { useState, useEffect } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { ArrowRight, TrendingUp, DollarSign } from 'lucide-react';
import { getRevenues, generateRevenueFlowData, inferCustomerSegment } from '@/lib/revenueStore';
import { useLanguage } from '@/contexts/LanguageContext';

export default function IncomeFlowChart() {
  const { t, locale } = useLanguage();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [incomeFlowData, setIncomeFlowData] = useState<any>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueSources, setRevenueSources] = useState<Array<{name: string, amount: string, percent: string}>>([]);
  const [customerSegments, setCustomerSegments] = useState<Array<{name: string, amount: string, percent: string}>>([]);

  useEffect(() => {
    // 실제 데이터 로드
    const revenues = getRevenues().filter((item: any) => item.type === 'income');
    const flowData = generateRevenueFlowData();

    setIncomeFlowData(flowData);

    const total = revenues.reduce((sum: number, r: any) => sum + r.amount, 0);
    setTotalRevenue(total);

    // Revenue Sources 계산 (다국어 지원)
    const sourceNames = {
      smartFarm: t.revenue.smartFarm,
      consulting: t.revenue.consulting,
      training: t.revenue.training,
      equipment: t.revenue.equipment
    };

    const sources = {
      [sourceNames.smartFarm]: revenues.filter((r: any) => r.category === 'sales').reduce((sum: number, r: any) => sum + r.amount, 0),
      [sourceNames.consulting]: revenues.filter((r: any) => r.category === 'service').reduce((sum: number, r: any) => sum + r.amount, 0),
      [sourceNames.training]: revenues.filter((r: any) => r.category === 'subsidy').reduce((sum: number, r: any) => sum + r.amount, 0),
      [sourceNames.equipment]: revenues.filter((r: any) => r.category === 'other_income' || r.category === 'investment').reduce((sum: number, r: any) => sum + r.amount, 0),
    };

    const sourcesArray = Object.entries(sources)
      .filter(([_, amount]) => amount > 0)
      .map(([name, amount]) => ({
        name,
        amount: `$${(amount / 1000).toFixed(0)}K`,
        percent: `${Math.round((amount / total) * 100)}%`
      }))
      .sort((a, b) => parseInt(b.amount.replace(/\D/g, '')) - parseInt(a.amount.replace(/\D/g, '')));

    setRevenueSources(sourcesArray);

    // Customer Segments 계산 (다국어 지원)
    const segmentNames = {
      enterprise: t.revenue.b2bEnterprise,
      smb: t.revenue.b2bSMB,
      government: t.revenue.government,
      ngo: t.revenue.ngo
    };

    const segments: Record<string, number> = {
      [segmentNames.enterprise]: 0,
      [segmentNames.smb]: 0,
      [segmentNames.government]: 0,
      [segmentNames.ngo]: 0
    };

    revenues.forEach((item: any) => {
      const segment = inferCustomerSegment(item.description, item.category);
      const mappedSegment =
        segment === '대기업' ? segmentNames.enterprise :
        segment === '중소기업' ? segmentNames.smb :
        segment === '정부/공공' ? segmentNames.government :
        segment === 'NGO/비영리' ? segmentNames.ngo : null;

      if (mappedSegment && segments[mappedSegment] !== undefined) {
        segments[mappedSegment] += item.amount;
      } else {
        // 기본 분배
        if (item.category === 'subsidy') {
          segments[segmentNames.government] += item.amount;
        } else if (item.category === 'sales') {
          segments[segmentNames.smb] += item.amount * 0.7;
          segments[segmentNames.enterprise] += item.amount * 0.3;
        } else {
          segments[segmentNames.smb] += item.amount * 0.5;
          segments[segmentNames.government] += item.amount * 0.3;
          segments[segmentNames.ngo] += item.amount * 0.2;
        }
      }
    });

    const segmentsArray = Object.entries(segments)
      .filter(([_, amount]) => amount > 0)
      .map(([name, amount]) => ({
        name,
        amount: `$${(amount / 1000).toFixed(0)}K`,
        percent: `${Math.round((amount / total) * 100)}%`
      }))
      .sort((a, b) => parseInt(b.amount.replace(/\D/g, '')) - parseInt(a.amount.replace(/\D/g, '')));

    setCustomerSegments(segmentsArray);
  }, [locale]); // locale 변경 시 재계산

  if (!incomeFlowData) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      </section>
    );
  }

  const customTheme = {
    labels: {
      text: {
        fontSize: 12,
        fontWeight: 600,
      }
    }
  };

  return (
    <section id="income" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">
            ✦ {locale === 'en' ? 'REVENUE MODEL' : '수익 모델'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t.revenue.title}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            {t.revenue.subtitle}
          </p>
        </div>

        {/* Main Sankey Diagram */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{t.revenue.visualization}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{t.revenue.annualRevenue}: ${(totalRevenue / 1000000).toFixed(1)}M</span>
              <span className="text-green-500 font-semibold ml-2">+32% {t.revenue.yoyGrowth}</span>
            </div>
          </div>

          <div style={{ height: '500px' }}>
            <ResponsiveSankey
              data={incomeFlowData}
              margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
              align="justify"
              colors={{ scheme: 'category10' }}
              nodeOpacity={1}
              nodeHoverOpacity={1}
              nodeThickness={18}
              nodeInnerPadding={3}
              nodeSpacing={24}
              nodeBorderWidth={0}
              nodeBorderColor={{
                from: 'color',
                modifiers: [['darker', 0.8]]
              }}
              nodeBorderRadius={3}
              linkOpacity={0.5}
              linkHoverOpacity={0.8}
              linkContract={3}
              enableLinkGradient={true}
              labelPosition="outside"
              labelOrientation="horizontal"
              labelPadding={16}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1]]
              }}
              theme={customTheme}
              onClick={(data) => setSelectedNode((data as any).id)}
              animate={true}
              motionConfig="gentle"
            />
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-6 pt-6 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">{t.revenue.sources}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">{locale === 'en' ? 'Revenue Categories' : '수익 분류'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">{t.revenue.segments}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Revenue Sources */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{t.revenue.sources}</h3>
            <div className="space-y-3">
              {revenueSources.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{item.amount}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.percent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{t.revenue.segments}</h3>
            <div className="space-y-3">
              {customerSegments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{item.amount}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.percent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">{t.revenue.insights.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{t.revenue.insights.fastestGrowing}</span>
              </div>
              <p className="text-sm opacity-90">
                {t.revenue.insights.fastestDesc}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="font-semibold">{t.revenue.insights.highestMargin}</span>
              </div>
              <p className="text-sm opacity-90">
                {t.revenue.insights.highestDesc}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <ArrowRight className="w-5 h-5" />
                <span className="font-semibold">{t.revenue.insights.futureFocus}</span>
              </div>
              <p className="text-sm opacity-90">
                {t.revenue.insights.futureDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}