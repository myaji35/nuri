'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Search, Filter,
  TrendingUp, TrendingDown, DollarSign,
  Calendar, Building2, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import {
  getRevenues,
  deleteRevenue,
  getOverallRevenueStats,
  getCategoryLabel,
  type RevenueItem
} from '@/lib/revenueStore';
import { getWorkplaces } from '@/lib/workplaceStore';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Sankey 차트는 클라이언트에서만 렌더링
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

export default function AdminRevenuePage() {
  const [revenues, setRevenues] = useState<RevenueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);
  const [workplaces, setWorkplaces] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWorkplaces(getWorkplaces());
    loadRevenues();
  }, []);

  useEffect(() => {
    if (mounted) {
      loadRevenues();
    }
  }, [selectedYear, selectedMonth, mounted]);

  const loadRevenues = () => {
    setRevenues(getRevenues());
    const year = selectedYear === 'all' ? undefined : selectedYear;
    const month = selectedMonth === 'all' ? undefined : selectedMonth;
    setStats(getOverallRevenueStats(year, month));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('삭제 하시겠습니까?')) {
      deleteRevenue(id);
      loadRevenues();
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const filteredRevenues = revenues.filter(item => {
    const matchesSearch =
      item.workplaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryLabel(item.category, item.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWorkplace = selectedWorkplace === 'all' || item.workplaceId.toString() === selectedWorkplace;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesYear = selectedYear === 'all' || item.year === selectedYear;
    const matchesMonth = selectedMonth === 'all' || item.month === selectedMonth;

    return matchesSearch && matchesWorkplace && matchesType && matchesYear && matchesMonth;
  });

  // 연도 목록 생성
  const years = ['all', ...Array.from(new Set(revenues.map(r => r.year)))].sort().reverse();

  // 월 목록
  const months = [
    { value: 'all', label: '전체' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString().padStart(2, '0'),
      label: `${i + 1}월`
    }))
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">수익 관리</h1>
          <p className="text-gray-600 mt-2">사업장별 월별 수입/지출 관리</p>
        </div>
        <Link
          href="/admin/revenue/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 거래 추가
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">총 수입</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-600">총 지출</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpense)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">순이익</span>
            </div>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(stats.profit)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">거래 건수</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.count}건
            </div>
          </div>
        </div>
      )}

      {/* Revenue Flow Visualization */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">How NURI Makes Money</h2>
          <p className="text-gray-600">누리의 다각화된 수익 모델과 고객 세그먼트별 매출 흐름을 한눈에 확인하세요</p>
        </div>
        <RevenueFlowChart year={selectedYear === 'all' ? undefined : selectedYear} height={600} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="사업장, 설명, 계정과목으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Workplace Filter */}
          <div>
            <select
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">전체 사업장</option>
              {workplaces.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">전체 연도</option>
              {years.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedType('income')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            수입
          </button>
          <button
            onClick={() => setSelectedType('expense')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'expense'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            지출
          </button>
        </div>
      </div>

      {/* Revenue List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                사업장
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                구분
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                계정과목
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRevenues.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{item.year}.{item.month}.{item.date.split('-')[2]}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{item.workplaceName}</div>
                    <div className="text-xs text-gray-500 font-mono">{item.workplaceCode}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    item.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.type === 'income' ? '수입' : '지출'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getCategoryLabel(item.category, item.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`font-medium ${
                    item.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 line-clamp-1">
                    {item.description || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/revenue/${item.id}/edit`}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRevenues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">수익 관리 안내</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 각 사업장의 월별 수입과 지출을 관리할 수 있습니다</li>
          <li>• 계정과목별로 분류하여 정확한 재무 현황을 파악할 수 있습니다</li>
          <li>• 연도와 월을 선택하여 기간별 통계를 확인할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
