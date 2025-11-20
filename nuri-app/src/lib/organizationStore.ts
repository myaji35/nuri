export interface OrganizationMember {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'member';
  joinDate: string;
  phone?: string;
  image?: string;
  status: 'active' | 'inactive' | 'leave';
  workplaceId?: number; // 주 소속 사업장(계열사) ID (호환성 유지)
  workplaceName?: string; // 주 소속 사업장(계열사) 이름 (호환성 유지)
  workplaceIds?: number[]; // 소속 사업장(계열사) ID 배열
}

export interface Department {
  id: number;
  name: string;
  description: string;
  headId?: number; // 부서장 ID
  memberCount: number;
  establishedDate: string;
}

// 초기 부서 데이터
export const initialDepartments: Department[] = [
  {
    id: 1,
    name: '경영지원팀',
    description: '인사, 총무, 재무 관리',
    memberCount: 8,
    establishedDate: '2019-03-01'
  },
  {
    id: 2,
    name: '기술개발팀',
    description: 'AI 및 스마트팜 기술 개발',
    memberCount: 15,
    establishedDate: '2019-03-01'
  },
  {
    id: 3,
    name: '사업운영팀',
    description: '사업장 운영 및 관리',
    memberCount: 25,
    establishedDate: '2019-06-01'
  },
  {
    id: 4,
    name: '마케팅팀',
    description: '브랜딩 및 마케팅 전략',
    memberCount: 6,
    establishedDate: '2020-01-01'
  },
  {
    id: 5,
    name: '해외사업팀',
    description: '글로벌 시장 개척 및 관리',
    memberCount: 10,
    establishedDate: '2023-01-01'
  }
];

// 초기 조직원 데이터
export const initialMembers: OrganizationMember[] = [
  {
    id: 1,
    name: '김대표',
    email: 'ceo@nuri.com',
    position: 'CEO',
    department: '경영지원팀',
    role: 'admin',
    joinDate: '2019-03-01',
    phone: '010-1234-5678',
    status: 'active'
  },
  {
    id: 2,
    name: '이기술',
    email: 'tech.lead@nuri.com',
    position: 'CTO',
    department: '기술개발팀',
    role: 'admin',
    joinDate: '2019-03-01',
    phone: '010-2345-6789',
    status: 'active'
  },
  {
    id: 3,
    name: '박운영',
    email: 'operations@nuri.com',
    position: 'COO',
    department: '사업운영팀',
    role: 'admin',
    joinDate: '2019-06-01',
    phone: '010-3456-7890',
    status: 'active'
  },
  {
    id: 4,
    name: '최마케팅',
    email: 'marketing@nuri.com',
    position: '마케팅 팀장',
    department: '마케팅팀',
    role: 'manager',
    joinDate: '2020-01-15',
    phone: '010-4567-8901',
    status: 'active'
  },
  {
    id: 5,
    name: '강해외',
    email: 'global@nuri.com',
    position: '해외사업 팀장',
    department: '해외사업팀',
    role: 'manager',
    joinDate: '2023-01-10',
    phone: '010-5678-9012',
    status: 'active'
  }
];

// 로컬 스토리지 키
const MEMBERS_KEY = 'nuri_organization_members';
const DEPARTMENTS_KEY = 'nuri_organization_departments';

// 조직원 관리 함수들
export const getMembers = (): OrganizationMember[] => {
  if (typeof window === 'undefined') return initialMembers;

  const stored = localStorage.getItem(MEMBERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse members from localStorage', e);
    }
  }

  saveMembers(initialMembers);
  return initialMembers;
};

export const saveMembers = (members: OrganizationMember[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

export const getMember = (id: number): OrganizationMember | undefined => {
  const members = getMembers();
  return members.find(member => member.id === id);
};

export const addMember = (member: Omit<OrganizationMember, 'id'>): OrganizationMember => {
  const members = getMembers();
  const newMember: OrganizationMember = {
    ...member,
    id: Math.max(...members.map(m => m.id), 0) + 1
  };
  saveMembers([...members, newMember]);

  // 부서 인원 수 업데이트
  updateDepartmentMemberCount();

  return newMember;
};

export const updateMember = (id: number, updates: Partial<OrganizationMember>): boolean => {
  const members = getMembers();
  const index = members.findIndex(member => member.id === id);
  if (index === -1) return false;

  const oldDepartment = members[index].department;
  members[index] = { ...members[index], ...updates };
  saveMembers(members);

  // 부서 변경 시 인원 수 업데이트
  if (updates.department && updates.department !== oldDepartment) {
    updateDepartmentMemberCount();
  }

  return true;
};

export const deleteMember = (id: number): boolean => {
  const members = getMembers();
  const filtered = members.filter(member => member.id !== id);
  if (filtered.length === members.length) return false;

  saveMembers(filtered);
  updateDepartmentMemberCount();
  return true;
};

// 부서 관리 함수들
export const getDepartments = (): Department[] => {
  if (typeof window === 'undefined') return initialDepartments;

  const stored = localStorage.getItem(DEPARTMENTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse departments from localStorage', e);
    }
  }

  saveDepartments(initialDepartments);
  return initialDepartments;
};

export const saveDepartments = (departments: Department[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(departments));
};

export const getDepartment = (id: number): Department | undefined => {
  const departments = getDepartments();
  return departments.find(dept => dept.id === id);
};

export const addDepartment = (department: Omit<Department, 'id' | 'memberCount'>): Department => {
  const departments = getDepartments();
  const newDepartment: Department = {
    ...department,
    id: Math.max(...departments.map(d => d.id), 0) + 1,
    memberCount: 0
  };
  saveDepartments([...departments, newDepartment]);
  return newDepartment;
};

export const updateDepartment = (id: number, updates: Partial<Department>): boolean => {
  const departments = getDepartments();
  const index = departments.findIndex(dept => dept.id === id);
  if (index === -1) return false;

  departments[index] = { ...departments[index], ...updates };
  saveDepartments(departments);
  return true;
};

export const deleteDepartment = (id: number): boolean => {
  const departments = getDepartments();
  const department = departments.find(d => d.id === id);
  if (!department) return false;

  // 부서에 소속된 조직원이 있는지 확인
  const members = getMembers();
  const hasMembers = members.some(m => m.department === department.name);

  if (hasMembers) {
    throw new Error('부서에 소속된 조직원이 있어 삭제할 수 없습니다.');
  }

  const filtered = departments.filter(dept => dept.id !== id);
  saveDepartments(filtered);
  return true;
};

// 부서별 인원 수 자동 업데이트
export const updateDepartmentMemberCount = (): void => {
  const members = getMembers();
  const departments = getDepartments();

  departments.forEach(dept => {
    const count = members.filter(m => m.department === dept.name && m.status === 'active').length;
    dept.memberCount = count;
  });

  saveDepartments(departments);
};

// 통계 함수
export const getOrganizationStats = () => {
  const members = getMembers();
  const departments = getDepartments();

  return {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    inactiveMembers: members.filter(m => m.status === 'inactive').length,
    leavedMembers: members.filter(m => m.status === 'leave').length,
    totalDepartments: departments.length,
    adminCount: members.filter(m => m.role === 'admin' && m.status === 'active').length,
    managerCount: members.filter(m => m.role === 'manager' && m.status === 'active').length,
    memberCount: members.filter(m => m.role === 'member' && m.status === 'active').length
  };
};

// 부서별 조직원 조회
export const getMembersByDepartment = (departmentName: string): OrganizationMember[] => {
  const members = getMembers();
  return members.filter(m => m.department === departmentName);
};

// 역할별 조직원 조회
export const getMembersByRole = (role: 'admin' | 'manager' | 'member'): OrganizationMember[] => {
  const members = getMembers();
  return members.filter(m => m.role === role);
};

// 상태별 조직원 조회
export const getMembersByStatus = (status: 'active' | 'inactive' | 'leave'): OrganizationMember[] => {
  const members = getMembers();
  return members.filter(m => m.status === status);
};
