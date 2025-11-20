'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, Search,
  MapPin, Users, Building2, Filter,
  Globe, Phone, User, Calendar
} from 'lucide-react';
import { getWorkplaces, deleteWorkplace, getWorkplaceStats, type WorkplaceItem } from '@/lib/workplaceStore';
import Link from 'next/link';

export default function AdminWorkplacePage() {
  const [workplaces, setWorkplaces] = useState<WorkplaceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadWorkplaces();
  }, []);

  const loadWorkplaces = () => {
    const items = getWorkplaces();
    setWorkplaces(items);
    setStats(getWorkplaceStats());
  };

  const handleDelete = (id: number) => {
    if (window.confirm('삭제 하시겠습니까?')) {
      deleteWorkplace(id);
      loadWorkplaces();
    }
  };

  const filteredWorkplaces = workplaces.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.managerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const types = [
    { id: 'all', label: '전체', icon: Building2 },
    { id: 'farm', label: '농장', color: 'green' },
    { id: 'office', label: '사무실', color: 'blue' },
    { id: 'research', label: '연구소', color: 'purple' },
    { id: 'training', label: '교육센터', color: 'yellow' },
  ];

  const statuses = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '운영중', color: 'green' },
    { id: 'inactive', label: '운영중단', color: 'red' },
    { id: 'planning', label: '계획중', color: 'yellow' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      planning: 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      farm: 'bg-green-100 text-green-800',
      office: 'bg-blue-100 text-blue-800',
      research: 'bg-purple-100 text-purple-800',
      training: 'bg-yellow-100 text-yellow-800'
    };
    return typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      KR: '🇰🇷',
      VN: '🇻🇳',
      US: '🇺🇸',
      JP: '🇯🇵',
      CN: '🇨🇳'
    };
    return flags[country] || '🏳️';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사업장 관리</h1>
          <p className="text-gray-600 mt-2">NURI 사업장 현황 및 관리</p>
        </div>
        <Link
          href="/admin/workplace/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 사업장 추가
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">전체 사업장</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">운영중</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.planning}</div>
            <div className="text-sm text-gray-600">계획중</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</div>
            <div className="text-sm text-gray-600">총 고용인원</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(stats.byCountry).length}
            </div>
            <div className="text-sm text-gray-600">진출 국가</div>
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
                placeholder="사업장명, 주소, 코드, 관리자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === type.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {statuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
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

      {/* Workplace List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWorkplaces.map((workplace) => (
          <div
            key={workplace.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCountryFlag(workplace.country)}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{workplace.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{workplace.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadge(workplace.type)}`}>
                    {types.find(t => t.id === workplace.type)?.label}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(workplace.status)}`}>
                    {statuses.find(s => s.id === workplace.status)?.label}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-600 flex-1">{workplace.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">{workplace.employeeCount}</span> 명
                    </span>
                  </div>

                  {workplace.establishedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{workplace.establishedDate}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {workplace.managerName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{workplace.managerName}</span>
                    </div>
                  )}

                  {workplace.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{workplace.contactNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {workplace.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {workplace.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Link
                  href={`/admin/workplace/${workplace.id}`}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors relative z-10 cursor-pointer rounded hover:bg-gray-100"
                  title="상세보기"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/workplace/${workplace.id}/edit`}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative z-10 cursor-pointer rounded hover:bg-gray-100"
                  title="수정"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(workplace.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors relative z-10 cursor-pointer rounded hover:bg-red-50"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkplaces.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">사업장 코드 체계</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 코드 구성: 국가코드(1) + 국가순번(2) + NURI + 구분(4-6) + 순번(2)</p>
          <p>• 예시: K01NURIFARM01 = K로 시작하는 첫 번째 국가 중 농장 타입 첫 번째 사업장</p>
          <p>• 구분: FARM(농장), OFFICE(사무실), RND(연구소), TRAIN(교육센터)</p>
        </div>
      </div>
    </div>
  );
}