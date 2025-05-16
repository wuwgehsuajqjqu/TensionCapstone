import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './CareReceiverApp';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ResultScreenProps = {
  route: {
    params: {
      emotionType: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
    };
  };
};

const ResultScreen = ({ route }: ResultScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const { emotionType } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      BackHandler.exitApp(); // 3초 뒤 앱 종료
    }, 3000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  const getEmotionInfo = () => {
    switch (emotionType) {
      case 'GOOD':
        return {
          message: '오늘도\n행복한 하루였네요!',
          backgroundColor: '#F6DFAD', 
          imageSource: require('../assets/images/emotions/happy.png'),
        };
      case 'OKAY':
        return {
          message: '수고 많으셨어요,\n평온한 하루였네요.',
          backgroundColor: '#CCE4C2', 
          imageSource: require('../assets/images/emotions/calm.png'),
        };
      case 'TIRED':
        return {
          message: '많이 애쓰셨어요,\n푹 쉬어요.',
          backgroundColor: '#E0D1FF', 
          imageSource: require('../assets/images/emotions/tired.png'),
        };
      case 'SAD':
        return {
          message: '마음이 무거운 날엔,\n쉬어가도 괜찮아요.',
          backgroundColor: '#BCEBFF', 
          imageSource: require('../assets/images/emotions/sad.png'),
        };
    }
  };

  const emotionInfo = getEmotionInfo();

  return (
    <View style={[styles.container, { backgroundColor: emotionInfo.backgroundColor }]}>
      <Text style={styles.text}>{emotionInfo.message}</Text>
      <Image
        source={emotionInfo.imageSource}
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  icon: {
    width: 100,
    height: 100,
  },
}); 