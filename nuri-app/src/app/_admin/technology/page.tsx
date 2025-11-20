'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, Search,
  Cpu, Lightbulb, Rocket, Activity,
  Calendar, DollarSign, Users, TrendingUp
} from 'lucide-react';
import { getTechnologies, deleteTechnology, getTechnologyStats, type TechnologyItem } from '@/lib/innovationStore';
import Link from 'next/link';

export default function AdminTechnologyPage() {
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadTechnologies();
  }, []);

  const loadTechnologies = () => {
    const items = getTechnologies();
    setTechnologies(items);
    setStats(getTechnologyStats());
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteTechnology(id);
      loadTechnologies();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const filteredTechnologies = technologies.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'ai', label: 'AI', color: 'purple' },
    { id: 'iot', label: 'IoT', color: 'blue' },
    { id: 'automation', label: '자동화', color: 'green' },
    { id: 'data', label: '데이터', color: 'indigo' },
    { id: 'biotech', label: '바이오', color: 'pink' },
    { id: 'other', label: '기타', color: 'gray' },
  ];

  const statuses = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '운영중', color: 'green' },
    { id: 'development', label: '개발중', color: 'blue' },
    { id: 'planning', label: '계획중', color: 'yellow' },
    { id: 'completed', label: '완료', color: 'gray' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      development: 'bg-blue-100 text-blue-800',
      planning: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      ai: 'bg-purple-100 text-purple-800',
      iot: 'bg-blue-100 text-blue-800',
      automation: 'bg-green-100 text-green-800',
      data: 'bg-indigo-100 text-indigo-800',
      biotech: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return categoryConfig[category as keyof typeof categoryConfig] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">혁신기술 관리</h1>
          <p className="text-gray-600 mt-2">핵심 기술 및 혁신 기술 관리</p>
        </div>
        <Link
          href="/admin/technology/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 기술 추가
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">전체 기술</div>
              </div>
              <Cpu className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">운영중</div>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.development}</div>
                <div className="text-sm text-gray-600">개발중</div>
              </div>
              <Rocket className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.byCategory?.ai || 0}
                </div>
                <div className="text-sm text-gray-600">AI 기술</div>
              </div>
              <Lightbulb className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="기술명 또는 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                  selectedStatus === status.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Technology List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTechnologies.map((tech) => (
          <div
            key={tech.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{tech.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadge(tech.category)}`}>
                      {categories.find(c => c.id === tech.category)?.label}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(tech.status)}`}>
                      {statuses.find(s => s.id === tech.status)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/technology/${tech.id}`}
                    className="p-1 text-gray-600 hover:text-green-600"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/technology/${tech.id}/edit`}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(tech.id)}
                    className={`p-1 ${
                      deleteConfirm === tech.id
                        ? 'text-red-600'
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {tech.description}
              </p>

              {/* Features */}
              {tech.features && tech.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 mb-2">주요 기능</h4>
                  <div className="flex flex-wrap gap-1">
                    {tech.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                    {tech.features.length > 3 && (
                      <span className="text-xs text-gray-500">+{tech.features.length - 3}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {tech.team && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{tech.team}</span>
                  </div>
                )}
                {tech.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{formatCurrency(tech.budget)}</span>
                  </div>
                )}
                {tech.developmentStartDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{tech.developmentStartDate}</span>
                  </div>
                )}
                {tech.impact && (
                  <div className="flex items-center gap-2 col-span-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-xs">{tech.impact}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}
    </div>
  );
}