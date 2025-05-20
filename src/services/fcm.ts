import messaging from '@react-native-firebase/messaging';
import { api } from '../api/api';
import { useUser } from '../context/UserContext';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

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

export const saveFCMToken = async (userId: string, token: string) => {
  try {
    await api.user.saveFcmToken(userId, token);
    console.log('FCM Token saved successfully');
  } catch (error) {
    console.error('FCM Token save error:', error);
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

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

  messaging().onMessage(async remoteMessage => {
    console.log('Received foreground message:', remoteMessage);
  });
}; 