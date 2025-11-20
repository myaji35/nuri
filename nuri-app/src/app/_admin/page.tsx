'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Newspaper, DollarSign,
  Building2, Milestone, Calendar, ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getNewsItems } from '@/lib/newsStore';
import { getWorkplaces, getWorkplaceStats } from '@/lib/workplaceStore';
import { getJourneyItems } from '@/lib/journeyStore';
import { getRevenues, getOverallRevenueStats } from '@/lib/revenueStore';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Revenue Flow Chart를 클라이언트 전용으로 로드
const RevenueFlowChart = dynamic(() => import('@/components/RevenueFlowChart'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">차트 로딩 중...</p>
      </div>
    </div>
  )
});

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newsCount: 0,
    workplaceCount: 0,
    journeyCount: 0,
    revenueProfit: 0,
    activeWorkplaces: 0,
    totalEmployees: 0,
    upcomingJourneys: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // 실제 데이터 로드
    const newsItems = getNewsItems();
    const workplaceStats = getWorkplaceStats();
    const journeyItems = getJourneyItems();
    const revenueStats = getOverallRevenueStats();

    setStats({
      newsCount: newsItems.length,
      workplaceCount: workplaceStats.total,
      journeyCount: journeyItems.length,
      revenueProfit: revenueStats.profit,
      activeWorkplaces: workplaceStats.active,
      totalEmployees: workplaceStats.totalEmployees,
      upcomingJourneys: journeyItems.filter(j => j.upcoming).length,
      totalRevenue: revenueStats.totalIncome
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount) + '원';
  };

  const dashboardStats = [
    {
      title: '총 소식',
      value: stats.newsCount.toString(),
      subtitle: '게시된 뉴스',
      icon: Newspaper,
      color: 'bg-blue-500',
      link: '/admin/news'
    },
    {
      title: '사업장',
      value: stats.workplaceCount.toString(),
      subtitle: `운영중 ${stats.activeWorkplaces}개`,
      icon: Building2,
      color: 'bg-green-500',
      link: '/admin/workplace'
    },
    {
      title: 'Journey',
      value: stats.journeyCount.toString(),
      subtitle: `예정 ${stats.upcomingJourneys}개`,
      icon: Milestone,
      color: 'bg-purple-500',
      link: '/admin/journey'
    },
    {
      title: '순이익',
      value: formatCurrency(stats.revenueProfit),
      subtitle: '수익 관리',
      icon: DollarSign,
      color: 'bg-yellow-500',
      link: '/admin/revenue',
      trend: stats.revenueProfit >= 0 ? 'up' : 'down'
    }
  ];

  const additionalStats = [
    {
      title: '총 고용인원',
      value: `${stats.totalEmployees}명`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: '총 매출',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">NURI 관리자 페이지에 오신 것을 환영합니다</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {dashboardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.link}
              className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </Link>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {additionalStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`${stat.bg} rounded-lg p-6 border`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-white ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Flow Visualization */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">How NURI Makes Money</h2>
          <p className="text-gray-600">누리의 다각화된 수익 모델과 고객 세그먼트별 매출 흐름을 한눈에 확인하세요</p>
        </div>
        <RevenueFlowChart height={500} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 소식 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">최근 소식</h2>
            <Link href="/admin/news" className="text-sm text-green-600 hover:text-green-700">
              전체보기 →
            </Link>
          </div>
          <RecentNews />
        </div>

        {/* 최근 사업장 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">최근 사업장</h2>
            <Link href="/admin/workplace" className="text-sm text-green-600 hover:text-green-700">
              전체보기 →
            </Link>
          </div>
          <RecentWorkplaces />
        </div>
      </div>
    </div>
  );
}

function RecentNews() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const newsItems = getNewsItems();
    setNews(newsItems.slice(0, 5));
  }, []);

  if (news.length === 0) {
    return <p className="text-gray-500 text-sm">등록된 소식이 없습니다</p>;
  }

  return (
    <div className="space-y-3">
      {news.map((item) => (
        <Link
          key={item.id}
          href={`/admin/news/${item.id}`}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm line-clamp-1">{item.title}</p>
            <p className="text-xs text-gray-600 line-clamp-1">{item.summary}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
        </Link>
      ))}
    </div>
  );
}

function RecentWorkplaces() {
  const [workplaces, setWorkplaces] = useState<any[]>([]);

  useEffect(() => {
    const items = getWorkplaces();
    setWorkplaces(items.slice(0, 5));
  }, []);

  if (workplaces.length === 0) {
    return <p className="text-gray-500 text-sm">등록된 사업장이 없습니다</p>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {workplaces.map((item) => (
        <Link
          key={item.id}
          href={`/admin/workplace/${item.id}`}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className={`w-2 h-2 ${getStatusColor(item.status)} rounded-full mt-2`}></div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
            <p className="text-xs text-gray-600 line-clamp-1">{item.address}</p>
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{item.employeeCount}명</span>
        </Link>
      ))}
    </div>
  );
}