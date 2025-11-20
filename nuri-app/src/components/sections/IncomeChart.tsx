'use client';

import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';

const revenueStreams = [
  { name: 'Smart Farm Solutions', value: 35, color: '#10B981' },
  { name: 'SaaS Platform', value: 25, color: '#3B82F6' },
  { name: 'Consulting Services', value: 20, color: '#F59E0B' },
  { name: 'Training Programs', value: 12, color: '#8B5CF6' },
  { name: 'Equipment Sales', value: 8, color: '#EC4899' },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 120000 },
  { month: 'Feb', revenue: 135000 },
  { month: 'Mar', revenue: 145000 },
  { month: 'Apr', revenue: 160000 },
  { month: 'May', revenue: 175000 },
  { month: 'Jun', revenue: 195000 },
];

const incomeMetrics = [
  {
    icon: DollarSign,
    title: 'Annual Revenue',
    value: '$2.1M',
    growth: '+32%',
    color: 'text-green-600'
  },
  {
    icon: Users,
    title: 'Active Clients',
    value: '156',
    growth: '+18%',
    color: 'text-blue-600'
  },
  {
    icon: Briefcase,
    title: 'Enterprise Contracts',
    value: '24',
    growth: '+45%',
    color: 'text-purple-600'
  },
  {
    icon: TrendingUp,
    title: 'Revenue Growth',
    value: '32%',
    growth: 'YoY',
    color: 'text-yellow-600'
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow-lg border">
        <p className="font-semibold">{label || payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Revenue: ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function IncomeChart() {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  return (
    <section id="income" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-yellow-500 font-semibold">✦ BUSINESS MODEL</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How NURI Makes Money</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            누리의 지속 가능한 비즈니스 모델은 스마트 농업 기술과 사회적 가치 창출을 결합하여
            안정적인 수익 구조를 구축하고 있습니다.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {incomeMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${metric.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-green-500 text-sm font-semibold">
                    {metric.growth}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Streams Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Revenue Streams</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1 rounded text-sm ${
                    chartType === 'pie'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Pie
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded text-sm ${
                    chartType === 'bar'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={revenueStreams}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueStreams.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              ) : (
                <BarChart data={revenueStreams}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Monthly Revenue Trend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded shadow-lg border">
                          <p className="font-semibold">{label}</p>
                          <p className="text-sm text-gray-600">
                            ${payload[0].value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Model Description */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-green-800">Subscription Model</h4>
            <p className="text-gray-700 text-sm">
              SaaS 플랫폼을 통한 월간/연간 구독 수익으로 예측 가능한 수익 창출
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-blue-800">Service Revenue</h4>
            <p className="text-gray-700 text-sm">
              컨설팅, 교육, 맞춤형 솔루션 개발을 통한 프로젝트 기반 수익
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <h4 className="font-bold text-lg mb-3 text-purple-800">Product Sales</h4>
            <p className="text-gray-700 text-sm">
              스마트팜 장비 및 IoT 센서 판매를 통한 하드웨어 수익
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}