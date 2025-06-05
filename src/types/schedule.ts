export interface Schedule {
  id: number;
  title: string;
  type: 'MEDICATION' | 'HOSPITAL';
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