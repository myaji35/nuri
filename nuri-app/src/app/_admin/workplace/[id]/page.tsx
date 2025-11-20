'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Trash2, MapPin, Users, Building2, Calendar, Phone, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { getWorkplace, deleteWorkplace, type WorkplaceItem } from '@/lib/workplaceStore';

export default function WorkplaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [workplace, setWorkplace] = useState<WorkplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const data = getWorkplace(id);
    if (data) {
      setWorkplace(data);
    } else {
      alert('사업장을 찾을 수 없습니다.');
      router.push('/admin/workplace');
    }
    setLoading(false);
  }, [id, router]);

  const handleDelete = () => {
    if (deleteConfirm) {
      const success = deleteWorkplace(id);
      if (success) {
        alert('사업장이 삭제되었습니다.');
        router.push('/admin/workplace');
      } else {
        alert('삭제에 실패했습니다.');
      }
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: '운영중' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: '운영중단' },
      planning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '계획중' }
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      farm: { bg: 'bg-green-100', text: 'text-green-800', label: '농장' },
      office: { bg: 'bg-blue-100', text: 'text-blue-800', label: '사무실' },
      research: { bg: 'bg-purple-100', text: 'text-purple-800', label: '연구소' },
      training: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '교육센터' }
    };
    return typeConfig[type as keyof typeof typeConfig] || { bg: 'bg-gray-100', text: 'text-gray-800', label: type };
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      KR: '🇰🇷',
      VN: '🇻🇳',
      US: '🇺🇸',
      JP: '🇯🇵',
      CN: '🇨🇳',
      TH: '🇹🇭',
      PH: '🇵🇭'
    };
    return flags[country] || '🏳️';
  };

  const getCountryName = (country: string) => {
    const names: Record<string, string> = {
      KR: '한국',
      VN: '베트남',
      US: '미국',
      JP: '일본',
      CN: '중국',
      TH: '태국',
      PH: '필리핀'
    };
    return names[country] || country;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!workplace) {
    return null;
  }

  const statusInfo = getStatusBadge(workplace.status);
  const typeInfo = getTypeBadge(workplace.type);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/workplace"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <span className="text-4xl">{getCountryFlag(workplace.country)}</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{workplace.name}</h1>
              <p className="text-gray-600 mt-2 font-mono">{workplace.code}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/workplace/${workplace.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                deleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {deleteConfirm ? '정말 삭제하시겠습니까?' : '삭제'}
            </button>
          </div>
        </div>
      </div>

      {/* Status & Type Badges */}
      <div className="flex gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}>
          {statusInfo.label}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.bg} ${typeInfo.text}`}>
          {typeInfo.label}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              위치 정보
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">국가</label>
                <p className="text-gray-900 mt-1">
                  {getCountryFlag(workplace.country)} {getCountryName(workplace.country)} ({workplace.country})
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">주소</label>
                <p className="text-gray-900 mt-1">{workplace.address}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {workplace.description && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                설명
              </h2>
              <p className="text-gray-700 leading-relaxed">{workplace.description}</p>
            </div>
          )}
        </div>

        {/* Side Information */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              통계
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">고용인원</span>
                <span className="text-2xl font-bold text-green-600">{workplace.employeeCount}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">연락처 정보</h2>
            <div className="space-y-3">
              {workplace.managerName && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">관리자</p>
                    <p className="text-gray-900">{workplace.managerName}</p>
                  </div>
                </div>
              )}
              {workplace.contactNumber && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">전화번호</p>
                    <p className="text-gray-900">{workplace.contactNumber}</p>
                  </div>
                </div>
              )}
              {workplace.establishedDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">설립일</p>
                    <p className="text-gray-900">{workplace.establishedDate}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Code Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">사업장 코드</h3>
            <p className="font-mono text-sm text-blue-800 mb-2">{workplace.code}</p>
            <p className="text-xs text-blue-700">
              국가코드(1) + 국가순번(2) + NURI + 구분(4-6) + 순번(2)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
