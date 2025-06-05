import { User, HealthStatus, Schedule, Location, Notification } from '../types';

// API 기본 URL
const BASE_URL = 'https://capstone-tension.loca.lt/api';

// API 엔드포인트
const API_ENDPOINTS = {
  USERS: `${BASE_URL}/users`,
  SCHEDULES: `${BASE_URL}/schedule`,
  LOCATIONS: `${BASE_URL}/location`,
  HEALTH_STATUS: `${BASE_URL}/healthstatus/health-status`,
  NOTIFICATIONS: `${BASE_URL}/notifications`,
  FCM_TOKEN: `${BASE_URL}/fcm/tokens`,
  // 일정 관련 엔드포인트
  RECURRING_SCHEDULE: `${BASE_URL}/schedule/recurring`,
  NON_RECURRING_SCHEDULE: `${BASE_URL}/schedule/nonRecurring`,
  TODAY_SCHEDULE: `${BASE_URL}/schedule/today`,
  COMPLETE_SCHEDULE: `${BASE_URL}/schedule/complete`,
  DELETE_SCHEDULE: `${BASE_URL}/schedule`,
};

// API_ENDPOINTS 객체가 제대로 export되는지 확인
console.log('API_ENDPOINTS:', API_ENDPOINTS);

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// API 요청 함수들
export const api = {
  // User 관련 API
  user: {
    // 사용자 등록
    register: async (userData: User): Promise<User> => {
      try {
        console.log('API_ENDPOINTS in register:', API_ENDPOINTS);
        const response = await fetch(API_ENDPOINTS.USERS, {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(userData),
        });
        if (!response.ok) {
          throw new Error('사용자 등록에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('사용자 등록 실패:', error);
        throw error;
      }
    },

    // 사용자 정보 조회
    getUserInfo: async (): Promise<User[]> => {
      try {
        console.log('API_ENDPOINTS in getUserInfo:', API_ENDPOINTS);
        const response = await fetch(API_ENDPOINTS.USERS);
        if (!response.ok) {
          throw new Error('사용자 정보 조회에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        throw error;
      }
    },

    // FCM 토큰 저장
    saveFcmToken: async (userId: number, token: string): Promise<void> => {
      try {
        const response = await fetch('https://capstone-tension.loca.lt/api/fcm/tokens', {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ userId, token }),
        });
        if (!response.ok) {
          throw new Error('FCM 토큰 저장에 실패했습니다.');
        }
      } catch (error) {
        console.error('FCM 토큰 저장 실패:', error);
        throw error;
      }
    },
  },

  // Schedule 관련 API
  schedule: {
    // 모든 일정 조회 (정기 + 비정기)
    getSchedules: async (protectedUserId: string): Promise<Schedule[]> => {
      try {
        const [recurring, nonRecurring] = await Promise.all([
          api.schedule.getRecurringSchedules(Number(protectedUserId)),
          api.schedule.getNonRecurringSchedules(Number(protectedUserId)),
        ]);
        return [...recurring, ...nonRecurring];
      } catch (error) {
        console.error('일정 조회 실패:', error);
        throw error;
      }
    },

    // 오늘 일정 조회
    getTodaySchedule: async (protectedUserId: number): Promise<Schedule[]> => {
      console.log('testlog');
      try {
        const response = await fetch(`${API_ENDPOINTS.TODAY_SCHEDULE}/${protectedUserId}`);
        if (!response.ok) {
          throw new Error('오늘 일정 조회에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('오늘 일정 조회 실패:', error);
        throw error;
      }
    },

    // 정기 일정 조회
    getRecurringSchedules: async (protectedUserId: number): Promise<Schedule[]> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.RECURRING_SCHEDULE}/${protectedUserId}`);
        if (!response.ok) {
          throw new Error('정기 일정 조회에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('정기 일정 조회 실패:', error);
        throw error;
      }
    },

    // 비정기 일정 조회
    getNonRecurringSchedules: async (protectedUserId: number): Promise<Schedule[]> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.NON_RECURRING_SCHEDULE}/${protectedUserId}`);
        if (!response.ok) {
          throw new Error('비정기 일정 조회에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('비정기 일정 조회 실패:', error);
        throw error;
      }
    },

    // 일정 완료 처리
    completeSchedule: async (scheduleId: number): Promise<void> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.COMPLETE_SCHEDULE}/${scheduleId}`, {
          method: 'PUT',
        });
        if (!response.ok) {
          throw new Error('일정 완료 처리에 실패했습니다.');
        }
      } catch (error) {
        console.error('일정 완료 처리 실패:', error);
        throw error;
      }
    },

    // 일정 삭제
    deleteSchedule: async (protectedUserId: number, title: string): Promise<void> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.DELETE_SCHEDULE}/${protectedUserId}/${title}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('일정 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('일정 삭제 실패:', error);
        throw error;
      }
    },
  },

  // HealthStatus 관련 API
  healthStatus: {
    // 건강 상태 기록
    recordHealthStatus: async (data: {
      protectedUserId: string;
      checkMedicine: boolean;
      checkBreakfast: boolean;
      mood: string | null;
      recordedAt: string;
    }): Promise<HealthStatus> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.HEALTH_STATUS}/${data.protectedUserId}/mood`, {
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

    // 건강 상태 업데이트
    updateMoodStatus: async (healthStatusId: number, mood: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD'): Promise<void> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.HEALTH_STATUS}/${healthStatusId}/mood`, {
          method: 'PUT',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ mood }),
        });
        if (!response.ok) {
          throw new Error('건강 상태 업데이트에 실패했습니다.');
        }
      } catch (error) {
        console.error('건강 상태 업데이트 실패:', error);
        throw error;
      }
    },

    // 보호대상자별 건강 상태 조회
    getByProtectedUser: async (protectedUserId: number): Promise<HealthStatus[]> => {
      try {
        const response = await fetch(`${API_ENDPOINTS.HEALTH_STATUS}/${protectedUserId}`);
        if (!response.ok) {
          throw new Error('건강 상태 조회에 실패했습니다.');
        }
        return await response.json();
      } catch (error) {
        console.error('건강 상태 조회 실패:', error);
        throw error;
      }
    },
  },

  // Location 관련 API
  location: {
    // 위치 정보 전송
    sendLocation: async (protectedUserId:number,latitude: number, longitude: number): Promise<void> => {
      try {
        const timestamp=new Date().toISOString();
        const response = await fetch(API_ENDPOINTS.LOCATIONS, {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ latitude, longitude, timestamp, protectedUserId }),
        });
        if (!response.ok) {
          throw new Error('위치 정보 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('위치 정보 전송 실패:', error);
        throw error;
      }
    },
  },

  // Notification 관련 API
  notification: {
    // 알림 생성
    createNotification: async (notification: Notification): Promise<void> => {
      try {
        const response = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(notification),
        });
        if (!response.ok) {
          throw new Error('알림 생성에 실패했습니다.');
        }
      } catch (error) {
        console.error('알림 생성 실패:', error);
        throw error;
      }
    },
  },
}; 