//앱전체 화면 관리 stack navigator 각 화면 정의
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmotionCheck from '../components/EmotionCheck';
import ResultScreen from '../components/ResultScreen';

export type RootStackParamList = {
  EmotionCheck: undefined;
  ResultScreen: {
    emotionType: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
    healthData: {
      checkMedicine: boolean;
      checkBreakfast: boolean;
      mood: string;
      recordedAt: string;
    } | null;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EmotionCheck" component={EmotionCheck} />
    <Stack.Screen name="ResultScreen" component={ResultScreen} />
  </Stack.Navigator>
);

export default AppNavigator;
