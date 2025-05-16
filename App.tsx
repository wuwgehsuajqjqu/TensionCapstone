// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import CareReceiverApp from './src/components/CareReceiverApp';
import { UserProvider } from './src/context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <CareReceiverApp />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
