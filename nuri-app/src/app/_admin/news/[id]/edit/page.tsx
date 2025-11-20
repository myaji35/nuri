'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { getNewsItem, updateNewsItem } from '@/lib/newsStore';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    content: string;
    category: 'media' | 'investment' | 'global' | 'award' | 'partnership';
    type: 'major' | 'news' | 'achievement';
    date: string;
    image: string;
    tags: string[];
    link: string;
    source: string;
    highlight: boolean;
  }>({
    title: '',
    description: '',
    content: '',
    category: 'media',
    type: 'news',
    date: '',
    image: '/api/placeholder/800/600',
    tags: [],
    link: '',
    source: '',
    highlight: false
  });

  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getNewsItem(id);
    if (item) {
      // 날짜 형식 변환 (YYYY.MM.DD를 YYYY-MM-DD로)
      const dateForInput = item.date.replace(/\./g, '-');

      setFormData({
        title: item.title,
        description: item.description,
        content: item.content || '',
        category: item.category,
        type: item.type,
        date: dateForInput,
        image: item.image,
        tags: item.tags || [],
        link: item.link || '',
        source: item.source || '',
        highlight: item.highlight || false
      });
    }
    setLoading(false);
  }, [id]);

  const categories = [
    { id: 'media', label: '언론보도' },
    { id: 'investment', label: '투자' },
    { id: 'global', label: '해외진출' },
    { id: 'award', label: '수상/인증' },
    { id: 'partnership', label: '파트너십' },
  ];

  const types = [
    { id: 'major', label: '주요' },
    { id: 'news', label: '일반' },
    { id: 'achievement', label: '성과' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 날짜 형식 변환 (YYYY-MM-DD를 YYYY.MM.DD로)
      const formattedDate = formData.date.replace(/-/g, '.');

      updateNewsItem(id, {
        ...formData,
        date: formattedDate,
        category: formData.category as any,
        type: formData.type as any
      });

      router.push('/admin/news');
    } catch (error) {
      console.error('Failed to update news:', error);
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
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
          href="/admin/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">소식 수정</h1>
        <p className="text-gray-600 mt-2">뉴스 정보를 수정합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                유형 *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {types.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Highlight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                하이라이트
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.highlight}
                  onChange={(e) => setFormData(prev => ({ ...prev, highlight: e.target.checked }))}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">메인 페이지에 강조 표시</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">내용</h2>

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
                placeholder="뉴스 제목을 입력하세요"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요약 설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="간략한 설명을 입력하세요"
                rows={3}
                required
              />
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 내용
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="상세 내용을 입력하세요 (선택사항)"
                rows={8}
              />
            </div>
          </div>
        </div>

        {/* Media & Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">미디어 & 링크</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="이미지 URL"
              />
            </div>

            {/* External Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                외부 링크
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://..."
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                출처
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 조선일보, 휴먼에이드포스트"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">태그</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="태그를 입력하고 추가 버튼을 누르세요"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/news"
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
