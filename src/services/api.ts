import { User, HealthStatus, Schedule, Location, Notification, FCMToken } from '../types';

const BASE_URL = 'https://fair-mugs-argue.loca.lt/api';

// User 관련 API
export const userApi = {
  register: async (userData: User): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getUserInfo: async (): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users`);
    return response.json();
  },
};

// HealthStatus 관련 API
export const healthStatusApi = {
  create: async (healthStatus: HealthStatus): Promise<HealthStatus> => {
    const response = await fetch(`${BASE_URL}/healthstatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthStatus),
    });
    return response.json();
  },

  getByProtectedUser: async (protectedUserId: number): Promise<HealthStatus[]> => {
    const response = await fetch(`${BASE_URL}/healthstatus/protected/${protectedUserId}`);
    return response.json();
  },
};

// Schedule 관련 API
export const scheduleApi = {
  create: async (schedule: Schedule): Promise<Schedule> => {
    const response = await fetch(`${BASE_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule),
    });
    return response.json();
  },

  getAll: async (): Promise<Schedule[]> => {
    const response = await fetch(`${BASE_URL}/schedules`);
    return response.json();
  },
};

// Location 관련 API
export const locationApi = {
  create: async (location: Location): Promise<Location> => {
    const response = await fetch(`${BASE_URL}/location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });
    return response.json();
  },
};

// Notification 관련 API
export const notificationApi = {
  create: async (notification: Notification): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    return response.json();
  },

  getOne: async (numId: number): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications/${numId}`);
    return response.json();
  },

  getByUser: async (userId: string): Promise<Notification[]> => {
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}`);
    return response.json();
  },

  update: async (numId: number, notification: Notification): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications/${numId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    return response.json();
  },

  delete: async (numId: number): Promise<Notification> => {
    const response = await fetch(`${BASE_URL}/notifications/${numId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// FCM Token 관련 API
export const fcmTokenApi = {
  create: async (fcmToken: FCMToken): Promise<FCMToken> => {
    const response = await fetch(`${BASE_URL}/fcm/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmToken),
    });
    return response.json();
  },
}; 