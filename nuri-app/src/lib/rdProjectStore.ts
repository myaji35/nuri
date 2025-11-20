export interface RDProject {
  id: number;
  projectCode: string; // 프로젝트 코드 (예: RD-2024-001)
  projectName: string;
  category: 'smartfarm' | 'automation' | 'ai' | 'iot' | 'biotech' | 'sustainability' | 'other';
  status: 'planning' | 'ongoing' | 'completed' | 'suspended' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  actualEndDate?: string; // 실제 종료일 (완료된 경우)

  // 팀 및 인력
  leadResearcher: string; // 연구책임자
  teamMembers: string[]; // 팀원 목록
  partnerOrganizations?: string[]; // 협력 기관

  // 재정 정보
  totalBudget: number; // 총 예산 (원)
  budgetUsed: number; // 사용한 예산 (원)
  fundingSource: 'internal' | 'government' | 'private' | 'partnership' | 'mixed'; // 자금 출처

  // 프로젝트 내용
  objective: string; // 연구 목표
  description: string; // 상세 설명
  expectedOutcome: string; // 기대 효과
  keyTechnologies: string[]; // 핵심 기술

  // 진행 상황
  progress: number; // 진행률 (0-100)
  milestones: Milestone[];

  // 성과
  achievements?: Achievement[];
  patents?: Patent[];
  papers?: Paper[];

  // 메타 정보
  tags: string[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string; // 프로젝트 대표 이미지
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'prototype' | 'pilot' | 'commercialization' | 'technology-transfer' | 'other';
}

export interface Patent {
  id: number;
  title: string;
  applicationNumber: string;
  applicationDate: string;
  registrationNumber?: string;
  registrationDate?: string;
  status: 'applied' | 'registered' | 'rejected';
}

export interface Paper {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  publishedDate: string;
  doi?: string;
  url?: string;
}

// 초기 R&D 프로젝트 데이터
export const initialRDProjects: RDProject[] = [
  {
    id: 1,
    projectCode: 'RD-2024-001',
    projectName: 'AI 기반 스마트팜 자동화 시스템',
    category: 'ai',
    status: 'ongoing',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2025-12-31',
    leadResearcher: '김연구',
    teamMembers: ['박개발', '이기술', '최데이터'],
    partnerOrganizations: ['삼성전자 DS부문', 'KAIST 인공지능연구소'],
    totalBudget: 500000000,
    budgetUsed: 180000000,
    fundingSource: 'partnership',
    objective: '발달장애인도 쉽게 사용할 수 있는 AI 기반 스마트팜 자동화 시스템 개발',
    description: `본 프로젝트는 발달장애인 농업 근로자를 위한 맞춤형 AI 기반 스마트팜 자동화 시스템을 개발하는 것을 목표로 합니다.

주요 개발 내용:
- 음성 및 시각 인터페이스 기반 농업 작업 지원 시스템
- 작물 생육 상태 자동 모니터링 및 알림 시스템
- 간편한 환경 제어 인터페이스 (온도, 습도, 조명)
- 발달장애인 맞춤형 작업 가이드 및 교육 콘텐츠

기대 효과:
- 발달장애인 농업 생산성 30% 향상
- 작업 오류율 50% 감소
- 스마트팜 관리 인력 효율성 증대`,
    expectedOutcome: '발달장애인 고용 확대 및 생산성 향상, AI 기술 기반 스마트팜 모델 확립',
    keyTechnologies: ['딥러닝', '컴퓨터 비전', '자연어 처리', 'IoT', '사용자 경험 설계'],
    progress: 45,
    milestones: [
      {
        id: 1,
        title: '요구사항 분석 및 UI/UX 설계',
        description: '발달장애인 사용자 조사 및 인터페이스 설계',
        targetDate: '2024-03-31',
        completedDate: '2024-03-28',
        status: 'completed'
      },
      {
        id: 2,
        title: 'AI 모델 개발',
        description: '작물 인식 및 생육 상태 분석 AI 모델 개발',
        targetDate: '2024-08-31',
        completedDate: '2024-08-20',
        status: 'completed'
      },
      {
        id: 3,
        title: '시스템 통합 및 파일럿 테스트',
        description: '실제 농장에서 파일럿 테스트 진행',
        targetDate: '2024-12-31',
        status: 'in-progress'
      },
      {
        id: 4,
        title: '상용화 및 배포',
        description: '전국 농장으로 시스템 확대 배포',
        targetDate: '2025-06-30',
        status: 'pending'
      }
    ],
    achievements: [
      {
        id: 1,
        title: '음성 인터페이스 프로토타입 개발',
        description: '발달장애인 맞춤형 음성 명령 시스템 프로토타입 완성',
        date: '2024-05-15',
        type: 'prototype'
      },
      {
        id: 2,
        title: '파일럿 농장 테스트 시작',
        description: '경기도 2개 농장에서 파일럿 테스트 시작',
        date: '2024-09-01',
        type: 'pilot'
      }
    ],
    patents: [
      {
        id: 1,
        title: '발달장애인을 위한 스마트팜 인터페이스 시스템',
        applicationNumber: '10-2024-0012345',
        applicationDate: '2024-06-15',
        status: 'applied'
      }
    ],
    tags: ['AI', '스마트팜', '자동화', '발달장애인', '접근성'],
    createdAt: '2024-01-10',
    updatedAt: '2024-11-15',
    thumbnail: '/api/placeholder/800/600'
  },
  {
    id: 2,
    projectCode: 'RD-2024-002',
    projectName: '친환경 수경재배 시스템 고도화',
    category: 'sustainability',
    status: 'ongoing',
    priority: 'medium',
    startDate: '2024-03-01',
    endDate: '2025-08-31',
    leadResearcher: '박환경',
    teamMembers: ['정지속', '강가능'],
    totalBudget: 300000000,
    budgetUsed: 95000000,
    fundingSource: 'government',
    objective: '탄소 배출 저감 및 물 사용 효율성을 극대화한 친환경 수경재배 시스템 개발',
    description: `기존 수경재배 시스템의 환경 부담을 최소화하고 지속가능성을 높이는 연구

주요 연구 내용:
- 재생에너지 기반 스마트팜 운영 시스템
- 물 재순환 효율 95% 이상 달성
- 유기농 기반 친환경 양액 개발
- 탄소 배출량 모니터링 및 최적화`,
    expectedOutcome: '탄소 배출 60% 감소, 물 사용량 80% 절감',
    keyTechnologies: ['수경재배', '재생에너지', '물 순환 시스템', '친환경 농업'],
    progress: 32,
    milestones: [
      {
        id: 1,
        title: '기존 시스템 분석',
        description: '현재 수경재배 시스템의 환경 영향 분석',
        targetDate: '2024-04-30',
        completedDate: '2024-04-25',
        status: 'completed'
      },
      {
        id: 2,
        title: '친환경 양액 개발',
        description: '유기농 인증 가능한 친환경 양액 개발',
        targetDate: '2024-09-30',
        status: 'in-progress'
      },
      {
        id: 3,
        title: '시스템 통합 및 실증',
        description: '실제 농장 환경에서 실증 테스트',
        targetDate: '2025-03-31',
        status: 'pending'
      }
    ],
    tags: ['친환경', '지속가능성', '수경재배', 'ESG'],
    createdAt: '2024-02-20',
    updatedAt: '2024-11-10',
    thumbnail: '/api/placeholder/800/600'
  },
  {
    id: 3,
    projectCode: 'RD-2023-015',
    projectName: '스마트 센서 기반 병해충 조기 감지 시스템',
    category: 'iot',
    status: 'completed',
    priority: 'high',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    actualEndDate: '2024-05-28',
    leadResearcher: '이센서',
    teamMembers: ['김IoT', '박데이터'],
    partnerOrganizations: ['농촌진흥청'],
    totalBudget: 200000000,
    budgetUsed: 195000000,
    fundingSource: 'government',
    objective: 'IoT 센서와 AI를 활용한 병해충 조기 감지 및 예방 시스템 개발',
    description: `작물 병해충을 조기에 감지하고 예방하여 농약 사용을 최소화하는 스마트 시스템

주요 성과:
- 병해충 감지 정확도 92% 달성
- 농약 사용량 45% 감소
- 작물 손실률 30% 감소`,
    expectedOutcome: '농약 사용 최소화 및 작물 품질 향상',
    keyTechnologies: ['IoT 센서', '머신러닝', '이미지 인식', '빅데이터'],
    progress: 100,
    milestones: [
      {
        id: 1,
        title: '센서 개발 및 테스트',
        description: '병해충 감지용 IoT 센서 개발',
        targetDate: '2023-12-31',
        completedDate: '2023-12-20',
        status: 'completed'
      },
      {
        id: 2,
        title: 'AI 모델 개발',
        description: '병해충 이미지 인식 AI 모델 개발',
        targetDate: '2024-02-29',
        completedDate: '2024-02-25',
        status: 'completed'
      },
      {
        id: 3,
        title: '실증 및 상용화',
        description: '전국 농장 배포 및 성과 검증',
        targetDate: '2024-05-31',
        completedDate: '2024-05-28',
        status: 'completed'
      }
    ],
    achievements: [
      {
        id: 1,
        title: '시스템 상용화',
        description: '전국 8개 농장에 시스템 설치 완료',
        date: '2024-05-28',
        type: 'commercialization'
      }
    ],
    patents: [
      {
        id: 1,
        title: 'IoT 기반 병해충 조기 감지 시스템',
        applicationNumber: '10-2023-0045678',
        applicationDate: '2023-11-20',
        registrationNumber: '10-2024-0012345',
        registrationDate: '2024-04-10',
        status: 'registered'
      }
    ],
    papers: [
      {
        id: 1,
        title: 'AI-based Pest Detection System for Smart Farms',
        authors: ['이센서', '김IoT', '박데이터'],
        journal: 'Journal of Agricultural Technology',
        publishedDate: '2024-06-15',
        doi: '10.1234/jat.2024.001'
      }
    ],
    tags: ['IoT', '병해충', '센서', 'AI', '상용화'],
    createdAt: '2023-05-15',
    updatedAt: '2024-06-01',
    thumbnail: '/api/placeholder/800/600'
  }
];

// 로컬 스토리지 키
const STORAGE_KEY = 'nuri_rd_projects';

// R&D 프로젝트 가져오기
export const getRDProjects = (): RDProject[] => {
  if (typeof window === 'undefined') return initialRDProjects;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse R&D projects from localStorage', e);
    }
  }

  // 초기 데이터 저장
  saveRDProjects(initialRDProjects);
  return initialRDProjects;
};

// R&D 프로젝트 저장
export const saveRDProjects = (projects: RDProject[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

// R&D 프로젝트 추가
export const addRDProject = (project: Omit<RDProject, 'id' | 'createdAt' | 'updatedAt'>): RDProject => {
  const projects = getRDProjects();
  const now = new Date().toISOString();
  const newProject: RDProject = {
    ...project,
    id: Math.max(...projects.map(p => p.id), 0) + 1,
    createdAt: now,
    updatedAt: now
  };
  saveRDProjects([newProject, ...projects]);
  return newProject;
};

// R&D 프로젝트 수정
export const updateRDProject = (id: number, updates: Partial<RDProject>): boolean => {
  const projects = getRDProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return false;

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveRDProjects(projects);
  return true;
};

// R&D 프로젝트 삭제
export const deleteRDProject = (id: number): boolean => {
  const projects = getRDProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;

  saveRDProjects(filtered);
  return true;
};

// R&D 프로젝트 하나 가져오기
export const getRDProject = (id: number): RDProject | undefined => {
  const projects = getRDProjects();
  return projects.find(p => p.id === id);
};

// 통계 정보 가져오기
export const getRDProjectStats = () => {
  const projects = getRDProjects();

  const total = projects.length;
  const ongoing = projects.filter(p => p.status === 'ongoing').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const planning = projects.filter(p => p.status === 'planning').length;

  const totalBudget = projects.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalBudgetUsed = projects.reduce((sum, p) => sum + p.budgetUsed, 0);

  const totalPatents = projects.reduce((sum, p) => sum + (p.patents?.length || 0), 0);
  const registeredPatents = projects.reduce((sum, p) =>
    sum + (p.patents?.filter(pat => pat.status === 'registered').length || 0), 0);

  const totalPapers = projects.reduce((sum, p) => sum + (p.papers?.length || 0), 0);

  return {
    total,
    ongoing,
    completed,
    planning,
    totalBudget,
    totalBudgetUsed,
    budgetUsageRate: totalBudget > 0 ? (totalBudgetUsed / totalBudget) * 100 : 0,
    totalPatents,
    registeredPatents,
    totalPapers
  };
};

// 카테고리별 통계
export const getRDProjectsByCategory = () => {
  const projects = getRDProjects();
  const categories = ['smartfarm', 'automation', 'ai', 'iot', 'biotech', 'sustainability', 'other'] as const;

  return categories.map(category => ({
    category,
    count: projects.filter(p => p.category === category).length,
    ongoing: projects.filter(p => p.category === category && p.status === 'ongoing').length
  }));
};
