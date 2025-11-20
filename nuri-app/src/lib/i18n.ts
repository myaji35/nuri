export const defaultLocale = 'en';
export const locales = ['en', 'ko'] as const;

export type Locale = (typeof locales)[number];

export const translations = {
  en: {
    header: {
      title: "NURI Global Impact",
      subtitle: "Smart Farming for Social Impact Worldwide"
    },
    nav: {
      about: "About",
      business: "Business",
      innovation: "Innovation",
      social: "Social Impact",
      investor: "Investors",
      news: "News",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      dashboard: "Dashboard"
    },
    legend: {
      title: "Market Tiers",
      tier1: "Tier 1: Implemented",
      tier2: "Tier 2: Priority",
      tier3: "Tier 3: Long-term"
    },
    tooltip: {
      gdp: "GDP",
      population: "Population"
    },
    hero: {
      title: "Connecting the World\nwith Data-Driven\nAgriculture Technology",
      subtitle: "Solving global challenges through sustainable agriculture and inclusive job creation.",
      cta: "Learn More"
    },
    login: {
      title: "Login to NURI Platform",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      loginButton: "Login",
      noAccount: "Don't have an account?",
      signupLink: "Sign up",
      or: "OR",
      googleLogin: "Continue with Google",
      linkedinLogin: "Continue with LinkedIn"
    },
    language: "Language",
    loading: "Loading...",
    revenue: {
      title: "How NURI Makes Money",
      subtitle: "Explore NURI's diversified revenue model and sales flow by customer segment",
      visualization: "Revenue Flow Visualization",
      annualRevenue: "Annual Revenue",
      yoyGrowth: "YoY Growth",
      sources: "Revenue Sources",
      segments: "Customer Segments",
      smartFarm: "Smart Farm Solutions",
      consulting: "Consulting Services",
      training: "Training Programs",
      equipment: "Equipment Sales",
      b2bEnterprise: "B2B Enterprise",
      b2bSMB: "B2B SMB",
      government: "Government",
      ngo: "NGO/Non-profit",
      insights: {
        title: "Key Revenue Insights",
        fastestGrowing: "Fastest Growing",
        fastestDesc: "SaaS Platform revenue grew 45% YoY, becoming our second-largest revenue source",
        highestMargin: "Highest Margin",
        highestDesc: "Training Programs deliver 65% gross margin with minimal operational costs",
        futureFocus: "Future Focus",
        futureDesc: "Expanding Government contracts expected to grow 3x in the next 2 years"
      }
    }
  },
  ko: {
    header: {
      title: "누리 글로벌 임팩트",
      subtitle: "전 세계 사회적 가치를 위한 스마트 파밍"
    },
    nav: {
      about: "소개",
      business: "사업",
      innovation: "기술혁신",
      social: "사회공헌",
      investor: "투자정보",
      news: "소식",
      contact: "문의하기",
      login: "로그인",
      signup: "회원가입",
      dashboard: "대시보드"
    },
    legend: {
      title: "시장 등급",
      tier1: "1등급: 구현됨",
      tier2: "2등급: 우선순위",
      tier3: "3등급: 장기계획"
    },
    tooltip: {
      gdp: "GDP",
      population: "인구"
    },
    hero: {
      title: "데이터 기반의\n글로벌 발달장애인\n농업 기술로 세상을 연결합니다",
      subtitle: "지속 가능한 농업과 포용적 일자리 창출을 통해 세계적인 도전 과제를 해결합니다.",
      cta: "더 알아보기"
    },
    login: {
      title: "NURI 플랫폼 로그인",
      email: "이메일",
      password: "비밀번호",
      rememberMe: "로그인 상태 유지",
      forgotPassword: "비밀번호를 잊으셨나요?",
      loginButton: "로그인",
      noAccount: "계정이 없으신가요?",
      signupLink: "회원가입",
      or: "또는",
      googleLogin: "Google로 계속하기",
      linkedinLogin: "LinkedIn으로 계속하기"
    },
    language: "언어",
    loading: "로딩 중...",
    revenue: {
      title: "누리의 수익 모델",
      subtitle: "누리의 다각화된 수익 모델과 고객 세그먼트별 매출 흐름을 한눈에 확인하세요",
      visualization: "수익 흐름 시각화",
      annualRevenue: "연간 수익",
      yoyGrowth: "전년 대비 성장률",
      sources: "수익원",
      segments: "고객 세그먼트",
      smartFarm: "스마트팜 솔루션",
      consulting: "컨설팅 서비스",
      training: "교육 프로그램",
      equipment: "장비 판매",
      b2bEnterprise: "대기업",
      b2bSMB: "중소기업",
      government: "정부/공공기관",
      ngo: "NGO/비영리단체",
      insights: {
        title: "주요 수익 인사이트",
        fastestGrowing: "최고 성장률",
        fastestDesc: "SaaS 플랫폼 수익이 전년 대비 45% 성장하여 두 번째로 큰 수익원이 되었습니다",
        highestMargin: "최고 마진율",
        highestDesc: "교육 프로그램은 최소한의 운영 비용으로 65% 총마진을 달성합니다",
        futureFocus: "미래 전략",
        futureDesc: "정부 계약 확대로 향후 2년간 3배 성장이 예상됩니다"
      }
    }
  }
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale];
}