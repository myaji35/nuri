export interface NewsItem {
  id: number;
  category: 'investment' | 'global' | 'award' | 'partnership' | 'media';
  type: 'major' | 'news' | 'achievement';
  date: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  tags: string[];
  link?: string;
  source?: string;
  highlight?: boolean;
}

// 초기 뉴스 데이터 (실제 뉴스 포함)
export const initialNewsItems: NewsItem[] = [
  {
    id: 1,
    category: 'media',
    type: 'major',
    date: '2024.11.15',
    title: '㈜누리, 스타트업 월드컵 결승 진출… "장애인과 지구를 위한 도전"',
    description: '세계적인 스타트업 경진대회 \'스타트업 월드컵\'의 국내 예선에서 ㈜누리가 결승 진출에 성공했다. 발달장애인 일자리 창출과 친환경 농업을 결합한 비즈니스 모델이 높은 평가를 받았다.',
    content: `㈜누리가 지난 14일 서울 강남구에서 열린 '2024 스타트업 월드컵' 한국 예선에서 최종 결승 진출에 성공했다고 밝혔다.

스타트업 월드컵은 전 세계 70여 개국에서 예선을 거쳐 선발된 스타트업들이 실리콘밸리에서 경쟁하는 글로벌 피칭 대회다. 우승 기업에게는 100만 달러(약 13억원)의 투자금이 제공된다.

㈜누리는 발달장애인을 전문 농업인으로 양성하고 스마트팜 기술을 활용해 지속가능한 농업 생태계를 구축하는 소셜벤처다. 현재 전국 12개 농장에서 156명의 발달장애인을 고용하고 있으며, 연매출 21억원을 달성했다.

이번 대회에서 ㈜누리는 'Tech for Good(선한 기술)' 부문에 출전해 AI 기반 자동화 시스템과 발달장애인 맞춤형 인터페이스 기술을 선보였다. 특히 장애인 고용률 85%, 탄소 배출 40% 감소 등의 성과가 심사위원들의 주목을 받았다.`,
    image: '/api/placeholder/800/600',
    tags: ['스타트업월드컵', '소셜벤처', '발달장애인고용', 'ESG'],
    link: 'http://www.humanaidpost.com/news/articleView.html?idxno=27398',
    source: '휴먼에이드포스트',
    highlight: true
  },
  {
    id: 2,
    category: 'award',
    type: 'achievement',
    date: '2024.11.14',
    title: '농업회사법인 주식회사 누리, 경기도 일자리우수기업 선정',
    description: '경기도가 주관한 2024년 일자리우수기업 인증에서 농업회사법인 주식회사 누리가 장애인 고용 우수기업으로 선정되어 인증패와 인증서를 수여받았다.',
    content: `경기도는 14일 경기도청 북부청사에서 '2024년 경기도 일자리우수기업 인증서 수여식'을 개최했다고 밝혔다.

농업회사법인 주식회사 누리는 발달장애인을 농업 전문 인력으로 양성하는 사회적 기업으로, 전체 직원의 85% 이상을 장애인으로 고용하고 있다. 특히 스마트팜 기술을 활용해 발달장애인도 쉽게 작업할 수 있는 환경을 구축한 점이 높은 평가를 받았다.

누리는 "단순히 일자리를 제공하는 것을 넘어 발달장애인이 전문 농업인으로 성장할 수 있도록 체계적인 교육 프로그램을 운영하고 있다"며 "대학과 연계한 2년 과정의 정규 교육과정과 민간자격증 취득 과정을 통해 전문성을 갖춘 인재로 양성하고 있다"고 설명했다.

경기도 관계자는 "누리처럼 취약계층 고용에 앞장서면서도 기업의 성장을 이뤄낸 사례가 다른 기업들에게도 좋은 모범이 되길 바란다"고 말했다.`,
    image: '/api/placeholder/800/600',
    tags: ['일자리우수기업', '경기도', '장애인고용', '사회적기업'],
    link: 'https://www.ipress.kr/news/articleView.html?idxno=6826',
    source: '인터넷신문',
    highlight: false
  },
  {
    id: 3,
    category: 'global',
    type: 'news',
    date: '2024.10.25',
    title: '베트남 호치민에 첫 해외 스마트팜 구축',
    description: '동남아시아 진출의 교두보로 베트남 호치민에 5,000평 규모 스마트팜을 구축하고 현지 장애인 50명을 고용했습니다.',
    image: '/api/placeholder/800/600',
    tags: ['해외진출', '베트남', '일자리창출'],
    link: '#'
  },
  {
    id: 4,
    category: 'award',
    type: 'achievement',
    date: '2024.09.15',
    title: '대한민국 ESG 경영대상 수상',
    description: '환경부와 산업통상자원부가 공동 주최한 2024 대한민국 ESG 경영대상에서 사회적가치 부문 대상을 수상했습니다.',
    image: '/api/placeholder/800/600',
    tags: ['ESG', '수상', '사회적가치'],
    link: '#'
  },
  {
    id: 5,
    category: 'partnership',
    type: 'news',
    date: '2024.08.20',
    title: '삼성전자와 스마트팜 기술 협력 MOU 체결',
    description: '삼성전자 DS부문과 AI 기반 스마트팜 고도화를 위한 기술 협력 MOU를 체결하고 공동 R&D를 시작합니다.',
    image: '/api/placeholder/800/600',
    tags: ['파트너십', '삼성전자', 'R&D'],
    link: '#'
  }
];

// 로컬 스토리지 키
const STORAGE_KEY = 'nuri_news_items';

// 뉴스 아이템 가져오기
export const getNewsItems = (): NewsItem[] => {
  if (typeof window === 'undefined') return initialNewsItems;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse news items from localStorage', e);
    }
  }

  // 초기 데이터 저장
  saveNewsItems(initialNewsItems);
  return initialNewsItems;
};

// 뉴스 아이템 저장
export const saveNewsItems = (items: NewsItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// 뉴스 아이템 추가
export const addNewsItem = (item: Omit<NewsItem, 'id'>): NewsItem => {
  const items = getNewsItems();
  const newItem: NewsItem = {
    ...item,
    id: Math.max(...items.map(i => i.id), 0) + 1
  };
  saveNewsItems([newItem, ...items]);
  return newItem;
};

// 뉴스 아이템 수정
export const updateNewsItem = (id: number, updates: Partial<NewsItem>): boolean => {
  const items = getNewsItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  saveNewsItems(items);
  return true;
};

// 뉴스 아이템 삭제
export const deleteNewsItem = (id: number): boolean => {
  const items = getNewsItems();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  saveNewsItems(filtered);
  return true;
};

// 뉴스 아이템 하나 가져오기
export const getNewsItem = (id: number): NewsItem | undefined => {
  const items = getNewsItems();
  return items.find(item => item.id === id);
};