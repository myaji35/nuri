'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, Search, BookOpen,
  Users, Clock, MapPin, Calendar, TrendingUp
} from 'lucide-react';
import {
  getPrograms,
  deleteProgram,
  getEducationStats,
  educationCategories,
  type EducationProgram
} from '@/lib/educationStore';
import Link from 'next/link';

export default function EducationPage() {
  const [programs, setPrograms] = useState<EducationProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stats, setStats] = useState({
    totalPrograms: 0,
    ongoingPrograms: 0,
    completedPrograms: 0,
    totalParticipants: 0,
    completedParticipants: 0,
    averageAttendance: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPrograms(getPrograms());
    setStats(getEducationStats());
  };

  const handleDelete = (id: number) => {
    const program = programs.find(p => p.id === id);
    if (window.confirm(`"${program?.title}" 교육 프로그램을 삭제하시겠습니까?`)) {
      deleteProgram(id);
      loadData();
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      planned: { label: '예정', color: 'bg-blue-100 text-blue-800' },
      ongoing: { label: '진행중', color: 'bg-green-100 text-green-800' },
      completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: '취소', color: 'bg-red-100 text-red-800' }
    };
    return config[status as keyof typeof config] || config.planned;
  };

  const getCategoryLabel = (categoryId: string) => {
    return educationCategories.find(c => c.id === categoryId)?.label || categoryId;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">교육 관리</h1>
          <p className="text-sm text-gray-600 mt-1">교육 프로그램을 관리합니다</p>
        </div>
        <Link
          href="/admin/education/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          새 교육 추가
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</div>
              <div className="text-sm text-gray-600">전체 프로그램</div>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.ongoingPrograms}</div>
              <div className="text-sm text-gray-600">진행중</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</div>
              <div className="text-sm text-gray-600">총 참여 인원</div>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="교육명, 강사명, 장소로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">분류</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="all">전체 분류</option>
                {educationCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="all">전체 상태</option>
                <option value="planned">예정</option>
                <option value="ongoing">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  교육명
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  분류
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  강사
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일정
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  인원
                </th>
                <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrograms.map((program) => {
                const statusBadge = getStatusBadge(program.status);
                const enrollmentRate = Math.round((program.enrolled / program.capacity) * 100);

                return (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{program.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {program.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-900">{getCategoryLabel(program.category)}</span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-900">{program.instructor}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {program.startDate.slice(5)} ~ {program.endDate.slice(5)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {program.duration}시간
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{program.enrolled}</span>
                        <span className="text-gray-500">/{program.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${enrollmentRate >= 90 ? 'bg-red-500' : enrollmentRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(enrollmentRate, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/education/${program.id}`}
                          className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/education/${program.id}/edit`}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
