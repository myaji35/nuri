'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { addRevenue, incomeCategories, expenseCategories } from '@/lib/revenueStore';
import { getWorkplaces } from '@/lib/workplaceStore';

export default function NewRevenuePage() {
  const router = useRouter();
  const workplaces = getWorkplaces();

  const [formData, setFormData] = useState({
    workplaceId: workplaces[0]?.id || 0,
    type: 'income' as 'income' | 'expense',
    category: incomeCategories[0]?.id || '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const workplace = workplaces.find(w => w.id === formData.workplaceId);
      if (!workplace) {
        alert('사업장을 선택해주세요.');
        setSaving(false);
        return;
      }

      const date = new Date(formData.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      addRevenue({
        workplaceId: formData.workplaceId,
        workplaceCode: workplace.code,
        workplaceName: workplace.name,
        year,
        month,
        type: formData.type,
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date
      });

      router.push('/admin/revenue');
    } catch (error) {
      console.error('Failed to save revenue:', error);
      alert('저장 중 오류가 발생했습니다.');
      setSaving(false);
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    const categories = type === 'income' ? incomeCategories : expenseCategories;
    setFormData(prev => ({
      ...prev,
      type,
      category: categories[0]?.id || ''
    }));
  };

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  // 숫자를 한글로 변환하는 함수
  const numberToKorean = (num: number): string => {
    if (num === 0) return '영원';

    const units = ['', '만', '억', '조'];
    const smallUnits = ['', '십', '백', '천'];
    const nums = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

    let result = '';
    let unitIndex = 0;

    while (num > 0) {
      const part = num % 10000;
      if (part > 0) {
        let partStr = '';
        let tempPart = part;
        let smallUnitIndex = 0;

        while (tempPart > 0) {
          const digit = tempPart % 10;
          if (digit > 0) {
            partStr = nums[digit] + smallUnits[smallUnitIndex] + partStr;
          }
          tempPart = Math.floor(tempPart / 10);
          smallUnitIndex++;
        }

        result = partStr + units[unitIndex] + result;
      }
      num = Math.floor(num / 10000);
      unitIndex++;
    }

    return result + '원';
  };

  // 숫자에 3자리 콤마 추가
  const formatNumberWithComma = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/revenue"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">새 거래 추가</h1>
        <p className="text-gray-600 mt-2">수입 또는 지출 거래 내역을 등록합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Workplace */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사업장 *
              </label>
              <select
                value={formData.workplaceId}
                onChange={(e) => setFormData(prev => ({ ...prev, workplaceId: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {workplaces.map(workplace => (
                  <option key={workplace.id} value={workplace.id}>
                    {workplace.name} ({workplace.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                구분 *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={(e) => handleTypeChange('income')}
                    className="mr-2"
                  />
                  <span>수입</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={(e) => handleTypeChange('expense')}
                    className="mr-2"
                  />
                  <span>지출</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계정과목 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {currentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거래일자 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Amount */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                금액 *
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.amount > 0 ? formatNumberWithComma(formData.amount) : ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      const numValue = value === '' ? 0 : Number(value);
                      if (!isNaN(numValue)) {
                        setFormData(prev => ({ ...prev, amount: numValue }));
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right"
                    placeholder="0"
                    required
                  />
                </div>
                {formData.amount > 0 && (
                  <div className="flex-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border">
                    <span className="font-medium text-green-600">{numberToKorean(formData.amount)}</span>
                  </div>
                )}
              </div>
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
                placeholder="거래에 대한 추가 설명을 입력하세요"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/revenue"
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
