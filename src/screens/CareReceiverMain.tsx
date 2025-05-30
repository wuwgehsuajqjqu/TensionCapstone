import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './CareReceiverApp';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useUser } from '../context/UserContext';
import { Schedule } from '../types';
import { api } from '../api/api';


// 이미지 import
const pillIcon = require('../assets/images/icons/pill_icon.png');
const hospitalIcon = require('../assets/images/icons/hospital_icon.png');

const baseScreenWidth = 360;
const baseScreenHeight = 800;
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const rw = (baseElementSize: number): number => {
  const screenRatio = screenWidth / baseScreenWidth;
  return baseElementSize * screenRatio;
};

const rh = (baseElementSize: number): number => {
  const screenRatio = screenHeight / baseScreenHeight;
  return baseElementSize * screenRatio;
};

type CareReceiverMainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CareReceiverMain'>;

type Props = {
  navigation: CareReceiverMainScreenNavigationProp;
};

const CareReceiverMain = ({ navigation }: Props) => {
  const { userId, isLoading: isUserLoading, userName } = useUser();
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sendLocationToServer = useCallback(async (latitude: number, longitude: number) => {
    if (!userId) {
      console.warn('userId가 없습니다. 위치 전송 생략');
      return;
    }
    try {
      await api.location.sendLocation(Number(userId), latitude, longitude);
      console.log('📍 위치 정보 전송 성공:', latitude, longitude);
    } catch (error) {
      console.error('위치 정보 전송 중 오류 발생:', error);
    }
  }, [userId]);

  const checkLocationPermission = useCallback(async () => {
    try {
      const fineLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (fineLocationResult === RESULTS.GRANTED) {
        console.log('GPS 권한이 허용되었습니다.');
        const backgroundLocationResult = await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        if (backgroundLocationResult === RESULTS.GRANTED) {
          console.log('백그라운드 위치 권한이 허용되었습니다.');
          setLocationPermission(true);
        } else {
          Alert.alert(
            '위치 권한 필요',
            '백그라운드에서도 위치 정보를 수집하기 위해 권한이 필요합니다.',
            [{ text: '확인' }]
          );
        }
      } else {
        Alert.alert(
          '위치 권한 필요',
          '위치 정보를 수집하기 위해 권한이 필요합니다.',
          [{ text: '확인' }]
        );
      }
    } catch (error) {
      console.error('권한 체크 중 오류 발생:', error);
      Alert.alert('오류', '권한 확인 중 문제가 발생했습니다.');
    }
  }, []);

  // 위치 업데이트 설정
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    
    if (locationPermission) {
      // 초기 위치 전송
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendLocationToServer(latitude, longitude);
        },
        (error) => {
          console.error('초기 위치 정보를 가져오는 중 오류 발생:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      // x분마다 위치 업데이트
      intervalId = setInterval(() => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            sendLocationToServer(latitude, longitude);
          },
          (error) => {
            console.error('위치 정보를 가져오는 중 오류 발생:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [locationPermission, sendLocationToServer]);

  // 권한 체크 및 일정 가져오기
  useEffect(() => {
    fetchSchedules();
    checkLocationPermission();
  }, []);

  const fetchSchedules = async () => {
    if (!userId) {
      setError('사용자 정보를 불러올 수 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.schedule.getTodaySchedule(Number(userId));
      console.log('✅ 받아온 일정:', data);
      setSchedules(data);
    } catch (error) {
      console.error('일정 조회 실패:', error);
      Alert.alert('오류', '일정을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 일정 완료 처리
  const handleScheduleComplete = async (scheduleId: number) => {
    try {
      await api.schedule.completeSchedule(scheduleId);

      // 일정 목록 새로고침
      const updatedSchedules = schedules.map(schedule =>
        schedule.id === scheduleId
          ? { ...schedule, completed: true }
          : schedule
      );
      setSchedules(updatedSchedules);

      // 현재 시간
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // 다음 일정 찾기
      const nextSchedule = updatedSchedules.find(schedule => {
        if (schedule.completed) return false; // 완료된 일정은 건너뛰기
        if (schedule.isRecurring) {
          const [scheduleHour, scheduleMinute] = schedule.recurringTime!.split(':').map(Number);
          return (scheduleHour > currentHour) ||
                 (scheduleHour === currentHour && scheduleMinute > currentMinute);
        } else {
          const scheduleDate = new Date(schedule.oneTimeDateTime!);
          return scheduleDate > now;
        }
      });

      if (nextSchedule) {
        let medicationHour = 0;
        let medicationMinute = 0;
        if (nextSchedule.isRecurring && nextSchedule.recurringTime) {
          const [h, m] = nextSchedule.recurringTime.split(':').map(Number);
          medicationHour = h;
          medicationMinute = m;
        } else if (nextSchedule.oneTimeDateTime) {
          const date = new Date(nextSchedule.oneTimeDateTime);
          medicationHour = date.getHours();
          medicationMinute = date.getMinutes();
        }

        navigation.navigate('TodayCheck', {
          medicationHour,
          medicationMinute,
          message: nextSchedule.type === 'MEDICINE'
            ? `오늘 ${nextSchedule.title}을(를) 복용하실 시간입니다`
            : `오늘 ${nextSchedule.title}을(를) 방문하실 시간입니다`
        });
      } else {
        Alert.alert('알림', '남은 일정이 없습니다.');
      }
    } catch (error) {
      console.error('일정 완료 처리 중 오류 발생:', error);
      Alert.alert('오류', '일정 완료 처리 중 문제가 발생했습니다.');
    }
  };

  const handleScheduleCheck = () => {
    try {
      console.log('일정확인 버튼 클릭됨');
      if (!schedules || schedules.length === 0) {
        Alert.alert('알림', '확인할 일정이 없습니다.');
        return;
      }

      // 현재 시간
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // 현재 시간 이후의 첫 번째 일정 찾기
      const nextSchedule = schedules.find(schedule => {
        if (schedule.isRecurring) {
          const [scheduleHour, scheduleMinute] = schedule.recurringTime!.split(':').map(Number);
          return (scheduleHour > currentHour) ||
                 (scheduleHour === currentHour && scheduleMinute > currentMinute);
        } else {
          const scheduleDate = new Date(schedule.oneTimeDateTime!);
          return scheduleDate > now;
        }
      });

      if (!nextSchedule) {
        Alert.alert('알림', '오늘 남은 일정이 없습니다.');
        return;
      }

      let medicationHour = 0;
      let medicationMinute = 0;
      if (nextSchedule.isRecurring && nextSchedule.recurringTime) {
        const [h, m] = nextSchedule.recurringTime.split(':').map(Number);
        medicationHour = h;
        medicationMinute = m;
      } else if (nextSchedule.oneTimeDateTime) {
        const date = new Date(nextSchedule.oneTimeDateTime);
        medicationHour = date.getHours();
        medicationMinute = date.getMinutes();
      }

      navigation.navigate('TodayCheck', {
        medicationHour,
        medicationMinute,
        message: nextSchedule.type === 'MEDICINE'
          ? `오늘 ${nextSchedule.title}을(를) 복용하실 시간입니다`
          : `오늘 ${nextSchedule.title}을(를) 방문하실 시간입니다`
      });
    } catch (error) {
      console.error('일정확인 중 오류 발생:', error);
      Alert.alert('오류', '일정을 불러오는 중 문제가 발생했습니다.');
    }
  };

  // 날짜 포맷팅
  const formattedDate = format(currentTime, 'M월 d일 EEEE', { locale: ko });
  const formattedTime = format(currentTime, 'a h시 mm분', { locale: ko });

  return (
    <View style={styles.container}>
      {/* 상단 시간 표시 */}
      <View style={styles.timeContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>

      {/* 주요 일정 섹션 */}
      <View style={styles.scheduleSection}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.starText}>★</Text>
          <Text style={styles.scheduleTitle}>주요 일정</Text>
          <View style={styles.divider} />
        </View>

        <ScrollView style={styles.scheduleList}>
          {schedules.map((schedule, idx) => (
            <TouchableOpacity
              key={schedule.id || idx}
              style={styles.scheduleItem}
              onPress={() => handleScheduleComplete(schedule.id!)}
            >
              <Image
                source={schedule.type === 'MEDICINE' ? pillIcon : hospitalIcon}
                style={styles.scheduleIcon}
              />
              <View style={styles.scheduleTextContainer}>
                <Text style={styles.scheduleTime}>
                  {schedule.time}
                </Text>
                <Text style={styles.scheduleDesc}>{schedule.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 테스트용 일정확인 버튼 */}
      <TouchableOpacity
        style={[styles.checkButton, { backgroundColor: '#FF6B6B', bottom: 80 }]}
        onPress={() => navigation.navigate('EmotionCheck')}
      >
        <Text style={styles.checkButtonText}>감정 체크</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkButton}
        onPress={handleScheduleCheck}
      >
        <Text style={styles.checkButtonText}>일정 체크</Text>
      </TouchableOpacity>
    </View>
  );
};

const BAR_HEIGHT = rh(80);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,  // 버튼 사이 간격 추가
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    padding: 20,
    marginTop: 60,
    alignItems: 'center',
  },
  dateText: {
    color: '#7e7e7e',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  timeText: {
    color: '#000000',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  scheduleSection: {
    padding: 20,
    marginTop: 20,
    zIndex: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    zIndex: 2,
  },
  starText: {
    color: '#ffb969',
    fontSize: 36,
    fontWeight: '900',
    fontFamily: 'Montserrat-Black',
  },
  scheduleTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    marginLeft: 12,
    marginRight: 12,
  },
  divider: {
    position: 'absolute',
    left: '45%',
    top: '50%',
    width: '55%',
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.2,
  },
  scheduleList: {
    marginTop: 10,
    zIndex: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
  },
  scheduleIcon: {
    width: 104,
    height: 102.88,
    marginRight: 15,
    backgroundColor: '#f6dfac',
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleTime: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  scheduleDesc: {
    fontSize: 20,
    fontWeight: '600',
  },
  checkButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CareReceiverMain;
