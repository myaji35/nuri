'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Search, Filter, TrendingUp, FileText,
  Users, DollarSign, Award, Calendar, BookOpen,
  ChevronRight, Clock, CheckCircle2, AlertCircle,
  Pause, XCircle, Beaker
} from 'lucide-react';
import { getRDProjects, getRDProjectStats, type RDProject } from '@/lib/rdProjectStore';

export default function RDProjectsPage() {
  const [projects, setProjects] = useState<RDProject[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    planning: 0,
    totalBudget: 0,
    totalBudgetUsed: 0,
    budgetUsageRate: 0,
    totalPatents: 0,
    registeredPatents: 0,
    totalPapers: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getRDProjects();
    setProjects(allProjects);
    setStats(getRDProjectStats());
  };

  const filteredProjects = projects.filter(project => {
    const matchSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project.leadResearcher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount) + '원';
  };

  const getStatusInfo = (status: RDProject['status']) => {
    switch (status) {
      case 'planning':
        return { label: '기획중', color: 'bg-purple-100 text-purple-700', icon: Clock };
      case 'ongoing':
        return { label: '진행중', color: 'bg-blue-100 text-blue-700', icon: TrendingUp };
      case 'completed':
        return { label: '완료', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
      case 'suspended':
        return { label: '중단', color: 'bg-yellow-100 text-yellow-700', icon: Pause };
      case 'cancelled':
        return { label: '취소', color: 'bg-red-100 text-red-700', icon: XCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
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
    return labels[category] || category;
  };

  const getPriorityColor = (priority: RDProject['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const summaryStats = [
    {
      title: '총 프로젝트',
      value: stats.total.toString(),
      subtitle: `진행중 ${stats.ongoing}개`,
      icon: Beaker,
      color: 'bg-blue-500'
    },
    {
      title: '완료 프로젝트',
      value: stats.completed.toString(),
      subtitle: `전체 대비 ${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`,
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    {
      title: '총 예산',
      value: formatCurrency(stats.totalBudget),
      subtitle: `집행률 ${Math.round(stats.budgetUsageRate)}%`,
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: '특허',
      value: stats.totalPatents.toString(),
      subtitle: `등록 ${stats.registeredPatents}건`,
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: '논문',
      value: stats.totalPapers.toString(),
      subtitle: '발표 논문',
      icon: BookOpen,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">R&D 프로젝트 관리</h1>
          <Link
            href="/admin/rd-projects/new"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            신규 프로젝트
          </Link>
        </div>
        <p className="text-gray-600">NURI의 연구개발 프로젝트를 관리합니다</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {summaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-600 text-xs mb-0.5">{stat.title}</h3>
                  <p className="text-xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="프로젝트명, 코드, 책임자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">모든 상태</option>
            <option value="planning">기획중</option>
            <option value="ongoing">진행중</option>
            <option value="completed">완료</option>
            <option value="suspended">중단</option>
            <option value="cancelled">취소</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">모든 카테고리</option>
            <option value="smartfarm">스마트팜</option>
            <option value="automation">자동화</option>
            <option value="ai">AI</option>
            <option value="iot">IoT</option>
            <option value="biotech">바이오</option>
            <option value="sustainability">지속가능성</option>
            <option value="other">기타</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">등록된 R&D 프로젝트가 없습니다</p>
            <p className="text-gray-400 text-sm">새로운 프로젝트를 등록해보세요</p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            const StatusIcon = statusInfo.icon;
            const budgetUsagePercent = (project.budgetUsed / project.totalBudget) * 100;

            return (
              <Link
                key={project.id}
                href={`/admin/rd-projects/${project.id}`}
                className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500">{project.projectCode}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {getCategoryLabel(project.category)}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                          {project.priority === 'high' && '●'}
                          {project.priority === 'medium' && '●'}
                          {project.priority === 'low' && '●'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{project.projectName}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{project.objective}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.leadResearcher}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.startDate} ~ {project.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatCurrency(project.totalBudget)}</span>
                        </div>
                        {project.partnerOrganizations && project.partnerOrganizations.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              협력기관 {project.partnerOrganizations.length}곳
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0 ml-4" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">프로젝트 진행률</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Budget Usage */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">예산 집행률</span>
                      <span className="font-semibold text-gray-900">{Math.round(budgetUsagePercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          budgetUsagePercent > 90 ? 'bg-red-500' :
                          budgetUsagePercent > 70 ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Achievement badges */}
                  <div className="flex flex-wrap gap-2">
                    {project.patents && project.patents.length > 0 && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                        특허 {project.patents.length}건
                      </span>
                    )}
                    {project.papers && project.papers.length > 0 && (
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        논문 {project.papers.length}편
                      </span>
                    )}
                    {project.achievements && project.achievements.length > 0 && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                        성과 {project.achievements.length}건
                      </span>
                    )}
                    {project.keyTechnologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
