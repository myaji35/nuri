'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit2, Trash2, Calendar,
  Star, Tag, ExternalLink, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { getNewsItem, deleteNewsItem } from '@/lib/newsStore';

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getNewsItem(id);
    if (item) {
      setNews(item);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('삭제 하시겠습니까?')) {
      deleteNewsItem(id);
      router.push('/admin/news');
    }
  };

  const getCategoryBadge = (category?: string) => {
    const config = {
      media: { label: '언론보도', color: 'bg-purple-100 text-purple-800' },
      investment: { label: '투자', color: 'bg-green-100 text-green-800' },
      global: { label: '해외진출', color: 'bg-blue-100 text-blue-800' },
      award: { label: '수상/인증', color: 'bg-yellow-100 text-yellow-800' },
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

  if (!news) {
    return (
      <div>
        <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">소식을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryBadge(news.category);

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

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{news.title}</h1>
              {news.highlight && (
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-gray-600">소식 상세 정보</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/news/${id}/edit`}
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
                <span className="text-lg font-medium">{news.date}</span>
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
                하이라이트
              </label>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {news.highlight ? (
                    <span className="text-yellow-600">중요 소식</span>
                  ) : (
                    <span className="text-gray-500">일반 소식</span>
                  )}
                </span>
              </div>
            </div>

            {news.source && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  출처
                </label>
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-medium">{news.source}</span>
                </div>
              </div>
            )}
          </div>

          {news.link && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                외부 링크
              </label>
              <a
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
                {news.link}
              </a>
            </div>
          )}
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">요약</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {news.description}
          </p>
        </div>

        {/* Content Card */}
        {news.content && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">내용</h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {news.content}
            </div>
          </div>
        )}

        {/* Tags Card */}
        {news.tags && news.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">태그</h2>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/admin/news"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            목록으로
          </Link>
          <Link
            href={`/admin/news/${id}/edit`}
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
