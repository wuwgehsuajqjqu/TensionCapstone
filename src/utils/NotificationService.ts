import notifee, { AndroidImportance, AuthorizationStatus, TriggerType, RepeatFrequency } from '@notifee/react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = async () => {
    try {
      // 알림 권한 요청
      const settings = await notifee.requestPermission();
      console.log('알림 권한 상태:', settings.authorizationStatus);
      
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('알림 권한이 허용되었습니다.');
        
        // 안드로이드 채널 생성
        await notifee.createChannel({
          id: 'medication-reminder',
          name: 'Medication Reminder',
          description: '약 복용 알림',
          importance: AndroidImportance.HIGH,
          sound: 'default',
          vibration: true,
        });
        console.log('알림 채널이 생성되었습니다.');
      } else {
        console.log('알림 권한이 거부되었습니다.');
        throw new Error('알림 권한이 거부되었습니다.');
      }
    } catch (error) {
      console.error('알림 설정 중 오류 발생:', error);
      throw error;
    }
  };

  // 로컬 알림 예약
  scheduleNotification = async (hour: number, minute: number, message: string) => {
    try {
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hour, minute, 0, 0);

      // 이미 지난 시간이면 다음 날로 설정
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      console.log('알림 예약 시간:', scheduledTime.toLocaleString());

      // 알림 예약
      await notifee.createTriggerNotification(
        {
          title: '약 복용 시간',
          body: message,
          android: {
            channelId: 'medication-reminder',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: scheduledTime.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
        }
      );
      console.log('알림이 성공적으로 예약되었습니다.');
    } catch (error) {
      console.error('알림 예약 중 오류 발생:', error);
      throw error;
    }
  };

  // 모든 알림 취소
  cancelAllNotifications = async () => {
    try {
      await notifee.cancelAllNotifications();
      console.log('모든 알림이 취소되었습니다.');
    } catch (error) {
      console.error('알림 취소 중 오류 발생:', error);
      throw error;
    }
  };
}

export default new NotificationService(); 