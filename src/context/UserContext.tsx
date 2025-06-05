//사용자정보관리
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';
import messaging from '@react-native-firebase/messaging';

type UserContextType = {
  userId: number | null;
  userName: string;
  isLoading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('사용자');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching user info...');
      const userList = await api.user.getUserInfo();
      console.log('Received user data:', userList);
      
      const user = userList[0];
      if (!user || !user.id) {
        throw new Error('사용자 정보가 올바르지 않습니다.');
      }

      setUserId('8');  // 하드코딩된 id
      setUserName(user.name || '사용자');
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userId, userName, isLoading, error, fetchUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 