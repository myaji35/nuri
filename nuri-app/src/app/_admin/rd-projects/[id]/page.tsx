'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Edit, Trash2, Calendar, Users, DollarSign,
  Target, TrendingUp, Award, FileText, ExternalLink,
  CheckCircle2, Clock, AlertCircle, Building2, Lightbulb,
  Beaker, BookOpen
} from 'lucide-react';
import { getRDProject, deleteRDProject, type RDProject } from '@/lib/rdProjectStore';

export default function RDProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<RDProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (params.id) {
      const id = parseInt(params.id as string);
      const projectData = getRDProject(id);
      setProject(projectData || null);
      setLoading(false);
    }
  }, [params.id]);

  const handleDelete = () => {
    if (project) {
      deleteRDProject(project.id);
      router.push('/admin/rd-projects');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프로젝트를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">요청하신 프로젝트가 존재하지 않습니다</p>
          <Link
            href="/admin/rd-projects"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  const getStatusInfo = (status: RDProject['status']) => {
    switch (status) {
      case 'planning':
        return { label: '기획중', color: 'bg-purple-100 text-purple-700' };
      case 'ongoing':
        return { label: '진행중', color: 'bg-blue-100 text-blue-700' };
      case 'completed':
        return { label: '완료', color: 'bg-green-100 text-green-700' };
      case 'suspended':
        return { label: '중단', color: 'bg-yellow-100 text-yellow-700' };
      case 'cancelled':
        return { label: '취소', color: 'bg-red-100 text-red-700' };
    }
  };

  const getCategoryLabel = (category: RDProject['category']) => {
    const labels = {
      smartfarm: '스마트팜',
      automation: '자동화',
      ai: 'AI',
      iot: 'IoT',
      biotech: '바이오',
      sustainability: '지속가능성',
      other: '기타'
    };
    return labels[category];
  };

  const getFundingSourceLabel = (source: RDProject['fundingSource']) => {
    const labels = {
      internal: '내부 자금',
      government: '정부 지원',
      private: '민간 투자',
      partnership: '파트너십',
      mixed: '혼합'
    };
    return labels[source];
  };

  const statusInfo = getStatusInfo(project.status);
  const budgetUsagePercent = (project.budgetUsed / project.totalBudget) * 100;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/rd-projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로 돌아가기
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
                {project.projectCode}
              </span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-700">
                {getCategoryLabel(project.category)}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.projectName}</h1>
            <p className="text-lg text-gray-600">{project.objective}</p>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <Link
              href={`/admin/rd-projects/${project.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4">프로젝트 진행 현황</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">전체 진행률</span>
                  <span className="text-2xl font-bold text-green-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">예산 집행률</span>
                  <span className="text-xl font-bold text-blue-600">{Math.round(budgetUsagePercent)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      budgetUsagePercent > 90 ? 'bg-red-500' :
                      budgetUsagePercent > 70 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-sm text-gray-600">
                  <span>사용: {formatCurrency(project.budgetUsed)}</span>
                  <span>총액: {formatCurrency(project.totalBudget)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              프로젝트 설명
            </h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {project.description}
              </pre>
            </div>
          </div>

          {/* Expected Outcome */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              기대 효과
            </h2>
            <p className="text-gray-700 leading-relaxed">{project.expectedOutcome}</p>
          </div>

          {/* Key Technologies */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              핵심 기술
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.keyTechnologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              마일스톤
            </h2>
            <div className="space-y-4">
              {project.milestones.map((milestone, idx) => {
                const getMilestoneIcon = () => {
                  switch (milestone.status) {
                    case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
                    case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
                    case 'delayed': return <AlertCircle className="w-5 h-5 text-red-600" />;
                    default: return <Clock className="w-5 h-5 text-gray-400" />;
                  }
                };

                return (
                  <div key={milestone.id} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getMilestoneIcon()}
                    </div>
                    <div className="flex-1 pb-4 border-b last:border-b-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                          {formatDate(milestone.targetDate)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                      {milestone.completedDate && (
                        <p className="text-green-600 text-xs mt-1">
                          완료: {formatDate(milestone.completedDate)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          {project.achievements && project.achievements.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                주요 성과
              </h2>
              <div className="space-y-3">
                {project.achievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(achievement.date)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{achievement.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">
                      {achievement.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patents */}
          {project.patents && project.patents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                특허
              </h2>
              <div className="space-y-3">
                {project.patents.map((patent) => (
                  <div key={patent.id} className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{patent.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        patent.status === 'registered' ? 'bg-green-100 text-green-700' :
                        patent.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {patent.status === 'registered' ? '등록' :
                         patent.status === 'applied' ? '출원' : '거절'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>출원번호: {patent.applicationNumber}</p>
                      <p>출원일자: {formatDate(patent.applicationDate)}</p>
                      {patent.registrationNumber && (
                        <p className="text-green-700 font-medium">
                          등록번호: {patent.registrationNumber} ({formatDate(patent.registrationDate!)})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Papers */}
          {project.papers && project.papers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                논문
              </h2>
              <div className="space-y-3">
                {project.papers.map((paper) => (
                  <div key={paper.id} className="p-4 bg-indigo-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{paper.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>저자: {paper.authors.join(', ')}</p>
                      <p>학술지: {paper.journal}</p>
                      <p>발행일: {formatDate(paper.publishedDate)}</p>
                      {paper.doi && (
                        <p className="flex items-center gap-1">
                          DOI: {paper.doi}
                          {paper.url && (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4">기본 정보</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  프로젝트 기간
                </div>
                <p className="text-gray-900 font-medium">
                  {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                </p>
                {project.actualEndDate && (
                  <p className="text-green-600 text-sm mt-1">
                    실제 완료: {formatDate(project.actualEndDate)}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  연구책임자
                </div>
                <p className="text-gray-900 font-medium">{project.leadResearcher}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Users className="w-4 h-4" />
                  팀원
                </div>
                <div className="flex flex-wrap gap-1">
                  {project.teamMembers.map((member, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {project.partnerOrganizations && project.partnerOrganizations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Building2 className="w-4 h-4" />
                    협력 기관
                  </div>
                  <div className="space-y-1">
                    {project.partnerOrganizations.map((org, idx) => (
                      <p key={idx} className="text-gray-900 text-sm">{org}</p>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  자금 출처
                </div>
                <p className="text-gray-900 font-medium">{getFundingSourceLabel(project.fundingSource)}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-bold mb-4">태그</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4">메타 정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">생성일</span>
                <span className="text-gray-900">{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">수정일</span>
                <span className="text-gray-900">{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">프로젝트 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
