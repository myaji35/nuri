'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getJourneyItem, updateJourneyItem } from '@/lib/journeyStore';

export default function EditJourneyPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [formData, setFormData] = useState({
    year: '',
    month: '',
    title: '',
    description: '',
    category: 'achievement' as 'foundation' | 'expansion' | 'achievement' | 'investment' | 'partnership' | undefined,
    highlight: false,
    upcoming: false,
    order: 1
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getJourneyItem(id);
    if (item) {
      setFormData({
        year: item.year,
        month: item.month || '',
        title: item.title,
        description: item.description,
        category: item.category,
        highlight: item.highlight || false,
        upcoming: item.upcoming || false,
        order: item.order
      });
    }
    setLoading(false);
  }, [id]);

  const categories = [
    { id: 'foundation', label: '창립', description: '회사 설립 및 초기 단계' },
    { id: 'expansion', label: '확장', description: '사업 확장 및 새로운 지역 진출' },
    { id: 'achievement', label: '성과', description: '중요한 성과 및 달성' },
    { id: 'investment', label: '투자', description: '투자 유치 및 자금 조달' },
    { id: 'partnership', label: '파트너십', description: '전략적 제휴 및 협력' },
  ];

  const months = [
    { value: '01', label: '1월' },
    { value: '02', label: '2월' },
    { value: '03', label: '3월' },
    { value: '04', label: '4월' },
    { value: '05', label: '5월' },
    { value: '06', label: '6월' },
    { value: '07', label: '7월' },
    { value: '08', label: '8월' },
    { value: '09', label: '9월' },
    { value: '10', label: '10월' },
    { value: '11', label: '11월' },
    { value: '12', label: '12월' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const success = updateJourneyItem(id, {
        ...formData,
        category: formData.category as any
      });

      if (success) {
        router.push('/admin/journey');
      } else {
        alert('수정에 실패했습니다.');
        setSaving(false);
      }
    } catch (error) {
      console.error('Failed to update journey item:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">이정표 수정</h1>
        <p className="text-gray-600 mt-2">기존 이정표 정보를 수정합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: NURI 설립, 시리즈 A 투자 유치"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="이정표에 대한 상세 설명을 입력하세요"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Date & Category */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">날짜 및 분류</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연도 *
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="YYYY"
                pattern="[0-9]{4}"
                maxLength={4}
                required
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월 (선택)
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">선택하세요</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(cat => (
                <label
                  key={cat.id}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.category === cat.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={formData.category === cat.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {cat.label}
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      {cat.description}
                    </span>
                  </div>
                  {formData.category === cat.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Highlight */}
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.highlight}
                onChange={(e) => setFormData(prev => ({ ...prev, highlight: e.target.checked }))}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <span className="font-medium text-gray-900">하이라이트 표시</span>
                <p className="text-sm text-gray-500">중요한 이정표로 표시하여 강조합니다</p>
              </div>
            </label>

            {/* Upcoming */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.upcoming}
                onChange={(e) => setFormData(prev => ({ ...prev, upcoming: e.target.checked }))}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div>
                <span className="font-medium text-gray-900">예정일정 표시</span>
                <p className="text-sm text-gray-500">아직 발생하지 않은 미래 이정표입니다 (메인 페이지에서 숨김)</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/journey"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}