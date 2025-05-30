import React from 'react';
import { UserProvider } from './context/UserContext';
import CareReceiverApp from './screens/CareReceiverApp';

const App = () => {
      useNotificationListener(); //알림 리스너 연결하기
  return (
    <UserProvider>
      <CareReceiverApp />
    </UserProvider>
  );
};

export default App;