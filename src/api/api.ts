// API 기본 URL
export const API_BASE_URL = 'https://capstone-tension.loca.lt';

// API 엔드포인트
export const API_ENDPOINTS = {
  SCHEDULES: `${API_BASE_URL}/api/schedules`,
  LOCATION: `${API_BASE_URL}/api/location`,
  HEALTH_STATUS: `${API_BASE_URL}/api/healthstatus`,
  USERS: `${API_BASE_URL}/api/users`,
};

// API 요청 헤더
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// API 요청 함수들
export const api = {
  // 일정 조회
  getSchedules: async (userId: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SCHEDULES}?userId=${userId}`);
      if (!response.ok) {
        throw new Error('일정을 불러오는데 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('일정 조회 실패:', error);
      throw error;
    }
  },

  // 위치 정보 전송
  sendLocation: async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOCATION, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ latitude, longitude }),
      });
      if (!response.ok) {
        throw new Error('위치 정보 전송에 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('위치 정보 전송 실패:', error);
      throw error;
    }
  },

  // 일정 완료 처리
  completeSchedule: async (scheduleId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SCHEDULES}/${scheduleId}`, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ completed: true }),
      });
      if (!response.ok) {
        throw new Error('일정 완료 처리에 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('일정 완료 처리 실패:', error);
      throw error;
    }
  },

  // 건강 상태 기록
  recordHealthStatus: async (data: {
    protectedUserId: string;
    checkMedicine: boolean;
    checkBreakfast: boolean;
    mood: string | null;
    recordedAt: string;
  }) => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH_STATUS, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('건강 상태 기록에 실패했습니다.');
      }
      return await response.json();
    } catch (error) {
      console.error('건강 상태 기록 실패:', error);
      throw error;
    }
  },
}; 