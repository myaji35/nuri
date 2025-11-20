'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { addProgram, educationCategories } from '@/lib/educationStore';
import { getWorkplaces } from '@/lib/workplaceStore';

export default function NewEducationPage() {
  const router = useRouter();
  const [workplaces, setWorkplaces] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: 0,
    capacity: 0,
    enrolled: 0,
    status: 'planned' as const,
    location: '',
    description: '',
    targetAudience: '',
    objectives: '',
    workplaceId: 0,
    workplaceName: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWorkplaces(getWorkplaces());
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, startDate: today, endDate: today }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // workplaceId가 선택된 경우 workplaceName 설정
      if (formData.workplaceId > 0) {
        const workplace = workplaces.find(w => w.id === formData.workplaceId);
        if (workplace) {
          formData.workplaceName = workplace.name;
        }
      }

      addProgram(formData);
      router.push('/admin/education');
    } catch (error) {
      console.error('Failed to add program:', error);
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/education"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">새 교육 프로그램 추가</h1>
        <p className="text-sm text-gray-600 mt-1">새로운 교육 프로그램 정보를 입력합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-base font-semibold mb-3">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                교육명 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: 스마트팜 기초 교육"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                분류 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="">분류를 선택하세요</option>
                {educationCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Instructor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                강사명 *
              </label>
              <input
                type="text"
                value={formData.instructor}
                onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: 김기술"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일 *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일 *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                총 시간 (시간 단위) *
              </label>
              <input
                type="number"
                value={formData.duration > 0 ? formData.duration : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: 40"
                min="1"
                required
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정원 *
              </label>
              <input
                type="number"
                value={formData.capacity > 0 ? formData.capacity : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: 20"
                min="1"
                required
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장소 *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: NURI 이천 교육센터"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                상태 *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                required
              >
                <option value="planned">예정</option>
                <option value="ongoing">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>

            {/* Workplace */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소속 사업장 (선택)
              </label>
              <select
                value={formData.workplaceId}
                onChange={(e) => setFormData(prev => ({ ...prev, workplaceId: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="0">전체 / 본사</option>
                {workplaces.map(workplace => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-base font-semibold mb-3">상세 정보</h2>

          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                교육 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="교육 프로그램에 대한 설명을 입력하세요"
                rows={3}
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대상
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="예: 신입 직원, 발달장애인"
              />
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                교육 목표
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="교육을 통해 달성하고자 하는 목표를 입력하세요"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/education"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? '저장 중...' : '추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
