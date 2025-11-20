'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, Search, Users,
  UserPlus, Filter, Building2, Crown, Shield,
  User as UserIcon
} from 'lucide-react';
import {
  getMembers,
  getDepartments,
  deleteMember,
  getOrganizationStats,
  type OrganizationMember,
  type Department
} from '@/lib/organizationStore';
import { getWorkplaces } from '@/lib/workplaceStore';
import Link from 'next/link';

export default function AdminOrganizationPage() {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workplaces, setWorkplaces] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');
  const [selectedOrgChartWorkplace, setSelectedOrgChartWorkplace] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'org-chart' | 'workplace-network'>('org-chart');
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    leavedMembers: 0,
    totalDepartments: 0,
    adminCount: 0,
    managerCount: 0,
    memberCount: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMembers(getMembers());
    setDepartments(getDepartments());
    setWorkplaces(getWorkplaces());
    setStats(getOrganizationStats());
  };

  const handleDelete = (id: number) => {
    const member = members.find(m => m.id === id);
    if (window.confirm(`${member?.name}님을 삭제하시겠습니까?`)) {
      deleteMember(id);
      loadData();
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === 'all' || member.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    const matchesWorkplace =
      selectedWorkplace === 'all' ||
      (selectedWorkplace === 'none' && !member.workplaceId) ||
      member.workplaceId?.toString() === selectedWorkplace;
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus && matchesWorkplace;
  });

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">조직 관리</h1>
          <p className="text-gray-600 mt-2">조직원 및 부서 정보를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/organization/departments"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Building2 className="w-5 h-5" />
            부서 관리
          </Link>
          <Link
            href="/admin/organization/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            새 조직원 추가
          </Link>
        </div>
      </div>

      {/* Organization Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab('org-chart')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'org-chart'
                ? 'text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            조직도
            {activeTab === 'org-chart' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('workplace-network')}
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === 'workplace-network'
                ? 'text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            계열사 연결도
            {activeTab === 'workplace-network' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>

        {/* Organization Chart Tab */}
        {activeTab === 'org-chart' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">조직도</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">사업장(계열사):</label>
                <select
              value={selectedOrgChartWorkplace}
              onChange={(e) => setSelectedOrgChartWorkplace(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">전체</option>
              <option value="none">본사</option>
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id.toString()}>
                  {workplace.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {(() => {
            const filteredAdmins = members.filter(m => {
              const isAdmin = m.role === 'admin' && m.status === 'active';
              const matchesWorkplace =
                selectedOrgChartWorkplace === 'all' ||
                (selectedOrgChartWorkplace === 'none' && !m.workplaceId) ||
                m.workplaceId?.toString() === selectedOrgChartWorkplace;
              return isAdmin && matchesWorkplace;
            });

            const filteredDepartments = departments.filter(dept => {
              const deptMembers = members.filter(m => {
                const isDeptMember = m.department === dept.name && m.status === 'active';
                const matchesWorkplace =
                  selectedOrgChartWorkplace === 'all' ||
                  (selectedOrgChartWorkplace === 'none' && !m.workplaceId) ||
                  m.workplaceId?.toString() === selectedOrgChartWorkplace;
                return isDeptMember && matchesWorkplace;
              });
              return deptMembers.length > 0;
            });

            if (filteredAdmins.length === 0 && filteredDepartments.length === 0) {
              return (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">선택한 사업장에 등록된 조직원이 없습니다</p>
                  <p className="text-gray-400 text-sm mt-2">조직원을 추가하고 사업장을 지정해주세요</p>
                </div>
              );
            }

            return (
              <div className="inline-flex flex-col items-center min-w-full">
                {/* CEO Level */}
                {filteredAdmins.length > 0 && (
                  <div className="mb-8">
                    {filteredAdmins.slice(0, 1).map(admin => (
                      <div key={admin.id} className="flex flex-col items-center">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4 shadow-lg min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                              {admin.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-sm">{admin.name}</div>
                              <div className="text-xs opacity-90">{admin.position}</div>
                            </div>
                          </div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Department Level */}
                <div className="flex flex-wrap justify-center gap-8">
              {departments.map(dept => {
                const deptMembers = members.filter(m => {
                  const isDeptMember = m.department === dept.name && m.status === 'active';
                  const matchesWorkplace =
                    selectedOrgChartWorkplace === 'all' ||
                    (selectedOrgChartWorkplace === 'none' && !m.workplaceId) ||
                    m.workplaceId?.toString() === selectedOrgChartWorkplace;
                  return isDeptMember && matchesWorkplace;
                });
                const deptHead = deptMembers.find(m => m.role === 'manager');
                const deptStaff = deptMembers.filter(m => m.role === 'member');

                // Skip departments with no members in selected workplace
                if (deptMembers.length === 0) return null;

                return (
                  <div key={dept.id} className="flex flex-col items-center">
                    {/* Vertical Line from CEO (only if CEO exists) */}
                    {filteredAdmins.length > 0 && <div className="w-px h-8 bg-gray-300"></div>}

                    {/* Department Box */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md min-w-[180px] mb-4">
                      <div className="text-center">
                        <Building2 className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-bold text-sm">{dept.name}</div>
                        <div className="text-xs opacity-90 mt-1">{deptMembers.length}명</div>
                      </div>
                    </div>

                    {/* Department Head */}
                    {deptHead && (
                      <>
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-lg p-3 shadow-sm min-w-[160px] mb-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <div>
                              <div className="font-semibold text-xs">{deptHead.name}</div>
                              <div className="text-xs opacity-90">{deptHead.position}</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Department Staff */}
                    {deptStaff.length > 0 && (
                      <>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex flex-col gap-2">
                          {deptStaff.map(staff => (
                            <div key={staff.id} className="bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-sm min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {staff.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-xs text-gray-900">{staff.name}</div>
                                  <div className="text-xs text-gray-600">{staff.position}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
                </div>
              </div>
            );
          })()}
        </div>
          </>
        )}

        {/* Workplace Network Tab */}
        {activeTab === 'workplace-network' && (
          <div className="py-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">계열사 연결도</h3>
              <p className="text-sm text-gray-600">사업장 간의 관계를 시각적으로 확인할 수 있습니다</p>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex flex-col items-center min-w-full gap-8 py-6">
                {workplaces.filter(w => !w.parentId).map(rootWorkplace => {
                  const renderWorkplaceTree = (workplace: any, level: number = 0): any => {
                    const children = workplaces.filter(w => w.parentId === workplace.id);

                    return (
                      <div key={workplace.id} className="flex flex-col items-center">
                        {/* Workplace Card */}
                        <div className={`relative ${level > 0 ? 'mt-8' : ''}`}>
                          {level > 0 && (
                            <div className="absolute bottom-full left-1/2 w-px h-8 bg-gray-300"></div>
                          )}
                          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg min-w-[220px]">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-8 h-8" />
                              <div>
                                <div className="font-bold text-sm">{workplace.name}</div>
                                <div className="text-xs opacity-90">{workplace.code}</div>
                                <div className="text-xs opacity-75 mt-1">{workplace.employeeCount}명</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Children */}
                        {children.length > 0 && (
                          <div className="flex gap-8 mt-8">
                            {children.map(child => renderWorkplaceTree(child, level + 1))}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return renderWorkplaceTree(rootWorkplace);
                })}

                {workplaces.filter(w => !w.parentId).length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">등록된 사업장이 없습니다</p>
                    <p className="text-gray-400 text-sm mt-2">사업장을 추가해주세요</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>안내:</strong> 사업장 수정 페이지에서 상위 계열사를 설정하여 연결 관계를 구성할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalMembers}</div>
              <div className="text-sm text-gray-600">전체 조직원</div>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.activeMembers}</div>
              <div className="text-sm text-gray-600">재직중</div>
            </div>
            <UserPlus className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalDepartments}</div>
              <div className="text-sm text-gray-600">부서</div>
            </div>
            <Building2 className="w-10 h-10 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.adminCount}</div>
              <div className="text-sm text-gray-600">관리자</div>
            </div>
            <Crown className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="이름, 이메일, 직책으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Workplace Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">사업장</label>
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">전체</option>
                <option value="none">미지정</option>
                {workplaces.map((workplace) => (
                  <option key={workplace.id} value={workplace.id.toString()}>
                    {workplace.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">부서</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">전체 부서</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">전체 역할</option>
                <option value="admin">관리자</option>
                <option value="manager">매니저</option>
                <option value="member">일반</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">전체 상태</option>
                <option value="active">재직중</option>
                <option value="inactive">휴직</option>
                <option value="leave">퇴사</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                조직원
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                부서
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                직책
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                역할
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                상태
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden xl:table-cell">
                입사일
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => {
              const roleBadge = getRoleBadge(member.role);
              const statusBadge = getStatusBadge(member.status);
              const RoleIcon = roleBadge.icon;

              return (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 min-w-[180px]">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 whitespace-nowrap">{member.name}</div>
                        <div className="text-sm text-gray-500 truncate">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-900 whitespace-nowrap">{member.department}</div>
                  </td>
                  <td className="px-3 py-4 hidden lg:table-cell">
                    <div className="text-sm text-gray-900 whitespace-nowrap">{member.position}</div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full whitespace-nowrap ${roleBadge.color}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleBadge.label}
                    </span>
                  </td>
                  <td className="px-3 py-4 hidden sm:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full whitespace-nowrap ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-3 py-4 hidden xl:table-cell">
                    <div className="text-sm text-gray-600 whitespace-nowrap">{member.joinDate}</div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/organization/${member.id}`}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/organization/${member.id}/edit`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
