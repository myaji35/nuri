export interface EducationProgram {
  id: number;
  title: string; // 교육 제목
  category: string; // 교육 분류
  instructor: string; // 강사명
  startDate: string; // 시작일
  endDate: string; // 종료일
  duration: number; // 총 시간 (시간 단위)
  capacity: number; // 정원
  enrolled: number; // 등록 인원
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled'; // 상태
  location: string; // 장소
  description?: string; // 설명
  targetAudience?: string; // 대상
  objectives?: string; // 교육 목표
  workplaceId?: number; // 사업장 ID
  workplaceName?: string; // 사업장명
}

export interface EducationParticipant {
  id: number;
  programId: number; // 교육 프로그램 ID
  memberId: number; // 조직원 ID
  memberName: string; // 조직원명
  status: 'enrolled' | 'completed' | 'cancelled'; // 참여 상태
  attendance: number; // 출석률 (%)
  score?: number; // 평가 점수
  feedback?: string; // 피드백
  enrolledDate: string; // 등록일
}

// 교육 분류
export const educationCategories = [
  { id: 'smart-farming', label: '스마트팜 기술' },
  { id: 'disability-support', label: '장애인 지원' },
  { id: 'agriculture', label: '농업 실무' },
  { id: 'safety', label: '안전 교육' },
  { id: 'management', label: '경영 관리' },
  { id: 'it', label: 'IT/기술' },
  { id: 'soft-skills', label: '소프트 스킬' },
  { id: 'other', label: '기타' }
];

// 초기 교육 프로그램 데이터
const initialPrograms: EducationProgram[] = [
  {
    id: 1,
    title: '스마트팜 기초 교육',
    category: 'smart-farming',
    instructor: '김기술',
    startDate: '2025-12-01',
    endDate: '2025-12-05',
    duration: 40,
    capacity: 20,
    enrolled: 15,
    status: 'planned',
    location: 'NURI 이천 교육센터',
    description: '스마트팜 시스템의 기초부터 실습까지',
    targetAudience: '신입 직원, 발달장애인',
    objectives: '스마트팜 기본 개념 이해 및 실무 능력 배양'
  },
  {
    id: 2,
    title: '발달장애인 직무 지도 워크샵',
    category: 'disability-support',
    instructor: '이전문',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    duration: 24,
    capacity: 15,
    enrolled: 12,
    status: 'ongoing',
    location: '온라인',
    description: '발달장애인 직무 지도 방법론 및 사례 연구',
    targetAudience: '매니저, 팀장',
    objectives: '효과적인 장애인 직무 지도 능력 향상'
  }
];

const initialParticipants: EducationParticipant[] = [];

// 로컬 스토리지 키
const PROGRAMS_KEY = 'nuri_education_programs';
const PARTICIPANTS_KEY = 'nuri_education_participants';

// 교육 프로그램 관리 함수들
export const getPrograms = (): EducationProgram[] => {
  if (typeof window === 'undefined') return initialPrograms;

  const stored = localStorage.getItem(PROGRAMS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse programs', e);
    }
  }

  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(initialPrograms));
  return initialPrograms;
};

const savePrograms = (programs: EducationProgram[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(programs));
};

export const getProgram = (id: number): EducationProgram | undefined => {
  const programs = getPrograms();
  return programs.find(p => p.id === id);
};

export const addProgram = (program: Omit<EducationProgram, 'id'>): EducationProgram => {
  const programs = getPrograms();
  const newProgram: EducationProgram = {
    ...program,
    id: programs.length > 0 ? Math.max(...programs.map(p => p.id)) + 1 : 1
  };
  programs.push(newProgram);
  savePrograms(programs);
  return newProgram;
};

export const updateProgram = (id: number, updates: Partial<EducationProgram>): boolean => {
  const programs = getPrograms();
  const index = programs.findIndex(p => p.id === id);
  if (index === -1) return false;

  programs[index] = { ...programs[index], ...updates };
  savePrograms(programs);
  return true;
};

export const deleteProgram = (id: number): boolean => {
  const programs = getPrograms();
  const filtered = programs.filter(p => p.id !== id);
  if (filtered.length === programs.length) return false;

  savePrograms(filtered);

  // 해당 프로그램의 참가자도 삭제
  const participants = getParticipants();
  const filteredParticipants = participants.filter(p => p.programId !== id);
  saveParticipants(filteredParticipants);

  return true;
};

// 참가자 관리 함수들
export const getParticipants = (): EducationParticipant[] => {
  if (typeof window === 'undefined') return initialParticipants;

  const stored = localStorage.getItem(PARTICIPANTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse participants', e);
    }
  }

  localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(initialParticipants));
  return initialParticipants;
};

const saveParticipants = (participants: EducationParticipant[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
};

export const getProgramParticipants = (programId: number): EducationParticipant[] => {
  const participants = getParticipants();
  return participants.filter(p => p.programId === programId);
};

export const addParticipant = (participant: Omit<EducationParticipant, 'id'>): EducationParticipant => {
  const participants = getParticipants();
  const newParticipant: EducationParticipant = {
    ...participant,
    id: participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1
  };
  participants.push(newParticipant);
  saveParticipants(participants);

  // 프로그램 등록 인원 업데이트
  const program = getProgram(participant.programId);
  if (program) {
    updateProgram(participant.programId, { enrolled: program.enrolled + 1 });
  }

  return newParticipant;
};

export const updateParticipant = (id: number, updates: Partial<EducationParticipant>): boolean => {
  const participants = getParticipants();
  const index = participants.findIndex(p => p.id === id);
  if (index === -1) return false;

  participants[index] = { ...participants[index], ...updates };
  saveParticipants(participants);
  return true;
};

export const deleteParticipant = (id: number): boolean => {
  const participants = getParticipants();
  const participant = participants.find(p => p.id === id);
  if (!participant) return false;

  const filtered = participants.filter(p => p.id !== id);
  saveParticipants(filtered);

  // 프로그램 등록 인원 업데이트
  const program = getProgram(participant.programId);
  if (program && program.enrolled > 0) {
    updateProgram(participant.programId, { enrolled: program.enrolled - 1 });
  }

  return true;
};

// 통계
export const getEducationStats = () => {
  const programs = getPrograms();
  const participants = getParticipants();

  return {
    totalPrograms: programs.length,
    ongoingPrograms: programs.filter(p => p.status === 'ongoing').length,
    completedPrograms: programs.filter(p => p.status === 'completed').length,
    totalParticipants: participants.length,
    completedParticipants: participants.filter(p => p.status === 'completed').length,
    averageAttendance: participants.length > 0
      ? Math.round(participants.reduce((sum, p) => sum + p.attendance, 0) / participants.length)
      : 0
  };
};
