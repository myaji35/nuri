'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, Search,
  Calendar, Tag, Star, GripVertical,
  Filter, ChevronDown
} from 'lucide-react';
import { getJourneyItems, deleteJourneyItem, reorderJourneyItems, type JourneyItem } from '@/lib/journeyStore';
import Link from 'next/link';

export default function AdminJourneyPage() {
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draggedItem, setDraggedItem] = useState<JourneyItem | null>(null);

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = () => {
    setJourneyItems(getJourneyItems());
  };

  const handleDelete = (id: number) => {
    if (window.confirm('삭제 하시겠습니까?')) {
      deleteJourneyItem(id);
      loadJourney();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, item: JourneyItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetItem: JourneyItem) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const newItems = [...journeyItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem.id);
    const targetIndex = newItems.findIndex(item => item.id === targetItem.id);

    // Remove dragged item and insert at target position
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);

    setJourneyItems(newItems);
    reorderJourneyItems(newItems);
    setDraggedItem(null);
  };

  const filteredJourney = journeyItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.year.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // 연도 비교 (내림차순)
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      // 연도가 같으면 월 비교 (내림차순)
      const monthA = a.month ? parseInt(a.month) : 0;
      const monthB = b.month ? parseInt(b.month) : 0;
      if (monthA !== monthB) {
        return monthB - monthA;
      }
      // 연도와 월이 같으면 order 기준 (내림차순)
      return b.order - a.order;
    });

  const categories = [
    { id: 'all', label: '전체', color: 'gray' },
    { id: 'foundation', label: '창립', color: 'blue' },
    { id: 'expansion', label: '확장', color: 'green' },
    { id: 'achievement', label: '성과', color: 'yellow' },
    { id: 'investment', label: '투자', color: 'purple' },
    { id: 'partnership', label: '파트너십', color: 'indigo' },
  ];

  const getCategoryColor = (category?: string) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return 'gray';
    return cat.color;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journey 관리</h1>
          <p className="text-gray-600 mt-2">회사의 역사와 이정표를 관리합니다</p>
        </div>
        <Link
          href="/admin/journey/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          새 이정표 추가
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="제목, 설명 또는 연도로 검색..."
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
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-gray-900">{journeyItems.length}</div>
          <div className="text-sm text-gray-600">전체 이정표</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {journeyItems.filter(j => j.highlight).length}
          </div>
          <div className="text-sm text-gray-600">하이라이트</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-purple-600">
            {journeyItems.filter(j => j.upcoming).length}
          </div>
          <div className="text-sm text-gray-600">예정일정</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-blue-600">
            {[...new Set(journeyItems.map(j => j.year))].length}
          </div>
          <div className="text-sm text-gray-600">연도</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="text-2xl font-bold text-green-600">
            {journeyItems[0]?.year || '2019'} - {journeyItems[journeyItems.length - 1]?.year || '2025'}
          </div>
          <div className="text-sm text-gray-600">기간</div>
        </div>
      </div>

      {/* Journey List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="w-10 px-4 py-3"></th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                이정표
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                날짜
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                순서
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJourney.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-gray-50 cursor-move ${item.upcoming ? 'bg-purple-50' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
              >
                <td className="px-4 py-4">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    {item.highlight && (
                      <Star className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                        {item.upcoming && (
                          <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                            예정
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{item.year}</span>
                    {item.month && (
                      <span className="text-gray-500">.{item.month}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {item.category && (
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full bg-${getCategoryColor(item.category)}-100 text-${getCategoryColor(item.category)}-800`}>
                      {categories.find(c => c.id === item.category)?.label || item.category}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                    {item.order}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/journey/${item.id}`}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors rounded hover:bg-gray-100 cursor-pointer"
                      title="상세보기"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/journey/${item.id}/edit`}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded hover:bg-gray-100 cursor-pointer"
                      title="수정"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded hover:bg-red-50 cursor-pointer"
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

        {filteredJourney.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">사용 방법</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 드래그 앤 드롭으로 순서를 변경할 수 있습니다</li>
          <li>• 별 아이콘이 있는 항목은 하이라이트 항목입니다</li>
          <li>• 카테고리별로 필터링하여 관련 이정표만 볼 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}