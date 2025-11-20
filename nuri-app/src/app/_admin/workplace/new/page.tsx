'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Info } from 'lucide-react';
import Link from 'next/link';
import { addWorkplace } from '@/lib/workplaceStore';

export default function NewWorkplacePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    employeeCount: 0,
    code: '',
    country: 'KR',
    type: 'farm' as 'farm' | 'office' | 'research' | 'training',
    description: '',
    establishedDate: '',
    contactNumber: '',
    managerName: '',
    status: 'planning' as 'active' | 'inactive' | 'planning'
  });

  const [saving, setSaving] = useState(false);

  const countries = [
    { code: 'KR', name: '한국', flag: '🇰🇷' },
    { code: 'VN', name: '베트남', flag: '🇻🇳' },
    { code: 'US', name: '미국', flag: '🇺🇸' },
    { code: 'JP', name: '일본', flag: '🇯🇵' },
    { code: 'CN', name: '중국', flag: '🇨🇳' },
    { code: 'TH', name: '태국', flag: '🇹🇭' },
    { code: 'PH', name: '필리핀', flag: '🇵🇭' },
  ];

  const types = [
    { id: 'farm', label: '농장', description: '스마트팜 생산 시설' },
    { id: 'office', label: '사무실', description: '사무 및 관리 시설' },
    { id: 'research', label: '연구소', description: 'R&D 연구 시설' },
    { id: 'training', label: '교육센터', description: '교육 훈련 시설' },
  ];

  const statuses = [
    { id: 'active', label: '운영중', description: '현재 운영 중인 사업장' },
    { id: 'inactive', label: '운영중단', description: '일시적으로 운영이 중단된 사업장' },
    { id: 'planning', label: '계획중', description: '설립 예정인 사업장' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      addWorkplace({
        ...formData,
        employeeCount: Number(formData.employeeCount)
      });

      router.push('/admin/workplace');
    } catch (error) {
      console.error('Failed to save workplace:', error);
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/workplace"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">새 사업장 추가</h1>
        <p className="text-gray-600 mt-2">새로운 NURI 사업장 정보를 등록합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: NURI 여주 스마트팜"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                국가 *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 유형 *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="상세 주소를 입력하세요"
                required
              />
            </div>

            {/* Employee Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                고용인원 *
              </label>
              <input
                type="number"
                value={formData.employeeCount}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeCount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                운영 상태 *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.label} - {status.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">추가 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manager Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관리자명
              </label>
              <input
                type="text"
                value={formData.managerName}
                onChange={(e) => setFormData(prev => ({ ...prev, managerName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="관리자 이름"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="02-1234-5678"
              />
            </div>

            {/* Established Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설립일
              </label>
              <input
                type="date"
                value={formData.establishedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, establishedDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 코드 *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                placeholder="K01NURIFARM01"
                required
              />
              <p className="text-xs text-gray-500 mt-1">예: K01NURIFARM01</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="사업장에 대한 추가 설명을 입력하세요"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Code System Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900">사업장 코드 체계</h3>
              <p className="text-sm text-blue-800 mt-1">
                코드 구성: <span className="font-mono">국가코드(1) + 국가순번(2) + NURI + 구분(4-6) + 순번(2)</span>
              </p>
              <p className="text-sm text-blue-800 mt-1">
                예시: K01NURIFARM01 = K로 시작하는 첫 번째 국가 중 농장 타입 첫 번째 사업장
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/workplace"
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
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}