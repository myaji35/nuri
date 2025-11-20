import { syncWorkplaceToJourney, removeWorkplaceFromJourney } from './journeyStore';

export interface WorkplaceItem {
  id: number;
  name: string; // 사업장명
  address: string; // 주소
  employeeCount: number; // 고용인원
  code: string; // 사업장코드
  country: string; // 국가 코드 (KR, VN, US 등)
  type: 'farm' | 'office' | 'research' | 'training'; // 구분
  description?: string; // 설명
  establishedDate?: string; // 설립일
  contactNumber?: string; // 연락처
  managerName?: string; // 관리자명
  status: 'active' | 'inactive' | 'planning'; // 운영 상태
  parentId?: number; // 상위 계열사 ID
}

export interface WorkplaceRelation {
  id: number;
  parentId: number; // 상위 계열사
  childId: number; // 하위 계열사
  relationType: 'subsidiary' | 'branch' | 'partnership'; // 관계 유형
  description?: string;
}

// 초기 사업장 데이터
export const initialWorkplaces: WorkplaceItem[] = [
  {
    id: 1,
    name: 'NURI 여주 스마트팜',
    address: '경기도 여주시 가남읍 농업단지로 123',
    employeeCount: 35,
    code: 'KR001NURIFARM001',
    country: 'KR',
    type: 'farm',
    description: '첫 번째 스마트팜 시설로 토마토와 파프리카를 주로 생산',
    establishedDate: '2020-06-15',
    contactNumber: '031-123-4567',
    managerName: '김농부',
    status: 'active'
  },
  {
    id: 2,
    name: 'NURI 이천 교육센터',
    address: '경기도 이천시 교육로 456',
    employeeCount: 12,
    code: 'KR002NURITRAIN001',
    country: 'KR',
    type: 'training',
    description: '발달장애인 전문 농업 교육 센터',
    establishedDate: '2021-03-01',
    contactNumber: '031-234-5678',
    managerName: '이교육',
    status: 'active'
  },
  {
    id: 3,
    name: 'NURI 호치민 팜',
    address: 'District 9, Ho Chi Minh City, Vietnam',
    employeeCount: 50,
    code: 'VN001NURIFARM001',
    country: 'VN',
    type: 'farm',
    description: '베트남 첫 해외 스마트팜',
    establishedDate: '2023-06-20',
    contactNumber: '+84-28-1234-5678',
    managerName: 'Nguyen Van A',
    status: 'active'
  },
  {
    id: 4,
    name: 'NURI 서울 본사',
    address: '서울특별시 강남구 테헤란로 123 NURI빌딩',
    employeeCount: 25,
    code: 'KR003NURIOFFICE001',
    country: 'KR',
    type: 'office',
    description: '본사 및 R&D 센터',
    establishedDate: '2019-03-15',
    contactNumber: '02-555-1234',
    managerName: '박대표',
    status: 'active'
  },
  {
    id: 5,
    name: 'NURI 캘리포니아 법인',
    address: '123 Silicon Valley Blvd, San Jose, CA 95110, USA',
    employeeCount: 8,
    code: 'US001NURIOFFICE001',
    country: 'US',
    type: 'office',
    description: '북미 시장 진출 거점',
    establishedDate: '2024-03-10',
    contactNumber: '+1-408-123-4567',
    managerName: 'John Smith',
    status: 'active'
  },
  {
    id: 6,
    name: 'NURI 안성 스마트팜 (예정)',
    address: '경기도 안성시 미정',
    employeeCount: 0,
    code: 'KR004NURIFARM002',
    country: 'KR',
    type: 'farm',
    description: '2025년 개장 예정 스마트팜',
    establishedDate: '2025-03-01',
    contactNumber: '',
    managerName: '',
    status: 'planning'
  }
];

// 로컬 스토리지 키
const STORAGE_KEY = 'nuri_workplaces';

// 사업장 코드 생성 함수
export const generateWorkplaceCode = (country: string, type: string): string => {
  const workplaces = getWorkplaces();

  // 국가코드 1자리 (2자리 국가코드의 첫 글자만 사용)
  const countryCode = country.substring(0, 1);

  // 같은 국가의 사업장들 필터링하여 국가순번(2자리) 생성
  const countryWorkplaces = workplaces.filter(w => w.country === country);
  const countryNumber = String(countryWorkplaces.length + 1).padStart(2, '0');

  // 같은 타입의 사업장들 필터링하여 타입순번(2자리) 생성
  const typeWorkplaces = workplaces.filter(w => w.type === type);
  const typeNumber = String(typeWorkplaces.length + 1).padStart(2, '0');

  // 타입별 코드 매핑 (4-6자리)
  const typeCode = {
    'farm': 'FARM',
    'office': 'OFFICE',
    'research': 'RND',
    'training': 'TRAIN'
  }[type] || 'OTHER';

  // 코드 생성: 국가코드(1) + 국가순번(2) + NURI + 구분(4-6) + 순번(2)
  return `${countryCode}${countryNumber}NURI${typeCode}${typeNumber}`;
};

// 사업장 목록 가져오기
export const getWorkplaces = (): WorkplaceItem[] => {
  if (typeof window === 'undefined') return initialWorkplaces;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse workplaces from localStorage', e);
    }
  }

  // 초기 데이터 저장
  saveWorkplaces(initialWorkplaces);
  return initialWorkplaces;
};

// 사업장 저장
export const saveWorkplaces = (items: WorkplaceItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// 사업장 추가
export const addWorkplace = (item: Omit<WorkplaceItem, 'id'>): WorkplaceItem => {
  const workplaces = getWorkplaces();
  const newItem: WorkplaceItem = {
    ...item,
    id: Math.max(...workplaces.map(i => i.id), 0) + 1
  };
  saveWorkplaces([...workplaces, newItem]);

  // Journey에 자동 반영
  syncWorkplaceToJourney({
    code: newItem.code,
    name: newItem.name,
    establishedDate: newItem.establishedDate,
    type: newItem.type,
    country: newItem.country
  });

  return newItem;
};

// 사업장 수정
export const updateWorkplace = (id: number, updates: Partial<WorkplaceItem>): boolean => {
  const workplaces = getWorkplaces();
  const index = workplaces.findIndex(item => item.id === id);
  if (index === -1) return false;

  workplaces[index] = { ...workplaces[index], ...updates };
  saveWorkplaces(workplaces);

  // Journey에 자동 반영
  const updatedWorkplace = workplaces[index];
  syncWorkplaceToJourney({
    code: updatedWorkplace.code,
    name: updatedWorkplace.name,
    establishedDate: updatedWorkplace.establishedDate,
    type: updatedWorkplace.type,
    country: updatedWorkplace.country
  });

  return true;
};

// 사업장 삭제
export const deleteWorkplace = (id: number): boolean => {
  const workplaces = getWorkplaces();
  const workplace = workplaces.find(item => item.id === id);
  if (!workplace) return false;

  const filtered = workplaces.filter(item => item.id !== id);
  saveWorkplaces(filtered);

  // Journey에서도 삭제
  removeWorkplaceFromJourney(workplace.code);

  return true;
};

// 사업장 하나 가져오기
export const getWorkplace = (id: number): WorkplaceItem | undefined => {
  const workplaces = getWorkplaces();
  return workplaces.find(item => item.id === id);
};

// 통계 정보 가져오기
export const getWorkplaceStats = () => {
  const workplaces = getWorkplaces();

  return {
    total: workplaces.length,
    active: workplaces.filter(w => w.status === 'active').length,
    inactive: workplaces.filter(w => w.status === 'inactive').length,
    planning: workplaces.filter(w => w.status === 'planning').length,
    totalEmployees: workplaces.reduce((sum, w) => sum + w.employeeCount, 0),
    byCountry: workplaces.reduce((acc, w) => {
      acc[w.country] = (acc[w.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byType: workplaces.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};

// 계열사 관계 관리
const RELATIONS_KEY = 'nuri_workplace_relations';

const initialRelations: WorkplaceRelation[] = [];

export const getWorkplaceRelations = (): WorkplaceRelation[] => {
  if (typeof window === 'undefined') return initialRelations;

  const stored = localStorage.getItem(RELATIONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse relations', e);
    }
  }

  localStorage.setItem(RELATIONS_KEY, JSON.stringify(initialRelations));
  return initialRelations;
};

const saveRelations = (relations: WorkplaceRelation[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RELATIONS_KEY, JSON.stringify(relations));
};

export const addWorkplaceRelation = (relation: Omit<WorkplaceRelation, 'id'>): WorkplaceRelation => {
  const relations = getWorkplaceRelations();
  const newRelation: WorkplaceRelation = {
    ...relation,
    id: relations.length > 0 ? Math.max(...relations.map(r => r.id)) + 1 : 1
  };
  relations.push(newRelation);
  saveRelations(relations);
  return newRelation;
};

export const deleteWorkplaceRelation = (id: number): boolean => {
  const relations = getWorkplaceRelations();
  const filtered = relations.filter(r => r.id !== id);
  if (filtered.length === relations.length) return false;
  saveRelations(filtered);
  return true;
};

export const getWorkplaceChildren = (parentId: number): WorkplaceItem[] => {
  const workplaces = getWorkplaces();
  return workplaces.filter(w => w.parentId === parentId);
};

export const getWorkplaceHierarchy = () => {
  const workplaces = getWorkplaces();
  const rootWorkplaces = workplaces.filter(w => !w.parentId);

  const buildTree = (workplace: WorkplaceItem): any => {
    const children = getWorkplaceChildren(workplace.id);
    return {
      ...workplace,
      children: children.map(child => buildTree(child))
    };
  };

  return rootWorkplaces.map(root => buildTree(root));
};