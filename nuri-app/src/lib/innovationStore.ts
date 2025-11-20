// 혁신기술/핵심기술 타입
export interface TechnologyItem {
  id: number;
  name: string;
  category: 'ai' | 'iot' | 'automation' | 'data' | 'biotech' | 'other';
  type: 'core' | 'applied' | 'research';
  description: string;
  features: string[];
  status: 'active' | 'development' | 'planning' | 'completed';
  developmentStartDate?: string;
  completionDate?: string;
  team?: string;
  budget?: number;
  impact?: string;
  relatedPatents?: number[];
  relatedProjects?: number[];
}

// R&D 프로젝트 타입
export interface RDProjectItem {
  id: number;
  projectCode: string;
  name: string;
  category: 'government' | 'internal' | 'collaboration' | 'contract';
  status: 'planning' | 'ongoing' | 'completed' | 'suspended';
  startDate: string;
  endDate?: string;
  budget: number;
  fundingSource?: string;
  projectManager: string;
  team: string[];
  description: string;
  objectives: string[];
  deliverables: string[];
  progress: number; // 0-100
  relatedTechnologies?: number[];
  relatedPatents?: number[];
}

// 특허 & IP 타입
export interface PatentItem {
  id: number;
  patentNumber: string;
  title: string;
  type: 'patent' | 'trademark' | 'design' | 'copyright' | 'trade_secret';
  status: 'preparing' | 'filed' | 'published' | 'registered' | 'expired' | 'abandoned';
  filingDate?: string;
  registrationDate?: string;
  expirationDate?: string;
  country: string[];
  inventors: string[];
  abstract: string;
  claims?: string[];
  relatedTechnologies?: number[];
  relatedProjects?: number[];
  cost?: number;
  maintenanceFee?: number;
}

// 초기 혁신기술 데이터
export const initialTechnologies: TechnologyItem[] = [
  {
    id: 1,
    name: 'AI 기반 작물 생육 예측 시스템',
    category: 'ai',
    type: 'core',
    description: '딥러닝을 활용한 작물 생육 단계 예측 및 수확량 최적화 시스템',
    features: [
      '실시간 생육 데이터 분석',
      '환경 변수 기반 예측 모델',
      '수확 시기 자동 알림',
      '병해충 조기 감지'
    ],
    status: 'active',
    developmentStartDate: '2022-03-15',
    completionDate: '2023-06-20',
    team: 'AI연구팀',
    budget: 500000000,
    impact: '수확량 25% 증가, 병해충 피해 40% 감소',
    relatedPatents: [1, 2],
    relatedProjects: [1]
  },
  {
    id: 2,
    name: 'IoT 스마트팜 자동화 플랫폼',
    category: 'iot',
    type: 'core',
    description: '센서 네트워크 기반 농장 환경 자동 제어 시스템',
    features: [
      '온습도 자동 제어',
      '영양분 공급 자동화',
      'LED 조명 최적화',
      '원격 모니터링'
    ],
    status: 'active',
    developmentStartDate: '2021-09-01',
    completionDate: '2022-12-31',
    team: 'IoT개발팀',
    budget: 350000000,
    impact: '에너지 사용량 30% 절감, 생산성 20% 향상',
    relatedPatents: [3],
    relatedProjects: [2, 3]
  },
  {
    id: 3,
    name: '발달장애인 맞춤형 작업 인터페이스',
    category: 'other',
    type: 'applied',
    description: '발달장애인의 인지 특성을 고려한 직관적 작업 UI/UX',
    features: [
      '시각적 작업 가이드',
      '음성 안내 시스템',
      '단순화된 조작 방식',
      '실수 방지 알고리즘'
    ],
    status: 'active',
    developmentStartDate: '2023-01-10',
    team: 'UX연구팀',
    budget: 200000000,
    impact: '작업 효율성 35% 향상, 실수율 60% 감소',
    relatedProjects: [4]
  }
];

// 초기 R&D 프로젝트 데이터
export const initialRDProjects: RDProjectItem[] = [
  {
    id: 1,
    projectCode: 'RD-2023-001',
    name: 'AI 기반 스마트팜 고도화 기술 개발',
    category: 'government',
    status: 'ongoing',
    startDate: '2023-04-01',
    endDate: '2025-03-31',
    budget: 1500000000,
    fundingSource: '과학기술정보통신부',
    projectManager: '김연구',
    team: ['AI연구팀', 'IoT개발팀', '데이터분석팀'],
    description: '인공지능을 활용한 차세대 스마트팜 기술 개발 및 실증',
    objectives: [
      'AI 기반 생육 예측 모델 개발',
      '자동화 시스템 구축',
      '에너지 효율 30% 개선'
    ],
    deliverables: [
      'AI 예측 모델 3종',
      '자동화 시스템 프로토타입',
      '실증 데이터 보고서'
    ],
    progress: 65,
    relatedTechnologies: [1, 2],
    relatedPatents: [1, 2]
  },
  {
    id: 2,
    projectCode: 'RD-2023-002',
    name: '장애인 고용 창출형 농업 모델 개발',
    category: 'government',
    status: 'ongoing',
    startDate: '2023-07-01',
    endDate: '2024-12-31',
    budget: 800000000,
    fundingSource: '고용노동부',
    projectManager: '이사회',
    team: ['UX연구팀', '교육개발팀'],
    description: '발달장애인 특성에 맞는 농업 작업 환경 및 교육 프로그램 개발',
    objectives: [
      '맞춤형 작업 환경 설계',
      '교육 커리큘럼 개발',
      '고용률 50% 향상'
    ],
    deliverables: [
      '작업 환경 가이드라인',
      '교육 프로그램 3종',
      '고용 창출 보고서'
    ],
    progress: 45,
    relatedTechnologies: [3],
    relatedPatents: []
  },
  {
    id: 3,
    projectCode: 'RD-2024-001',
    name: '탄소중립 스마트팜 기술 개발',
    category: 'internal',
    status: 'planning',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    budget: 600000000,
    projectManager: '박환경',
    team: ['환경연구팀', 'IoT개발팀'],
    description: '탄소 배출 저감 및 에너지 자립형 스마트팜 시스템 개발',
    objectives: [
      '탄소 배출 50% 감축',
      '재생에너지 100% 전환',
      '자원 순환 시스템 구축'
    ],
    deliverables: [
      '탄소중립 시스템 설계',
      '에너지 자립 솔루션',
      '환경 영향 평가서'
    ],
    progress: 10,
    relatedTechnologies: [2],
    relatedPatents: []
  }
];

// 초기 특허 데이터
export const initialPatents: PatentItem[] = [
  {
    id: 1,
    patentNumber: 'KR-10-2023-0123456',
    title: '인공지능 기반 작물 생육 예측 시스템 및 방법',
    type: 'patent',
    status: 'registered',
    filingDate: '2023-03-15',
    registrationDate: '2023-09-20',
    expirationDate: '2043-03-15',
    country: ['KR', 'US', 'CN'],
    inventors: ['김연구', '이개발', '박혁신'],
    abstract: '본 발명은 딥러닝 알고리즘을 이용하여 작물의 생육 상태를 실시간으로 예측하고, 최적의 재배 환경을 자동으로 제어하는 시스템에 관한 것이다.',
    claims: [
      '작물 이미지 수집 모듈',
      '딥러닝 기반 분석 엔진',
      '환경 제어 연동 시스템'
    ],
    relatedTechnologies: [1],
    relatedProjects: [1],
    cost: 5000000,
    maintenanceFee: 500000
  },
  {
    id: 2,
    patentNumber: 'KR-10-2023-0234567',
    title: '스마트팜 환경 데이터 통합 관리 플랫폼',
    type: 'patent',
    status: 'filed',
    filingDate: '2023-06-10',
    country: ['KR'],
    inventors: ['이개발', '최데이터'],
    abstract: '다수의 센서로부터 수집된 환경 데이터를 통합 관리하고 실시간으로 분석하여 농장 운영을 최적화하는 플랫폼.',
    relatedTechnologies: [1, 2],
    relatedProjects: [1],
    cost: 3000000
  },
  {
    id: 3,
    patentNumber: 'KR-10-2022-0345678',
    title: 'IoT 기반 자동 관수 시스템',
    type: 'patent',
    status: 'registered',
    filingDate: '2022-08-20',
    registrationDate: '2023-02-15',
    expirationDate: '2042-08-20',
    country: ['KR', 'JP'],
    inventors: ['박혁신', '정자동'],
    abstract: '토양 수분 센서와 날씨 예보 데이터를 활용한 지능형 자동 관수 시스템.',
    claims: [
      '토양 수분 측정 장치',
      '날씨 연동 모듈',
      '자동 관수 제어 알고리즘'
    ],
    relatedTechnologies: [2],
    relatedProjects: [2],
    cost: 4000000,
    maintenanceFee: 400000
  },
  {
    id: 4,
    patentNumber: 'TM-2023-0001',
    title: 'NURI Smart Farm',
    type: 'trademark',
    status: 'registered',
    filingDate: '2023-01-10',
    registrationDate: '2023-07-01',
    country: ['KR', 'US', 'VN'],
    inventors: [],
    abstract: 'NURI 스마트팜 브랜드 상표권',
    cost: 2000000,
    maintenanceFee: 200000
  }
];

// 로컬 스토리지 키
const TECH_STORAGE_KEY = 'nuri_technologies';
const RD_STORAGE_KEY = 'nuri_rd_projects';
const PATENT_STORAGE_KEY = 'nuri_patents';

// 혁신기술 CRUD
export const getTechnologies = (): TechnologyItem[] => {
  if (typeof window === 'undefined') return initialTechnologies;

  const stored = localStorage.getItem(TECH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse technologies', e);
    }
  }

  saveTechnologies(initialTechnologies);
  return initialTechnologies;
};

export const saveTechnologies = (items: TechnologyItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TECH_STORAGE_KEY, JSON.stringify(items));
};

export const addTechnology = (item: Omit<TechnologyItem, 'id'>): TechnologyItem => {
  const items = getTechnologies();
  const newItem: TechnologyItem = {
    ...item,
    id: Math.max(...items.map(i => i.id), 0) + 1
  };
  saveTechnologies([...items, newItem]);
  return newItem;
};

export const updateTechnology = (id: number, updates: Partial<TechnologyItem>): boolean => {
  const items = getTechnologies();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  saveTechnologies(items);
  return true;
};

export const deleteTechnology = (id: number): boolean => {
  const items = getTechnologies();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  saveTechnologies(filtered);
  return true;
};

// R&D 프로젝트 CRUD
export const getRDProjects = (): RDProjectItem[] => {
  if (typeof window === 'undefined') return initialRDProjects;

  const stored = localStorage.getItem(RD_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse RD projects', e);
    }
  }

  saveRDProjects(initialRDProjects);
  return initialRDProjects;
};

export const saveRDProjects = (items: RDProjectItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RD_STORAGE_KEY, JSON.stringify(items));
};

export const addRDProject = (item: Omit<RDProjectItem, 'id'>): RDProjectItem => {
  const items = getRDProjects();
  const newItem: RDProjectItem = {
    ...item,
    id: Math.max(...items.map(i => i.id), 0) + 1
  };
  saveRDProjects([...items, newItem]);
  return newItem;
};

export const updateRDProject = (id: number, updates: Partial<RDProjectItem>): boolean => {
  const items = getRDProjects();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  saveRDProjects(items);
  return true;
};

export const deleteRDProject = (id: number): boolean => {
  const items = getRDProjects();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  saveRDProjects(filtered);
  return true;
};

// 특허 CRUD
export const getPatents = (): PatentItem[] => {
  if (typeof window === 'undefined') return initialPatents;

  const stored = localStorage.getItem(PATENT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse patents', e);
    }
  }

  savePatents(initialPatents);
  return initialPatents;
};

export const savePatents = (items: PatentItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PATENT_STORAGE_KEY, JSON.stringify(items));
};

export const addPatent = (item: Omit<PatentItem, 'id'>): PatentItem => {
  const items = getPatents();
  const newItem: PatentItem = {
    ...item,
    id: Math.max(...items.map(i => i.id), 0) + 1
  };
  savePatents([...items, newItem]);
  return newItem;
};

export const updatePatent = (id: number, updates: Partial<PatentItem>): boolean => {
  const items = getPatents();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  savePatents(items);
  return true;
};

export const deletePatent = (id: number): boolean => {
  const items = getPatents();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  savePatents(filtered);
  return true;
};

// 통계 함수들
export const getTechnologyStats = () => {
  const technologies = getTechnologies();
  return {
    total: technologies.length,
    active: technologies.filter(t => t.status === 'active').length,
    development: technologies.filter(t => t.status === 'development').length,
    byCategory: technologies.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};

export const getRDProjectStats = () => {
  const projects = getRDProjects();
  return {
    total: projects.length,
    ongoing: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    avgProgress: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };
};

export const getPatentStats = () => {
  const patents = getPatents();
  return {
    total: patents.length,
    registered: patents.filter(p => p.status === 'registered').length,
    filed: patents.filter(p => p.status === 'filed').length,
    byType: patents.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalCost: patents.reduce((sum, p) => sum + (p.cost || 0), 0)
  };
};