export interface JourneyItem {
  id: number;
  year: string;
  month?: string;
  title: string;
  description: string;
  category?: 'foundation' | 'expansion' | 'achievement' | 'investment' | 'partnership';
  highlight?: boolean;
  upcoming?: boolean; // 예정일정 여부
  order: number; // 정렬 순서
}

// 초기 Journey 데이터
export const initialJourneyItems: JourneyItem[] = [
  {
    id: 1,
    year: '2019',
    month: '03',
    title: 'NURI 설립',
    description: '발달장애인과 함께하는 사회적 기업으로 첫 발걸음',
    category: 'foundation',
    highlight: true,
    order: 1
  },
  {
    id: 2,
    year: '2020',
    month: '06',
    title: '첫 스마트팜 구축',
    description: '경기도 여주에 첫 번째 스마트팜 구축, 발달장애인 10명 고용 시작',
    category: 'expansion',
    order: 2
  },
  {
    id: 3,
    year: '2021',
    month: '04',
    title: 'SaaS 플랫폼 출시',
    description: 'AI 기반 농업 데이터 분석 플랫폼 서비스 시작',
    category: 'achievement',
    order: 3
  },
  {
    id: 4,
    year: '2021',
    month: '11',
    title: '사회적기업 인증',
    description: '고용노동부 사회적기업 인증 획득',
    category: 'achievement',
    highlight: true,
    order: 4
  },
  {
    id: 5,
    year: '2022',
    month: '03',
    title: '시리즈 A 투자 유치',
    description: '100억원 규모 시리즈 A 투자 유치 성공',
    category: 'investment',
    highlight: true,
    order: 5
  },
  {
    id: 6,
    year: '2022',
    month: '08',
    title: '대학 MOU 체결',
    description: '서울대, 한국농수산대학과 교육 협력 MOU 체결',
    category: 'partnership',
    order: 6
  },
  {
    id: 7,
    year: '2023',
    month: '02',
    title: 'B Corp 인증',
    description: '국내 농업 기업 최초 B Corporation 인증 획득',
    category: 'achievement',
    highlight: true,
    order: 7
  },
  {
    id: 8,
    year: '2023',
    month: '06',
    title: '해외 진출 시작',
    description: '베트남 호치민에 첫 해외 스마트팜 구축',
    category: 'expansion',
    order: 8
  },
  {
    id: 9,
    year: '2023',
    month: '12',
    title: '누적 고용 100명 돌파',
    description: '발달장애인 누적 고용 100명 달성',
    category: 'achievement',
    highlight: true,
    order: 9
  },
  {
    id: 10,
    year: '2024',
    month: '03',
    title: '미국 법인 설립',
    description: '북미 시장 진출을 위한 캘리포니아 법인 설립',
    category: 'expansion',
    order: 10
  },
  {
    id: 11,
    year: '2024',
    month: '09',
    title: 'ESG 경영대상 수상',
    description: '대한민국 ESG 경영대상 사회적가치 부문 대상',
    category: 'achievement',
    order: 11
  },
  {
    id: 12,
    year: '2024',
    month: '11',
    title: '시리즈 B 투자 유치',
    description: '150억원 규모 시리즈 B 투자 유치, 글로벌 확장 가속화',
    category: 'investment',
    highlight: true,
    order: 12
  },
  {
    id: 13,
    year: '2025',
    month: '03',
    title: '유럽 시장 진출 계획',
    description: '독일 및 네덜란드 지역 스마트팜 설립 예정',
    category: 'expansion',
    upcoming: true,
    order: 13
  },
  {
    id: 14,
    year: '2025',
    month: '06',
    title: '신기술 개발 완료 예정',
    description: 'AI 기반 자동화 시스템 ver 2.0 출시 예정',
    category: 'achievement',
    upcoming: true,
    order: 14
  }
];

// 로컬 스토리지 키
const STORAGE_KEY = 'nuri_journey_items';

// Journey 아이템 가져오기
export const getJourneyItems = (): JourneyItem[] => {
  if (typeof window === 'undefined') return initialJourneyItems;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const items = JSON.parse(stored);
      // order 기준으로 정렬
      return items.sort((a: JourneyItem, b: JourneyItem) => a.order - b.order);
    } catch (e) {
      console.error('Failed to parse journey items from localStorage', e);
    }
  }

  // 초기 데이터 저장
  saveJourneyItems(initialJourneyItems);
  return initialJourneyItems;
};

// Journey 아이템 저장
export const saveJourneyItems = (items: JourneyItem[]): void => {
  if (typeof window === 'undefined') return;
  // order 기준으로 정렬 후 저장
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedItems));
};

// Journey 아이템 추가
export const addJourneyItem = (item: Omit<JourneyItem, 'id'>): JourneyItem => {
  const items = getJourneyItems();
  const newItem: JourneyItem = {
    ...item,
    id: Math.max(...items.map(i => i.id), 0) + 1,
    order: item.order || (Math.max(...items.map(i => i.order), 0) + 1)
  };
  saveJourneyItems([...items, newItem]);
  return newItem;
};

// Journey 아이템 수정
export const updateJourneyItem = (id: number, updates: Partial<JourneyItem>): boolean => {
  const items = getJourneyItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  saveJourneyItems(items);
  return true;
};

// Journey 아이템 삭제
export const deleteJourneyItem = (id: number): boolean => {
  const items = getJourneyItems();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  // 순서 재정렬
  filtered.forEach((item, index) => {
    item.order = index + 1;
  });

  saveJourneyItems(filtered);
  return true;
};

// Journey 아이템 하나 가져오기
export const getJourneyItem = (id: number): JourneyItem | undefined => {
  const items = getJourneyItems();
  return items.find(item => item.id === id);
};

// Journey 아이템 순서 변경
export const reorderJourneyItems = (items: JourneyItem[]): void => {
  // 순서 재정렬
  const reordered = items.map((item, index) => ({
    ...item,
    order: index + 1
  }));
  saveJourneyItems(reordered);
};

// 사업장 코드로 Journey 아이템 찾기
export const findJourneyByWorkplaceCode = (code: string): JourneyItem | undefined => {
  const items = getJourneyItems();
  return items.find(item => item.description.includes(code));
};

// 사업장 설립일 기반 Journey 아이템 추가 또는 업데이트
export const syncWorkplaceToJourney = (workplace: {
  code: string;
  name: string;
  establishedDate?: string;
  type: string;
  country: string;
}): void => {
  if (!workplace.establishedDate) return;

  const items = getJourneyItems();
  const date = new Date(workplace.establishedDate);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  // 타입별 설명
  const typeLabels: Record<string, string> = {
    farm: '스마트팜',
    office: '사무실',
    research: '연구소',
    training: '교육센터'
  };

  const title = `${workplace.name} 설립`;
  const description = `${workplace.name} (${workplace.code}) ${typeLabels[workplace.type] || ''} 설립`;

  // 기존 항목이 있는지 확인 (사업장 코드로 검색)
  const existingIndex = items.findIndex(item => item.description.includes(workplace.code));

  if (existingIndex !== -1) {
    // 기존 항목 업데이트
    items[existingIndex] = {
      ...items[existingIndex],
      year,
      month,
      title,
      description,
      category: 'expansion'
    };
    saveJourneyItems(items);
  } else {
    // 새 항목 추가
    const newItem: JourneyItem = {
      id: Math.max(...items.map(i => i.id), 0) + 1,
      year,
      month,
      title,
      description,
      category: 'expansion',
      highlight: false,
      order: Math.max(...items.map(i => i.order), 0) + 1
    };
    saveJourneyItems([...items, newItem]);
  }
};

// 사업장 삭제 시 관련 Journey 아이템도 삭제
export const removeWorkplaceFromJourney = (code: string): void => {
  const items = getJourneyItems();
  const filtered = items.filter(item => !item.description.includes(code));

  if (filtered.length !== items.length) {
    // 순서 재정렬
    filtered.forEach((item, index) => {
      item.order = index + 1;
    });
    saveJourneyItems(filtered);
  }
};