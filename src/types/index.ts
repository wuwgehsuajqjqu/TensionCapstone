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
  MEDICATION = 'MEDICATION',
  HOSPITAL = 'HOSPITAL'
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
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
}

export interface Location {
  id?: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  protectedUserId: number;
}

export interface Notification {
  numId?: number;
  userId: string;
  title: string;
  body: string;
}

export interface FCMToken {
  numId?: number;
  userId: string;
  token: string;
} 