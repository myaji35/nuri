'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit2, Trash2, Calendar,
  Star, Tag, Clock, Info
} from 'lucide-react';
import Link from 'next/link';
import { getJourneyItem, deleteJourneyItem } from '@/lib/journeyStore';

export function generateStaticParams() {
  return [];
}

export default function JourneyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [journey, setJourney] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getJourneyItem(id);
    if (item) {
      setJourney(item);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('삭제 하시겠습니까?')) {
      deleteJourneyItem(id);
      router.push('/admin/journey');
    }
  };

  const getCategoryBadge = (category?: string) => {
    const config = {
      foundation: { label: '창립', color: 'bg-blue-100 text-blue-800' },
      expansion: { label: '확장', color: 'bg-green-100 text-green-800' },
      achievement: { label: '성과', color: 'bg-yellow-100 text-yellow-800' },
      investment: { label: '투자', color: 'bg-purple-100 text-purple-800' },
      partnership: { label: '파트너십', color: 'bg-indigo-100 text-indigo-800' },
    };

    const cat = config[category as keyof typeof config];
    return cat || { label: category, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div>
        <Link
          href="/admin/journey"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Journey 항목을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryBadge(journey.category);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/journey"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{journey.title}</h1>
              {journey.highlight && (
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-gray-600">Journey 상세 정보</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/journey/${id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              수정
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                날짜
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {journey.year}년 {journey.month ? `${journey.month}월` : ''}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                카테고리
              </label>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                  {categoryInfo.label}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                순서
              </label>
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {journey.order}번째 이정표
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                하이라이트
              </label>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {journey.highlight ? (
                    <span className="text-yellow-600">중요 이정표</span>
                  ) : (
                    <span className="text-gray-500">일반 이정표</span>
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                예정일정
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {journey.upcoming ? (
                    <span className="text-purple-600">예정 일정</span>
                  ) : (
                    <span className="text-gray-500">완료된 일정</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">설명</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {journey.description}
          </p>
        </div>

        {/* Meta Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">메타 정보</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">ID:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {journey.id}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Position */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">타임라인 위치</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

            <div className="relative flex items-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {journey.order}
              </div>
              <div className="ml-8">
                <div className="font-bold text-lg">{journey.year}년 {journey.month ? `${journey.month}월` : ''}</div>
                <div className="text-gray-600">{journey.title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/admin/journey"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            목록으로
          </Link>
          <Link
            href={`/admin/journey/${id}/edit`}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            수정하기
          </Link>
        </div>
      </div>
    </div>
  );
}