//앱 네비게이터 구조 정의
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CareReceiverMain from '../screens/CareReceiverMain';
import TodayCheck from '../screens/TodayCheck';
import EmotionCheck from '../screens/EmotionCheck';
import ResultScreen from '../screens/ResultScreen';

export type RootStackParamList = {
  CareReceiverMain: undefined;
  EmotionCheck: undefined;
  TodayCheck: {
    medicationHour?: number;
    medicationMinute?: number;
    message?: string;
    scheduleId?: number;
  };
  ResultScreen: {
    emotionType: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const CareReceiverApp = () => {
  return (
    <Stack.Navigator
      initialRouteName="CareReceiverMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CareReceiverMain" component={CareReceiverMain} />
      <Stack.Screen name="TodayCheck" component={TodayCheck} />
      <Stack.Screen name="EmotionCheck" component={EmotionCheck} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
};

export default CareReceiverApp;
