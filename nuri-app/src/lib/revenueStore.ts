export interface RevenueItem {
  id: number;
  workplaceId: number; // 사업장 ID
  workplaceCode: string; // 사업장 코드
  workplaceName: string; // 사업장 이름
  year: string; // 연도
  month: string; // 월
  type: 'income' | 'expense'; // 수입/지출
  category: string; // 계정과목
  amount: number; // 금액
  description?: string; // 설명
  date: string; // 거래일자
}

// 계정과목 정의
export const incomeCategories = [
  { id: 'sales', label: '매출' },
  { id: 'service', label: '용역수입' },
  { id: 'subsidy', label: '보조금' },
  { id: 'investment', label: '투자수익' },
  { id: 'other_income', label: '기타수입' },
];

export const expenseCategories = [
  { id: 'salary', label: '인건비' },
  { id: 'material', label: '재료비' },
  { id: 'utility', label: '공과금' },
  { id: 'rent', label: '임대료' },
  { id: 'equipment', label: '장비구매' },
  { id: 'maintenance', label: '유지보수비' },
  { id: 'marketing', label: '마케팅비' },
  { id: 'other_expense', label: '기타지출' },
];

// 초기 수익 데이터
export const initialRevenues: RevenueItem[] = [
  // 2024년 수익 데이터
  // Platform Solutions (매출)
  {
    id: 1,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '01',
    type: 'income',
    category: 'sales',
    amount: 180000000,
    description: '스마트팜 플랫폼 매출',
    date: '2024-01-31'
  },
  {
    id: 2,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '02',
    type: 'income',
    category: 'sales',
    amount: 175000000,
    description: '스마트팜 플랫폼 매출',
    date: '2024-02-29'
  },
  {
    id: 3,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '03',
    type: 'income',
    category: 'sales',
    amount: 190000000,
    description: '스마트팜 플랫폼 매출',
    date: '2024-03-31'
  },

  // Services (용역수입)
  {
    id: 4,
    workplaceId: 2,
    workplaceCode: 'KR002NURIFARM002',
    workplaceName: 'NURI 파주 팜',
    year: '2024',
    month: '01',
    type: 'income',
    category: 'service',
    amount: 85000000,
    description: '장애인 고용 및 교육 서비스',
    date: '2024-01-31'
  },
  {
    id: 5,
    workplaceId: 2,
    workplaceCode: 'KR002NURIFARM002',
    workplaceName: 'NURI 파주 팜',
    year: '2024',
    month: '02',
    type: 'income',
    category: 'service',
    amount: 90000000,
    description: '장애인 고용 및 교육 서비스',
    date: '2024-02-29'
  },
  {
    id: 6,
    workplaceId: 2,
    workplaceCode: 'KR002NURIFARM002',
    workplaceName: 'NURI 파주 팜',
    year: '2024',
    month: '03',
    type: 'income',
    category: 'service',
    amount: 88000000,
    description: '장애인 고용 및 교육 서비스',
    date: '2024-03-31'
  },

  // Programs (보조금)
  {
    id: 7,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '01',
    type: 'income',
    category: 'subsidy',
    amount: 120000000,
    description: '정부 R&D 보조금 및 고용 지원금',
    date: '2024-01-15'
  },
  {
    id: 8,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '02',
    type: 'income',
    category: 'subsidy',
    amount: 125000000,
    description: '정부 R&D 보조금 및 고용 지원금',
    date: '2024-02-15'
  },
  {
    id: 9,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '03',
    type: 'income',
    category: 'subsidy',
    amount: 130000000,
    description: '정부 R&D 보조금 및 고용 지원금',
    date: '2024-03-15'
  },

  // Product Sales (기타수입 - 농산물 직판)
  {
    id: 10,
    workplaceId: 3,
    workplaceCode: 'VN001NURIFARM001',
    workplaceName: 'NURI 호치민 팜',
    year: '2024',
    month: '01',
    type: 'income',
    category: 'other_income',
    amount: 45000000,
    description: '농산물 직판 매출',
    date: '2024-01-31'
  },
  {
    id: 11,
    workplaceId: 3,
    workplaceCode: 'VN001NURIFARM001',
    workplaceName: 'NURI 호치민 팜',
    year: '2024',
    month: '02',
    type: 'income',
    category: 'other_income',
    amount: 48000000,
    description: '농산물 직판 매출',
    date: '2024-02-29'
  },
  {
    id: 12,
    workplaceId: 3,
    workplaceCode: 'VN001NURIFARM001',
    workplaceName: 'NURI 호치민 팜',
    year: '2024',
    month: '03',
    type: 'income',
    category: 'other_income',
    amount: 50000000,
    description: '농산물 직판 매출',
    date: '2024-03-31'
  },

  // 지출 데이터
  {
    id: 13,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '01',
    type: 'expense',
    category: 'salary',
    amount: 95000000,
    description: '인건비',
    date: '2024-01-25'
  },
  {
    id: 14,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '01',
    type: 'expense',
    category: 'utility',
    amount: 18000000,
    description: '전기/수도/가스',
    date: '2024-01-20'
  },
  {
    id: 15,
    workplaceId: 1,
    workplaceCode: 'KR001NURIFARM001',
    workplaceName: 'NURI 여주 스마트팜',
    year: '2024',
    month: '01',
    type: 'expense',
    category: 'material',
    amount: 35000000,
    description: '농자재 및 원재료',
    date: '2024-01-15'
  },
];

// 로컬 스토리지 키
const STORAGE_KEY = 'nuri_revenues';

// 수익 데이터 가져오기
export const getRevenues = (): RevenueItem[] => {
  if (typeof window === 'undefined') return initialRevenues;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse revenues from localStorage', e);
    }
  }

  // 초기 데이터 저장
  saveRevenues(initialRevenues);
  return initialRevenues;
};

// 수익 데이터 저장
export const saveRevenues = (items: RevenueItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// 수익 추가
export const addRevenue = (item: Omit<RevenueItem, 'id'>): RevenueItem => {
  const revenues = getRevenues();
  const newItem: RevenueItem = {
    ...item,
    id: Math.max(...revenues.map(i => i.id), 0) + 1
  };
  saveRevenues([...revenues, newItem]);
  return newItem;
};

// 수익 수정
export const updateRevenue = (id: number, updates: Partial<RevenueItem>): boolean => {
  const revenues = getRevenues();
  const index = revenues.findIndex(item => item.id === id);
  if (index === -1) return false;

  revenues[index] = { ...revenues[index], ...updates };
  saveRevenues(revenues);
  return true;
};

// 수익 삭제
export const deleteRevenue = (id: number): boolean => {
  const revenues = getRevenues();
  const filtered = revenues.filter(item => item.id !== id);
  if (filtered.length === revenues.length) return false;

  saveRevenues(filtered);
  return true;
};

// 수익 하나 가져오기
export const getRevenue = (id: number): RevenueItem | undefined => {
  const revenues = getRevenues();
  return revenues.find(item => item.id === id);
};

// 사업장별 수익 가져오기
export const getRevenuesByWorkplace = (workplaceId: number): RevenueItem[] => {
  const revenues = getRevenues();
  return revenues.filter(item => item.workplaceId === workplaceId);
};

// 사업장별 월별 수익 통계
export const getRevenueStatsByWorkplace = (workplaceId: number, year?: string, month?: string) => {
  const revenues = getRevenues().filter(item => {
    let matches = item.workplaceId === workplaceId;
    if (year) matches = matches && item.year === year;
    if (month) matches = matches && item.month === month;
    return matches;
  });

  const totalIncome = revenues
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = revenues
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const profit = totalIncome - totalExpense;

  // 카테고리별 집계
  const incomeByCategory = revenues
    .filter(r => r.type === 'income')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseByCategory = revenues
    .filter(r => r.type === 'expense')
    .reduce((acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.amount;
      return acc;
    }, {} as Record<string, number>);

  return {
    totalIncome,
    totalExpense,
    profit,
    incomeByCategory,
    expenseByCategory,
    count: revenues.length
  };
};

// 전체 수익 통계
export const getOverallRevenueStats = (year?: string, month?: string) => {
  const revenues = getRevenues().filter(item => {
    let matches = true;
    if (year) matches = matches && item.year === year;
    if (month) matches = matches && item.month === month;
    return matches;
  });

  const totalIncome = revenues
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = revenues
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const profit = totalIncome - totalExpense;

  // 사업장별 집계
  const byWorkplace = revenues.reduce((acc, r) => {
    if (!acc[r.workplaceId]) {
      acc[r.workplaceId] = {
        workplaceId: r.workplaceId,
        workplaceCode: r.workplaceCode,
        workplaceName: r.workplaceName,
        income: 0,
        expense: 0,
        profit: 0
      };
    }

    if (r.type === 'income') {
      acc[r.workplaceId].income += r.amount;
    } else {
      acc[r.workplaceId].expense += r.amount;
    }
    acc[r.workplaceId].profit = acc[r.workplaceId].income - acc[r.workplaceId].expense;

    return acc;
  }, {} as Record<number, any>);

  return {
    totalIncome,
    totalExpense,
    profit,
    byWorkplace: Object.values(byWorkplace),
    count: revenues.length
  };
};

// 계정과목 레이블 가져오기
export const getCategoryLabel = (category: string, type: 'income' | 'expense'): string => {
  const categories = type === 'income' ? incomeCategories : expenseCategories;
  return categories.find(c => c.id === category)?.label || category;
};

// Sankey 다이어그램 데이터 생성
export interface SankeyNode {
  id: string;
  nodeColor?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  startColor?: string;
  endColor?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// 계정과목 기반 단순 흐름 차트 데이터 생성
export const generateSimpleRevenueFlowData = (year?: string): SankeyData => {
  const allRevenues = getRevenues();
  const filtered = allRevenues.filter(item => {
    if (year && year !== 'all') {
      return item.year === year;
    }
    return true;
  });

  console.log('=== Simple Revenue Flow Data Generation ===');
  console.log('Year filter:', year);
  console.log('Total transactions:', filtered.length);

  // 개별 거래 항목별로 노드 생성
  const incomeItems: Record<string, number> = {};
  const expenseItems: Record<string, number> = {};

  filtered.forEach(item => {
    const category = getCategoryLabel(item.category, item.type);
    const desc = item.description || '';

    // 고유한 레이블 생성: "계정과목(설명)"
    let label = category;
    if (desc) {
      // 설명이 너무 길면 축약
      const shortDesc = desc.length > 15 ? desc.substring(0, 15) + '...' : desc;
      label = `${category}(${shortDesc})`;
    }

    if (item.type === 'income') {
      incomeItems[label] = (incomeItems[label] || 0) + item.amount;
    } else {
      expenseItems[label] = (expenseItems[label] || 0) + item.amount;
    }
  });

  const totalIncome = Object.values(incomeItems).reduce((sum, val) => sum + val, 0);
  const totalExpense = Object.values(expenseItems).reduce((sum, val) => sum + val, 0);
  const profit = totalIncome - totalExpense;

  console.log('Income items:', incomeItems);
  console.log('Expense items:', expenseItems);
  console.log('Total income:', totalIncome, 'Total expense:', totalExpense, 'Profit:', profit);

  if (totalIncome === 0 && totalExpense === 0) {
    return { nodes: [], links: [] };
  }

  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];

  // 수입 항목 노드
  Object.keys(incomeItems).forEach(item => {
    nodes.push({ id: item, nodeColor: '#93c5fd' });
  });

  // 지출 항목 노드
  Object.keys(expenseItems).forEach(item => {
    nodes.push({ id: item, nodeColor: '#fca5a5' });
  });

  // 당기순익 노드
  nodes.push({ id: '당기순익', nodeColor: profit >= 0 ? '#4ade80' : '#ef4444' });

  // 수입 → 지출 (비례 분배)
  if (totalExpense > 0) {
    Object.entries(incomeItems).forEach(([incomeLabel, incomeAmount]) => {
      Object.entries(expenseItems).forEach(([expenseLabel, expenseAmount]) => {
        // 각 수입 항목에서 지출 항목으로 비례 분배
        const portion = (incomeAmount * expenseAmount) / (totalIncome * totalExpense) * totalExpense;
        if (portion > 0.001) { // 너무 작은 값은 제외
          links.push({
            source: incomeLabel,
            target: expenseLabel,
            value: portion / 1000000
          });
        }
      });
    });
  }

  // 수입 → 당기순익 (남은 금액)
  Object.entries(incomeItems).forEach(([incomeLabel, incomeAmount]) => {
    const expenseRatio = totalExpense / totalIncome;
    const remainingAmount = incomeAmount * (1 - expenseRatio);
    if (remainingAmount > 0.001) {
      links.push({
        source: incomeLabel,
        target: '당기순익',
        value: remainingAmount / 1000000
      });
    }
  });

  // 지출 → 당기순익
  Object.entries(expenseItems).forEach(([expenseLabel, expenseAmount]) => {
    links.push({
      source: expenseLabel,
      target: '당기순익',
      value: expenseAmount / 1000000
    });
  });

  return { nodes, links };
};

// 설명 필드에서 고객 세그먼트 자동 추론
export const inferCustomerSegment = (description?: string, category?: string): string => {
  if (!description) return 'unknown';

  const desc = description.toLowerCase();

  // 키워드 기반 분류
  const patterns = {
    '대기업': ['대기업', '100인 이상', '삼성', 'sk', 'lg', '현대', '롯데', '대기업체'],
    '중소기업': ['중소기업', 'sme', '중기업', '소기업', '스타트업', '벤처'],
    '정부/공공': ['정부', '공공', '지자체', '시청', '구청', '도청', '충청', '경기', '서울', '부산', '국가', '행정', '공무원'],
    'NGO/비영리': ['ngo', '비영리', '재단', '사회적기업', '협동조합', '복지', '자선']
  };

  for (const [segment, keywords] of Object.entries(patterns)) {
    if (keywords.some(keyword => desc.includes(keyword))) {
      return segment;
    }
  }

  // 카테고리 기반 기본 추론
  if (category === 'subsidy') return '정부/공공';
  if (category === 'service') return '중소기업';
  if (category === 'sales') return '중소기업';

  return 'unknown';
};

// 비즈니스 인사이트 차트 데이터 생성 (자동 매핑 적용)
export const generateRevenueFlowData = (year?: string): SankeyData => {
  const allRevenues = getRevenues();
  const revenues = allRevenues.filter(item => {
    let matches = item.type === 'income'; // 수입만 필터링
    if (year && year !== 'all') {
      matches = matches && item.year === year;
    }
    return matches;
  });

  console.log('=== Revenue Flow Data Generation ===');
  console.log('Year filter:', year);
  console.log('Total revenues in DB:', allRevenues.length);
  console.log('Filtered income revenues:', revenues.length);
  console.log('Revenue data:', revenues);

  // 실제 수익 데이터 집계
  const platformRevenue = revenues
    .filter(r => r.category === 'sales')
    .reduce((sum, r) => sum + r.amount, 0);

  const serviceRevenue = revenues
    .filter(r => r.category === 'service' || r.category === 'other_income' || r.category === 'investment')
    .reduce((sum, r) => sum + r.amount, 0);

  const subsidyRevenue = revenues
    .filter(r => r.category === 'subsidy')
    .reduce((sum, r) => sum + r.amount, 0);

  // 전체 수익 계산
  const totalRevenue = platformRevenue + serviceRevenue + subsidyRevenue;

  console.log('Revenue breakdown:');
  console.log('  Platform (sales):', platformRevenue, '원');
  console.log('  Service (service + other_income + investment):', serviceRevenue, '원');
  console.log('  Subsidy:', subsidyRevenue, '원');
  console.log('  TOTAL:', totalRevenue, '원');
  console.log('  TOTAL (M):', totalRevenue / 1000000, 'M원');

  // 수익이 없으면 빈 데이터 반환
  if (totalRevenue === 0) {
    console.log('No revenue data found, returning empty chart');
    return { nodes: [], links: [] };
  }

  // Step 2: 수익 카테고리별 분배 (실제 데이터 기반)
  const techRevenue = platformRevenue * 0.5; // Platform 매출의 50%는 기술 수익
  const productRevenue = platformRevenue * 0.5; // Platform 매출의 50%는 제품 수익

  // Step 3: 고객 세그먼트별 분배 (자동 추론 적용)
  const segmentRevenue: Record<string, number> = {
    '대기업': 0,
    '중소기업': 0,
    '정부/공공': 0,
    'NGO/비영리': 0
  };

  // 각 수익 항목에서 고객 세그먼트 추론
  revenues.forEach(item => {
    const segment = inferCustomerSegment(item.description, item.category);
    if (segment !== 'unknown' && segmentRevenue[segment] !== undefined) {
      segmentRevenue[segment] += item.amount;
    } else {
      // 알 수 없는 경우 카테고리 기반 기본 분배
      if (item.category === 'subsidy') {
        segmentRevenue['정부/공공'] += item.amount;
      } else if (item.category === 'sales') {
        segmentRevenue['중소기업'] += item.amount * 0.7;
        segmentRevenue['대기업'] += item.amount * 0.3;
      } else {
        segmentRevenue['중소기업'] += item.amount * 0.5;
        segmentRevenue['정부/공공'] += item.amount * 0.3;
        segmentRevenue['NGO/비영리'] += item.amount * 0.2;
      }
    }
  });

  console.log('Customer Segment Distribution:', segmentRevenue);

  const b2bEnterpriseRevenue = segmentRevenue['대기업'];
  const b2bSMBRevenue = segmentRevenue['중소기업'];
  const governmentRevenue = segmentRevenue['정부/공공'];
  const ngoRevenue = segmentRevenue['NGO/비영리'];

  const nodes: SankeyNode[] = [
    // Revenue Sources
    { id: '플랫폼', nodeColor: '#93c5fd' },
    { id: '서비스', nodeColor: '#c4b5fd' },
    { id: '프로그램', nodeColor: '#fca5a5' },

    // Revenue Categories
    { id: '기술수익', nodeColor: '#a78bfa' },
    { id: '서비스수익', nodeColor: '#f0abfc' },
    { id: '제품수익', nodeColor: '#cbd5e1' },

    // Customer Segments
    { id: '대기업', nodeColor: '#bbf7d0' },
    { id: '중소기업', nodeColor: '#99f6e4' },
    { id: '정부/공공', nodeColor: '#bfdbfe' },
    { id: 'NGO/비영리', nodeColor: '#fde047' },

    // Total Revenue
    { id: '총수익', nodeColor: '#86efac' }
  ];

  const links: SankeyLink[] = [];

  // Revenue Sources -> Revenue Categories
  if (techRevenue > 0) {
    links.push({
      source: '플랫폼',
      target: '기술수익',
      value: techRevenue / 1000000 // Convert to millions
    });
  }

  if (productRevenue > 0) {
    links.push({
      source: '플랫폼',
      target: '제품수익',
      value: productRevenue / 1000000
    });
  }

  if (serviceRevenue > 0) {
    links.push({
      source: '서비스',
      target: '서비스수익',
      value: serviceRevenue / 1000000
    });
  }

  if (subsidyRevenue > 0) {
    links.push({
      source: '프로그램',
      target: '서비스수익',
      value: subsidyRevenue / 1000000
    });
  }

  // Revenue Categories -> Customer Segments (간단한 비례 분배)
  // 각 수익 카테고리(기술/서비스/제품)에서 고객 세그먼트로 흐름
  const totalRevenueAmount = b2bEnterpriseRevenue + b2bSMBRevenue + governmentRevenue + ngoRevenue;
  const totalCategoryRevenue = techRevenue + serviceRevenue + productRevenue;

  if (totalRevenueAmount > 0 && totalCategoryRevenue > 0) {
    // 각 고객 세그먼트의 비율 계산
    const enterpriseRatio = b2bEnterpriseRevenue / totalRevenueAmount;
    const smbRatio = b2bSMBRevenue / totalRevenueAmount;
    const govRatio = governmentRevenue / totalRevenueAmount;
    const ngoRatio = ngoRevenue / totalRevenueAmount;

    // 기술수익 분배
    if (techRevenue > 0) {
      if (enterpriseRatio > 0) {
        links.push({
          source: '기술수익',
          target: '대기업',
          value: (techRevenue * enterpriseRatio * 0.4) / 1000000
        });
      }
      if (smbRatio > 0) {
        links.push({
          source: '기술수익',
          target: '중소기업',
          value: (techRevenue * smbRatio * 0.5) / 1000000
        });
      }
      if (ngoRatio > 0) {
        links.push({
          source: '기술수익',
          target: 'NGO/비영리',
          value: (techRevenue * ngoRatio * 0.1) / 1000000
        });
      }
    }

    // 서비스수익 분배
    if (serviceRevenue > 0) {
      if (enterpriseRatio > 0) {
        links.push({
          source: '서비스수익',
          target: '대기업',
          value: (serviceRevenue * enterpriseRatio * 0.2) / 1000000
        });
      }
      if (smbRatio > 0) {
        links.push({
          source: '서비스수익',
          target: '중소기업',
          value: (serviceRevenue * smbRatio * 0.3) / 1000000
        });
      }
      if (govRatio > 0) {
        links.push({
          source: '서비스수익',
          target: '정부/공공',
          value: (serviceRevenue * govRatio * 0.4) / 1000000
        });
      }
      if (ngoRatio > 0) {
        links.push({
          source: '서비스수익',
          target: 'NGO/비영리',
          value: (serviceRevenue * ngoRatio * 0.1) / 1000000
        });
      }
    }

    // 제품수익 분배
    if (productRevenue > 0) {
      if (enterpriseRatio > 0) {
        links.push({
          source: '제품수익',
          target: '대기업',
          value: (productRevenue * enterpriseRatio * 0.2) / 1000000
        });
      }
      if (smbRatio > 0) {
        links.push({
          source: '제품수익',
          target: '중소기업',
          value: (productRevenue * smbRatio * 0.5) / 1000000
        });
      }
      if (govRatio > 0) {
        links.push({
          source: '제품수익',
          target: '정부/공공',
          value: (productRevenue * govRatio * 0.2) / 1000000
        });
      }
      if (ngoRatio > 0) {
        links.push({
          source: '제품수익',
          target: 'NGO/비영리',
          value: (productRevenue * ngoRatio * 0.1) / 1000000
        });
      }
    }
  }

  // Customer Segments -> Total Revenue
  if (b2bEnterpriseRevenue > 0) {
    links.push({
      source: '대기업',
      target: '총수익',
      value: b2bEnterpriseRevenue / 1000000
    });
  }

  if (b2bSMBRevenue > 0) {
    links.push({
      source: '중소기업',
      target: '총수익',
      value: b2bSMBRevenue / 1000000
    });
  }

  if (governmentRevenue > 0) {
    links.push({
      source: '정부/공공',
      target: '총수익',
      value: governmentRevenue / 1000000
    });
  }

  if (ngoRevenue > 0) {
    links.push({
      source: 'NGO/비영리',
      target: '총수익',
      value: ngoRevenue / 1000000
    });
  }

  return { nodes, links };
};
