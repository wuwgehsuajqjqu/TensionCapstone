import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../screens/CareReceiverApp';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const useNotificationListener = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNotification = (remoteMessage: any) => {
    const type = remoteMessage?.data?.type;

    if (type === 'TODAY_CHECK') {
      navigation.navigate('TodayCheck', {
        medicationHour: Number(remoteMessage.data.hour || 16),
        medicationMinute: Number(remoteMessage.data.minute || 0),
        message: remoteMessage.data.message || '오늘 약 복용 시간입니다!',
        scheduleId: remoteMessage.data.scheduleId
          ? Number(remoteMessage.data.scheduleId)
          : undefined,
      });
    } else if (type === 'EMOTION_CHECK') {
      navigation.navigate('EmotionCheck');
    }
  };

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      handleNotification(remoteMessage);
    });

    const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotification(remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        handleNotification(remoteMessage);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);
};

export default useNotificationListener;
