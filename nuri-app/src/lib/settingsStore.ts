// 회원사별 설정 관리

export interface OrganizationSettings {
  organizationId: number;
  organizationName: string;
  llmProvider: 'gemini' | 'openai' | 'claude' | 'none';
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

const SETTINGS_KEY = 'nuri_organization_settings';

// 초기 설정 (누리팜)
const initialSettings: OrganizationSettings[] = [
  {
    organizationId: 1,
    organizationName: '농업법인 누리팜',
    llmProvider: 'gemini',
    apiKey: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 모든 설정 가져오기
export const getAllSettings = (): OrganizationSettings[] => {
  if (typeof window === 'undefined') return initialSettings;

  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
  }

  saveAllSettings(initialSettings);
  return initialSettings;
};

// 모든 설정 저장
export const saveAllSettings = (settings: OrganizationSettings[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// 특정 회원사 설정 가져오기
export const getSettings = (organizationId: number = 1): OrganizationSettings | undefined => {
  const allSettings = getAllSettings();
  return allSettings.find(s => s.organizationId === organizationId);
};

// 설정 업데이트
export const updateSettings = (
  organizationId: number,
  updates: Partial<Omit<OrganizationSettings, 'organizationId' | 'createdAt'>>
): boolean => {
  const allSettings = getAllSettings();
  const index = allSettings.findIndex(s => s.organizationId === organizationId);

  if (index === -1) {
    // 새 설정 추가
    const newSettings: OrganizationSettings = {
      organizationId,
      organizationName: updates.organizationName || `조직 ${organizationId}`,
      llmProvider: updates.llmProvider || 'none',
      apiKey: updates.apiKey || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveAllSettings([...allSettings, newSettings]);
    return true;
  }

  // 기존 설정 업데이트
  allSettings[index] = {
    ...allSettings[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveAllSettings(allSettings);
  return true;
};

// LLM Provider 가져오기
export const getLLMProvider = (organizationId: number = 1): 'gemini' | 'openai' | 'claude' | 'none' => {
  const settings = getSettings(organizationId);
  return settings?.llmProvider || 'none';
};

// API Key 가져오기
export const getAPIKey = (organizationId: number = 1): string => {
  const settings = getSettings(organizationId);
  return settings?.apiKey || '';
};

// 현재 로그인한 회원사 ID 가져오기 (임시로 1 반환, 추후 AuthContext와 연동)
export const getCurrentOrganizationId = (): number => {
  // TODO: AuthContext에서 현재 로그인한 회원사 ID 가져오기
  return 1; // 기본값: 누리팜
};
