import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { api } from '../api/api';
import { Ionicons } from '@expo/vector-icons';
import { Schedule, ScheduleType } from '../types';

const TodayCheck = () => {
  const navigation = useNavigation();
  const { userId } = useUser();
  const [showDashboardIcon, setShowDashboardIcon] = useState(false);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);

  // 오늘 일정 조회
  const fetchTodaySchedule = async () => {
    try {
      if (!userId) return;
      const schedules = await api.schedule.getTodaySchedule(parseInt(userId));
      console.log('✅ 받아온 일정:', schedules);
      setTodaySchedules(schedules);
    } catch (error) {
      console.error('오늘 일정 조회 실패:', error);
      Alert.alert('오류', '오늘 일정을 불러오는데 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 일정 조회
  useEffect(() => {
    fetchTodaySchedule();
  }, [userId]);

  // 3초 후에 대시보드 아이콘 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDashboardIcon(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = async (scheduleId: number) => {
    try {
      await api.schedule.completeSchedule(scheduleId);
      Alert.alert('알림', '일정이 완료되었습니다.');
      fetchTodaySchedule();
    } catch (error) {
      console.error('일정 완료 처리 실패:', error);
      Alert.alert('오류', '일정 완료 처리에 실패했습니다.');
    }
  };

  const handleDelete = async (title: string) => {
    try {
      if (!userId) return;
      await api.schedule.deleteSchedule(parseInt(userId), title);
      Alert.alert('알림', '일정이 삭제되었습니다.');
      fetchTodaySchedule();
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      Alert.alert('오류', '일정 삭제에 실패했습니다.');
    }
  };

  const handleCheck = async () => {
    try {
      await api.schedule.completeSchedule(1); // 실제 scheduleId로 변경 필요
      Alert.alert(
        '일정 확인',
        '일정이 확인되었습니다.',
        [
          {
            text: '확인',
            onPress: () => navigation.navigate('Main' as never)
          }
        ]
      );
    } catch (error) {
      console.error('일정 확인 실패:', error);
      Alert.alert('오류', '일정 확인에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 일정 확인</Text>
      <Text style={styles.subtitle}>아래에서 오늘의 일정을 확인하고 관리하세요.</Text>
      <ScrollView style={styles.scrollView}>
        {todaySchedules.length === 0 ? (
          <Text style={styles.emptyText}>오늘 일정이 없습니다.</Text>
        ) : (
          todaySchedules.map((schedule, idx) => (
            <View key={schedule.id || idx} style={styles.scheduleItem}>
              <Text style={styles.scheduleTitle}>{schedule.title}</Text>
              <Text style={styles.scheduleType}>유형: {schedule.type}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#2ecc71' }]}
                  onPress={() => handleComplete(schedule.id!)}
                >
                  <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
                  onPress={() => handleDelete(schedule.title)}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.checkButton}
        onPress={handleCheck}
      >
        <Text style={styles.checkButtonText}>일정 확인하기</Text>
      </TouchableOpacity>

      {showDashboardIcon && (
        <TouchableOpacity
          style={styles.dashboardIcon}
          onPress={() => navigation.navigate('Main' as never)}
        >
          <Ionicons name="home" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 16,
  },
  scheduleItem: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dashboardIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
});

export default TodayCheck; 