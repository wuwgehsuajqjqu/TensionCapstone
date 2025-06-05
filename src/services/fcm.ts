import messaging from '@react-native-firebase/messaging';
import { api } from '../api/api';
import { useUser } from '../context/UserContext';

// 앱 실행 시 권한 요청
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

// FCM 토큰 가져오기
export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('FCM Token Error:', error);
  }
};

// FCM 토큰 저장
export const saveFCMToken = async (userId: number, token: string) => {
  try {
    await api.user.saveFcmToken(userId, token);
    console.log('FCM Token saved successfully');
  } catch (error) {
    console.error('FCM Token save error:', error);
  }
};

// 알림 리스너
export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // 앱 실행 시 알림 확인
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  // 앱 실행 시 알림 확인
  messaging().onMessage(async remoteMessage => {
    console.log('Received foreground message:', remoteMessage);
  });
};

// FCM 토큰 요청 및 저장 (통합 함수)
export const requestAndSaveFCMToken = async (userId: number): Promise<string | null> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      await api.user.saveFcmToken(userId, fcmToken);
      return fcmToken;
    }
    return null;
  } catch (error) {
    console.error('FCM 토큰 요청/저장 실패:', error);
    return null;
  }
};

// FCM 토큰 갱신 시 처리
export const setupFCMTokenRefresh = (userId: number) => {
  messaging().onTokenRefresh(async (fcmToken) => {
    try {
      console.log('FCM Token Refreshed:', fcmToken);
      await api.user.saveFcmToken(userId, fcmToken);
    } catch (error) {
      console.error('FCM 토큰 갱신 실패:', error);
    }
  });
}; 