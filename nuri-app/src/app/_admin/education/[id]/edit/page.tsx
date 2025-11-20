'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getProgram, updateProgram, educationCategories } from '@/lib/educationStore';
import { getWorkplaces } from '@/lib/workplaceStore';

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [workplaces, setWorkplaces] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    instructor: string;
    startDate: string;
    endDate: string;
    duration: number;
    capacity: number;
    enrolled: number;
    status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
    location: string;
    description: string;
    targetAudience: string;
    objectives: string;
    workplaceId: number;
    workplaceName: string;
  }>({
    title: '',
    category: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: 0,
    capacity: 0,
    enrolled: 0,
    status: 'planned',
    location: '',
    description: '',
    targetAudience: '',
    objectives: '',
    workplaceId: 0,
    workplaceName: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWorkplaces(getWorkplaces());
    const program = getProgram(id);
    if (program) {
      setFormData({
        title: program.title,
        category: program.category,
        instructor: program.instructor,
        startDate: program.startDate,
        endDate: program.endDate,
        duration: program.duration,
        capacity: program.capacity,
        enrolled: program.enrolled,
        status: program.status,
        location: program.location,
        description: program.description || '',
        targetAudience: program.targetAudience || '',
        objectives: program.objectives || '',
        workplaceId: program.workplaceId || 0,
        workplaceName: program.workplaceName || ''
      });
    }
    setLoading(false);
  }, [id]);

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
      } else {
        formData.workplaceName = '';
      }

      updateProgram(id, formData);
      router.push('/admin/education');
    } catch (error) {
      console.error('Failed to update program:', error);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">교육 프로그램 수정</h1>
        <p className="text-sm text-gray-600 mt-1">교육 프로그램 정보를 수정합니다</p>
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

            {/* Enrolled (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                현재 등록 인원
              </label>
              <input
                type="number"
                value={formData.enrolled}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">등록 인원은 참가자 관리에서 자동으로 업데이트됩니다</p>
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
            {saving ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
