import messaging from '@react-native-firebase/messaging';
import { api } from '../api/api';

// FCM 토큰 요청 및 저장
export const requestAndSaveFCMToken = async (userId: string): Promise<string | null> => {
  try {
    // 알림 권한 요청
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // FCM 토큰 가져오기
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      // 서버에 토큰 저장
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
export const setupFCMTokenRefresh = (userId: string) => {
  messaging().onTokenRefresh(async (fcmToken) => {
    try {
      console.log('FCM Token Refreshed:', fcmToken);
      await api.user.saveFcmToken(userId, fcmToken);
    } catch (error) {
      console.error('FCM 토큰 갱신 실패:', error);
    }
  });
}; 