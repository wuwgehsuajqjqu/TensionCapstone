import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CareReceiverMain from '../../screens/CareReceiverMain';
import TodayCheck from '../../screens/TodayCheck';
import EmotionCheck from '../../screens/EmotionCheck';
import ResultScreen from '../../screens/ResultScreen';
import CareReceiverApp from '../../screens/CareReceiverApp';

export type RootStackParamList = {
  CareReceiverMain: undefined;
  TodayCheck: {
    medicationHour: number;
    medicationMinute: number;
    message: string;
  };
  EmotionCheck: undefined;
  ResultScreen: {
    emotionType: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <CareReceiverApp />
    </NavigationContainer>
  );
};

export default AppNavigator; 