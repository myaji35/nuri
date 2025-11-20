'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Edit2, Trash2, Calendar, Clock,
  MapPin, Users, BookOpen, Target, User as UserIcon
} from 'lucide-react';
import Link from 'next/link';
import {
  getProgram,
  deleteProgram,
  getProgramParticipants,
  type EducationParticipant
} from '@/lib/educationStore';

export default function EducationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [program, setProgram] = useState<any>(null);
  const [participants, setParticipants] = useState<EducationParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = getProgram(id);
    if (item) {
      setProgram(item);
      setParticipants(getProgramParticipants(id));
    }
    setLoading(false);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm(`"${program.title}" 교육 프로그램을 삭제하시겠습니까?`)) {
      deleteProgram(id);
      router.push('/admin/education');
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      planned: { label: '예정', color: 'bg-blue-100 text-blue-800' },
      ongoing: { label: '진행중', color: 'bg-green-100 text-green-800' },
      completed: { label: '완료', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: '취소', color: 'bg-red-100 text-red-800' }
    };
    return config[status as keyof typeof config] || config.planned;
  };

  const getParticipantStatusBadge = (status: string) => {
    const config = {
      enrolled: { label: '수강중', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '수료', color: 'bg-green-100 text-green-800' },
      cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800' }
    };
    return config[status as keyof typeof config] || config.enrolled;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    );
  }

  if (!program) {
    return (
      <div>
        <Link
          href="/admin/education"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          뒤로 가기
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">교육 프로그램을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(program.status);
  const enrollmentRate = Math.round((program.enrolled / program.capacity) * 100);

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

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{program.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{program.instructor} 강사</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/admin/education/${id}/edit`}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              수정
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-base font-semibold mb-3">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                교육 일정
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {program.startDate} ~ {program.endDate}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                총 시간
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{program.duration}시간</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                장소
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{program.location}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                정원
              </label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {program.enrolled} / {program.capacity}명 ({enrollmentRate}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${enrollmentRate >= 90 ? 'bg-red-500' : enrollmentRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(enrollmentRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        {(program.description || program.targetAudience || program.objectives) && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-base font-semibold mb-3">상세 정보</h2>

            <div className="space-y-3">
              {program.description && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    교육 설명
                  </label>
                  <p className="text-sm text-gray-900">{program.description}</p>
                </div>
              )}

              {program.targetAudience && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    대상
                  </label>
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                    <span className="text-sm text-gray-900">{program.targetAudience}</span>
                  </div>
                </div>
              )}

              {program.objectives && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    교육 목표
                  </label>
                  <p className="text-sm text-gray-900">{program.objectives}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Participants Card */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">참가자 목록</h2>
            <span className="text-sm text-gray-600">{participants.length}명</span>
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">등록된 참가자가 없습니다</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">이름</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">상태</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase">출석률</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">평가점수</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((participant) => {
                    const pStatusBadge = getParticipantStatusBadge(participant.status);
                    return (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{participant.memberName}</div>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${pStatusBadge.color}`}>
                            {pStatusBadge.label}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{participant.attendance}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${participant.attendance >= 80 ? 'bg-green-500' : participant.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${participant.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 hidden sm:table-cell">
                          {participant.score ? (
                            <span className="text-sm font-medium">{participant.score}점</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 hidden md:table-cell">
                          {participant.enrolledDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            href="/admin/education"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            목록으로
          </Link>
          <Link
            href={`/admin/education/${id}/edit`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Edit2 className="w-4 h-4" />
            수정하기
          </Link>
        </div>
      </div>
    </div>
  );
}
