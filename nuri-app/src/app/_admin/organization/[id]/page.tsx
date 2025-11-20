'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit2, Trash2, Mail, Phone,
  Calendar, Briefcase, Building2, Shield,
  Crown, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import { getMember, deleteMember } from '@/lib/organizationStore';

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getMember(id);
    if (item) {
      setMember(item);
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm(`${member.name}님을 삭제하시겠습니까?`)) {
      deleteMember(id);
      router.push('/admin/organization');
    }
  };

  const getRoleBadge = (role: string) => {
    const config = {
      admin: { label: '관리자', color: 'bg-red-100 text-red-800', icon: Crown },
      manager: { label: '매니저', color: 'bg-blue-100 text-blue-800', icon: Shield },
      member: { label: '일반', color: 'bg-gray-100 text-gray-800', icon: UserIcon }
    };
    return config[role as keyof typeof config] || config.member;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: '재직중', color: 'bg-green-100 text-green-800' },
      inactive: { label: '휴직', color: 'bg-yellow-100 text-yellow-800' },
      leave: { label: '퇴사', color: 'bg-gray-100 text-gray-800' }
    };
    return config[status as keyof typeof config] || config.active;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div>
        <Link
          href="/admin/organization"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">조직원을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(member.role);
  const statusBadge = getStatusBadge(member.status);
  const RoleIcon = roleBadge.icon;

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

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
              {member.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-gray-600 mt-1">{member.position} · {member.department}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${roleBadge.color}`}>
                  <RoleIcon className="w-4 h-4" />
                  {roleBadge.label}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/organization/${id}/edit`}
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
        {/* Contact Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">연락처 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                이메일
              </label>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <a
                  href={`mailto:${member.email}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  {member.email}
                </a>
              </div>
            </div>

            {member.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  전화번호
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${member.phone}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-700"
                  >
                    {member.phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Work Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">업무 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(member.workplaceIds && member.workplaceIds.length > 0) || member.workplaceName ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  소속 사업장(계열사)
                </label>
                <div className="flex items-start gap-2">
                  <Building2 className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {member.workplaceIds && member.workplaceIds.length > 0 ? (
                      member.workplaceIds.map((workplaceId: number) => (
                        <span key={workplaceId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          소속 사업장
                        </span>
                      ))
                    ) : member.workplaceName ? (
                      <span className="text-lg font-medium text-blue-600">{member.workplaceName}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                부서
              </label>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">{member.department}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                직책
              </label>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">{member.position}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                입사일
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">{member.joinDate}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                재직 기간
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-medium">
                  {(() => {
                    const joinDate = new Date(member.joinDate);
                    const today = new Date();
                    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const years = Math.floor(diffDays / 365);
                    const months = Math.floor((diffDays % 365) / 30);

                    if (years > 0) {
                      return `${years}년 ${months}개월`;
                    } else if (months > 0) {
                      return `${months}개월`;
                    } else {
                      return `${diffDays}일`;
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">권한 정보</h2>

          <div className="flex items-start gap-4">
            <RoleIcon className={`w-12 h-12 ${roleBadge.color.split(' ')[1]}`} />
            <div>
              <h3 className="text-lg font-semibold mb-2">{roleBadge.label}</h3>
              <p className="text-gray-600">
                {member.role === 'admin' && '시스템의 모든 기능과 데이터에 접근할 수 있습니다.'}
                {member.role === 'manager' && '부서 내 조직원 관리 및 데이터 수정 권한이 있습니다.'}
                {member.role === 'member' && '일반 사용자 권한으로 제한된 기능을 사용할 수 있습니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link
            href="/admin/organization"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            목록으로
          </Link>
          <Link
            href={`/admin/organization/${id}/edit`}
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
