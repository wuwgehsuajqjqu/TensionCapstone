import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './CareReceiverApp';
import { useUser } from '../context/UserContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Emotion = {
  emoji: string;
  label: string;
  borderColor: string;
  moodStatus: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD';
};

const EmotionCheck = () => {
  const navigation = useNavigation<NavigationProp>();
  const { userName } = useUser();

  //감정 목록
  const emotions: Emotion[] = [
    { emoji: '😄', label: '기분 좋아요', borderColor: '#F1453D', moodStatus: 'GOOD' },
    { emoji: '🙂', label: '괜찮아요', borderColor: '#2ECC71', moodStatus: 'OKAY' },
    { emoji: '😟', label: '피곤해요', borderColor: '#F39C12', moodStatus: 'TIRED' },
    { emoji: '😢', label: '속상해요', borderColor: '#3498DB', moodStatus: 'SAD' },
  ];

  const handleEmotionSelect = (moodStatus: 'GOOD' | 'OKAY' | 'TIRED' | 'SAD') => {
    // 결과 화면으로 바로 이동
    navigation.navigate('ResultScreen', { 
      emotionType: moodStatus
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userName} 님,</Text>
      <Text style={styles.subtitle}>오늘 마음은 어떤가요?</Text>

      <View style={styles.grid}>
        {emotions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { borderColor: item.borderColor }]}
            onPress={() => handleEmotionSelect(item.moodStatus)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default EmotionCheck;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    rowGap: 24,
    columnGap: 24,
    paddingHorizontal: 20,
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
