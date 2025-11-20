'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getMember, updateMember, getDepartments, type Department } from '@/lib/organizationStore';
import { getWorkplaces } from '@/lib/workplaceStore';

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [workplaces, setWorkplaces] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    position: string;
    department: string;
    role: 'admin' | 'manager' | 'member';
    joinDate: string;
    phone: string;
    status: 'active' | 'inactive' | 'leave';
    workplaceId: number;
    workplaceName: string;
    workplaceIds: number[];
  }>({
    name: '',
    email: '',
    position: '',
    department: '',
    role: 'member',
    joinDate: '',
    phone: '',
    status: 'active',
    workplaceId: 0,
    workplaceName: '',
    workplaceIds: []
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCustomDepartment, setIsCustomDepartment] = useState(false);

  useEffect(() => {
    const loadedDepartments = getDepartments();
    setDepartments(loadedDepartments);
    setWorkplaces(getWorkplaces());
    const member = getMember(id);
    if (member) {
      // Check if member's department exists in the departments list
      const departmentExists = loadedDepartments.some(d => d.name === member.department);
      setIsCustomDepartment(!departmentExists);

      setFormData({
        name: member.name,
        email: member.email,
        position: member.position,
        department: member.department,
        role: member.role,
        joinDate: member.joinDate,
        phone: member.phone || '',
        status: member.status,
        workplaceId: member.workplaceId || 0,
        workplaceName: member.workplaceName || '',
        workplaceIds: member.workplaceIds || (member.workplaceId ? [member.workplaceId] : [])
      });
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      updateMember(id, formData);
      router.push('/admin/organization');
    } catch (error) {
      console.error('Failed to update member:', error);
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
          href="/admin/organization"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">조직원 수정</h1>
        <p className="text-gray-600 mt-2">조직원 정보를 수정합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="홍길동"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="hong@nuri.com"
                required
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                직책 *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 대리, 과장, 팀장"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="010-1234-5678"
              />
            </div>

            {/* Workplace */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소속 사업장(계열사) - 복수 선택 가능
              </label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
                {workplaces.length === 0 ? (
                  <p className="text-sm text-gray-500">사업장 데이터를 불러오는 중...</p>
                ) : (
                  <div className="space-y-2">
                    {workplaces.map(workplace => (
                      <label key={workplace.id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.workplaceIds.includes(workplace.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => {
                              let newIds;
                              if (isChecked) {
                                newIds = [...prev.workplaceIds, workplace.id];
                              } else {
                                newIds = prev.workplaceIds.filter(id => id !== workplace.id);
                              }
                              return {
                                ...prev,
                                workplaceIds: newIds,
                                workplaceId: newIds[0] || 0,
                                workplaceName: newIds.length > 0 ? workplaces.find(w => w.id === newIds[0])?.name || '' : ''
                              };
                            });
                          }}
                          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-900 flex-1">
                          {workplace.name} <span className="text-gray-500">({workplace.code})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.workplaceIds.length > 0
                  ? `${formData.workplaceIds.length}개 사업장 선택됨`
                  : '특정 사업장에 소속된 경우 선택하세요'}
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                부서 *
              </label>
              {isCustomDepartment ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="새 부서명을 입력하세요"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomDepartment(false);
                      setFormData(prev => ({ ...prev, department: '' }));
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <select
                  value={formData.department}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsCustomDepartment(true);
                      setFormData(prev => ({ ...prev, department: '' }));
                    } else {
                      setFormData(prev => ({ ...prev, department: e.target.value }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">부서를 선택하세요</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                  <option value="__custom__">+ 직접 입력</option>
                </select>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                역할 *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="member">일반</option>
                <option value="manager">매니저</option>
                <option value="admin">관리자</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                관리자: 전체 권한 / 매니저: 부서 관리 / 일반: 일반 사용자
              </p>
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입사일 *
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="active">재직중</option>
                <option value="inactive">휴직</option>
                <option value="leave">퇴사</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/organization"
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
            {saving ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  );
}
