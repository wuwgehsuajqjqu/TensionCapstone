//타입정의
export enum UserRole {
  PROTECTOR = '보호자',
  PROTECTED = '피보호자'
}

export enum MoodStatus {
  GOOD = 'GOOD',
  OKAY = 'OKAY',
  TIRED = 'TIRED',
  SAD = 'SAD'
}

export enum ScheduleType {
  MEDICATION = 'MEDICINE',
  HOSPITAL = 'HOSPITAL'
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  protectorId?: number;
}

export interface HealthStatus {
  id?: number;
  protectedUserId: number;
  checkMedicine: boolean;
  checkBreakfast: boolean;
  mood: MoodStatus;
  recordedAt: string;
}

export interface Schedule {
  id?: number;
  title: string;
  type: ScheduleType;
  isRecurring: boolean;
  recurringDays?: string[];
  recurringTime?: string;
  oneTimeDateTime?: string;
  completed: boolean;
  hour?: number;
  minute?: number;
  time?: string;
  message?: string;
}

export interface Location {
  id?: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  userId: number;
}

export interface Notification {
  id?: number;
  title: string;
  body: string;
  userId: number;
  createdAt: string;
  read: boolean;
}

export interface FCMToken {
  id?: number;
  userId: number;
  token: string;
  createdAt: string;
} 