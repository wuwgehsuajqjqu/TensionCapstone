import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { api } from '../api/api';

// step: 0(기본), 1(미수령), 2(기본), 3(미수령), 4(기본)
const TodayCheck = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = useUser();
  const [step, setStep] = useState(0);
  const timerRef = useRef<any>(null);
  const [isChecked, setIsChecked] = useState(false);

  const { medicationHour, medicationMinute, message, scheduleId } = route.params as {
    medicationHour: number;
    medicationMinute: number;
    message: string;
    scheduleId: number;
  };

  // 단계별 상태 전환
  useEffect(() => {
    if (step < 4) {
      timerRef.current = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [step]);

  const formatTime = (hour: number, minute: number) => {
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 || 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${period} ${displayHour}:${displayMinute}`;
  };

  const handleCheck = async () => {
    if (step !== 0 && step !== 2 && step !== 4) return; // 기본 상태에서만 동작
    try {
      if (!scheduleId) {
        throw new Error('일정 ID가 없습니다.');
      }
      setIsChecked(true);
      await api.schedule.completeSchedule(scheduleId);
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      } else {
        const { UIBackgroundTaskInvalid } = require('react-native').NativeModules;
        if (UIBackgroundTaskInvalid) {
          UIBackgroundTaskInvalid();
        }
      }
    } catch (error) {
      Alert.alert('오류', '일정 확인에 실패했습니다.');
      setIsChecked(false);
    }
  };

  // 상태별 버튼 렌더링
  let buttonContent;
  if (step === 1 || step === 3) {
    // 미수령 상태
    buttonContent = (
      <View style={styles.missedButton}>
        <View style={[
          styles.checkButtonContainer,
          styles.missedButtonContainer
        ]}>
          <Image 
            source={require('../assets/images/icons/dashicons_no.png')}
            style={styles.checkIcon}
          />
        </View>
      </View>
    );
  } else {
    // 기본 상태
    buttonContent = (
      <TouchableOpacity style={styles.checkButton} onPress={handleCheck}>
        <View style={[
          styles.checkButtonContainer,
          isChecked && styles.checkButtonContainerChecked
        ]}>
          <Image 
            source={isChecked 
              ? require('../assets/images/icons/white_check.png')
              : require('../assets/images/icons/mdi_check-bold.png')
            }
            style={styles.checkIcon}
          />
          <Text style={[
            styles.checkButtonText,
            isChecked && styles.checkButtonTextChecked
          ]}>확인</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(medicationHour, medicationMinute)}</Text>
      <Text style={styles.messageText}>{message}</Text>
      {buttonContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  timeText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6A6767',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 50,
  },
  messageText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 20
  },
  checkButton: {
    width: 275,
    height: 269,
  },
  checkButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#038C3E',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  checkButtonContainerChecked: {
    backgroundColor: '#038C3E',
  },
  checkIcon: {
    width: 125,
    height: 125,
    marginBottom: 6,
  },
  checkButtonText: {
    fontSize: 60,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 90,
    textAlign: 'center',
  },
  checkButtonTextChecked: {
    color: '#FFFFFF',
  },
  missedButton: {
    width: 275,
    height: 269,
  },
  missedButtonContainer: {
    borderColor: '#CC141C',
  },
});

export default TodayCheck;
