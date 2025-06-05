export type RootStackParamList = {
  Main: undefined;
  TodayCheck: {
    medicationHour: number;
    medicationMinute: number;
    message: string;
  };
  ResultScreen: { 
    emotionType: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
  };
}; 