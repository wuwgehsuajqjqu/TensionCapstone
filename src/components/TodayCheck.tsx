import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './CareReceiverApp';
import { useUser } from '../context/UserContext';
import NotificationService from '../utils/NotificationService';
import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { api } from '../api/api';

type TodayCheckScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TodayCheck'>;
type TodayCheckScreenRouteProp = RouteProp<RootStackParamList, 'TodayCheck'>;

type Props = {
  navigation: TodayCheckScreenNavigationProp;
  route: TodayCheckScreenRouteProp;
};

const TodayCheck = ({ navigation, route }: Props) => {
  const { medicationHour = 0, medicationMinute = 0, message = '' } = route.params || {};
  const { userId, isLoading: isUserLoading } = useUser();

  const [isMissed, setIsMissed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const formattedTime = `${medicationHour < 10 ? '0' : ''}${medicationHour} : ${
    medicationMinute < 10 ? '0' : ''
  }${medicationMinute}`;

  useEffect(() => {
    const setupNotification = async () => {
      try {
        console.log('알림 설정 시작...');
        
        // 현재 권한 상태 확인
        const currentSettings = await notifee.getNotificationSettings();
        console.log('현재 알림 권한 상태:', currentSettings.authorizationStatus);

        // 권한이 없는 경우에만 요청
        if (currentSettings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED) {
          console.log('알림 권한 요청 중...');
          const settings = await notifee.requestPermission();
          console.log('알림 권한 요청 결과:', settings.authorizationStatus);
          
          if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
            console.log('알림 권한이 거부되었습니다.');
            Alert.alert('알림 권한 필요', '알림을 받으려면 권한이 필요합니다.');
            return;
          }
        }

        // 테스트를 위해 현재 시간으로부터 1분 후로 설정
        const now = new Date();
        const testHour = now.getHours();
        const testMinute = now.getMinutes() + 1;
        
        await NotificationService.scheduleNotification(testHour, testMinute, message);
        console.log('테스트 알림이 설정되었습니다:', testHour, '시', testMinute, '분');
      } catch (error) {
        console.error('알림 설정 실패:', error);
        Alert.alert('오류', '알림 설정에 실패했습니다.');
      }
    };

    setupNotification();

    const timer = setTimeout(() => {
      if (!isConfirmed) {
        setIsMissed(true);
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      NotificationService.cancelAllNotifications();
    };
  }, [isConfirmed, message]);

  const handleConfirm = async () => {
    if (!userId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      await api.recordHealthStatus({
        protectedUserId: userId,
        checkMedicine: true,
        checkBreakfast: false,
        mood: null,
        recordedAt: new Date().toISOString(),
      });

      setIsConfirmed(true);
      await NotificationService.cancelAllNotifications();
      
      // 1초 후 앱 종료
      setTimeout(() => {
        BackHandler.exitApp();
      }, 1000);
    } catch (error) {
      console.error('API 요청 실패:', error);
      Alert.alert('오류', '처리 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMissed = async () => {
    if (!userId) {
      Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      await api.recordHealthStatus({
        protectedUserId: userId,
        checkMedicine: false,
        checkBreakfast: false,
        mood: null,
        recordedAt: new Date().toISOString(),
      });

      await NotificationService.cancelAllNotifications();
      
      // 1초 후 앱 종료
      setTimeout(() => {
        BackHandler.exitApp();
      }, 1000);
    } catch (error) {
      console.error('오류 발생:', error);
      Alert.alert('오류', '처리 중 문제가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isUserLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isMissed) {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{formattedTime}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleMissed}
          disabled={isSaving}
        >
          <Image
            source={require('../assets/images/icons/dashicons_no.png')}
            style={styles.icon}
          />
          {isSaving && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formattedTime}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          isConfirmed && styles.confirmedButton
        ]}
        onPress={handleConfirm}
        disabled={isSaving}
      >
        <Image
          source={isConfirmed 
            ? require('../assets/images/icons/white_check.png')
            : require('../assets/images/icons/mdi_check-bold.png')
          }
          style={styles.icon}
        />
        <Text style={[
          styles.confirmText,
          isConfirmed && styles.confirmedText
        ]}>확인</Text>
        {isSaving && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TodayCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  time: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6a6767',
    marginBottom: 20,
  },
  message: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginBottom: 40,
  },
  confirmButton: {
    alignItems: 'center',
    padding: 20,
    borderColor: '#038c3e',
    borderWidth: 5,
    borderRadius: 10,
  },
  confirmedButton: {
    backgroundColor: '#038c3e',
    borderColor: '#038c3e',
  },
  icon: {
    width: 275,
    height: 269,
    marginBottom: 20,
  },
  confirmText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000000',
  },
  confirmedText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
